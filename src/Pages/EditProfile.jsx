import React, { useEffect, useState } from "react";
import "../Styles/EditProfile.css";
import { useDropzone } from "react-dropzone";
import ImageKit from "imagekit-javascript";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../Config/firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "../Config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";

function EditProfile() {
  const [FirstName, setFirstName] = useState("Loading");
  const [LastName, setLastName] = useState("Loading");
  const [Profile, setProfile] = useState(null);
  const [ProfileUrl, setProfileUrl] = useState();
  const [description, setDescription] = useState("Loading");
  const [data, setData] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const getAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => getAuth;
  }, []);

  useEffect(() => {
    if (user === null) {
      navigate("/auth");
    }
  }, [user]);
  const docRef = doc(db, "Admins", "Leul");

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const ProfileData = snapshot.data();
          setData(ProfileData);
          console.log(data);
          setFirstName(ProfileData.FirstName);
          setLastName(ProfileData.LastName);
          setDescription(ProfileData.Description);
          // setProfileUrl(ProfileData.ProfileURL)
          setProfileUrl(ProfileData.ProfileURL);
          console.log(ProfileUrl);
          setLoading(false);
        } else {
          toast.error('uknown error occured')
          setLoading(false);
        }
      } catch (err) {
      toast.error('uknown error occured')
        
        console.log(err);
      }
    };
    getProfile();
  }, []);

  const GetAuth = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth");
      const data = await response.json();
      return data;
    } catch (err) {
      toast.error('uknown error occured')

      return null;
    }
  };

  const onDrop = async (acceptedFiles) => {
    console.log("wsg baby girl");
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setProfile(event.target.result);
    };

    reader.readAsDataURL(file);

    console.log("file dropped", file);

    setProfileUrl(null);

    try {
      setIsUploading(true);
      const authData = await GetAuth();
      if (!authData) {
        toast.error('uknown error occured')

        setIsUploading(false);
        return;
      }
      imagekit.upload(
        {
          file: file,
          fileName: "Profile-pic",
          useUniqueFileName: true,
          token: authData.token,
          expire: authData.expire,
          signature: authData.signature,
        },
        (err, result) => {
          if (err) {
      toast.error('uknown error occured')
            
          } else {
            console.log(
              "maybe u aint a disapintment... this is the image uploaded: ",
              result
            );
            setProfileUrl(result.url);
            //   console.log(setImageUrl);
            setIsUploading(false);
          }
        }
      );
    } catch (err) {
      toast.error('uknown error occured')
      setIsUploading(false);
    }
  };
  const imagekit = new ImageKit({
    publicKey: "public_gm6QzMSvtXTRUznP5BaUJbnAM6s=", // Your public key
    urlEndpoint: "https://ik.imagekit.io/notefull", // Your URL endpoint
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/jpeg": [".jpeg", ".JPEG"],
      "image/png": [".png", ".PNG"],
    },
  });

  return (
    <>
      {loading == true ? (
        <Loader />
      ) : (
        <div className="editprofile-page">
          <div className="editprofile-container">
            <h1 className="editprofile-title">Edit Profile</h1>
            <form
              className="editprofile-input"
              onSubmit={(e) => {
                e.preventDefault();
                const updateProfile = async () => {
                  try {
                    await updateDoc(docRef, {
                      FirstName,
                      LastName,
                      Description: description,
                      ProfileURL: ProfileUrl,
                    });
                    // alert("Profile updated successfully");
                    toast.success("Profile Updated!")
                    navigate("/");
                  } catch (err) {
                    toast.error("Profile Updating Failed")
                    
                    console.log(err);
                  }
                };
                updateProfile();
                // alert('wsg')
              }}
            >
              {ProfileUrl !== null ? (
                <div
                  {...getRootProps({
                    className: "editprofile-input-box-upload",
                  })}
                  style={{
                    backgroundImage: `url(${ProfileUrl})`,
                    backgroundSize: "200px 200px",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* <label className="editprofile-input-label">Profile pic</label> */}
                  {loading && (
                    <label className="editprofile-input-label">Loading</label>
                  )}
                  <input {...getInputProps()} disabled={loading} />
                </div>
              ) : (
                <div
                  {...getRootProps({
                    className: "editprofile-input-box-upload",
                  })}
                >
                  <label className="editprofile-input-label">Profile pic</label>
                  <input {...getInputProps()} disabled={loading} />
                </div>
              )}

              <div className="editprofile-input-box">
                <label className="editprofile-input-label">First Name</label>
                <input
                  disabled={loading}
                  type="text"
                  className="editprofile-input-names"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={FirstName}
                />
              </div>
              <div className="editprofile-input-box">
                <label className="editprofile-input-label">Last Name</label>
                <input
                  disabled={loading}
                  type="text"
                  className="editprofile-input-names"
                  onChange={(e) => setLastName(e.target.value)}
                  value={LastName}
                />
              </div>
              <input
                type="submit"
                value="Update"
                className="editprofile-submit"
                disabled={
                  !FirstName.trim() || 
                  !LastName.trim() ||
                  !description.trim() ||
                  !ProfileUrl ||
                  loading
                }
                // on={alert('wsgg')}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EditProfile;
