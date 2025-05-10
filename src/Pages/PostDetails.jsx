import React, { useEffect, useState } from "react";
import "../Styles/PostDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { TagsInput } from "react-tag-input-component";
import { db } from "../Config/firebase";
import { collection, addDoc, Timestamp, Firestore } from "firebase/firestore";
import axios from "axios";
import ImageKit from "imagekit-javascript";
import { marked } from "marked";
import { toast } from "react-toastify";

function PostDetails() {
  const [title, setTitle] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tags, setTags] = useState(["Tecg"]);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [taglimit, setTaglimit] = useState(false);
  const location = useLocation();
  const data = location.state?.data || undefined;
  const [banner, setBanner] = useState();
  const [allowUpload, setAllowUpload] = useState(false);
  const navigate = useNavigate();
  const [bannerUrl, setBannerURL] = useState(null);
  const [isUploading, setIsUploading] = useState(true);


  // const finalTitle = marked(data)
  // console.log(first)
  console.log(marked(data));


  const imagekit = new ImageKit({
    publicKey: "public_gm6QzMSvtXTRUznP5BaUJbnAM6s=", // Your public key
    urlEndpoint: "https://ik.imagekit.io/notefull", // Your URL endpoint
  });

  const postRef = collection(db, "Post");

  const GetAuth = async () => {
    try {
      const response = await fetch("https://imagekit-la4g.onrender.com/auth");
      const data = await response.json();
      return data;
    } catch (err) {
      toast.error("Error Getting Image Upload Data");
      return null;
    }
  };

  useEffect(() => {
    if (imageUrl == null) {
      setIsUploading(false);
    }
  }, []);

  console.log(banner);

  console.log(data);

  useEffect(() => {
    if (title  && tags.length > 0) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [title, imageUrl, tags]);

  useEffect(() => {
    if (data == undefined) {
      navigate("/post");
      console.log("nahhh");
    } else {
      console.log("good");
    }
  }, []);

  useEffect(() => {
    if (tags.length > 3) {
      setTaglimit(true);
    } else {
      setTaglimit(false);
    }
  }, [tags]);



  const HandlePost = async () => {
    for (let tag of tags) {
      if (tag.trim() === "") {
      toast.error("Tags cannot be empty or just spaces");
      return;
      }
    }
    try {
      const finalMk = btoa(data);
      const currentDate = new Date();

      await addDoc(postRef, {
        Title: title,
        MarkDown: finalMk,
        BannerUrl: !imageUrl ? 'https://ik.imagekit.io/notefull/banner-pic_3YozeElHw' : imageUrl,
        Tags: tags,
        Timestamp: currentDate,
      });
      navigate("/");
      // console.log(finalTitle)/
      toast.success("Post Uploaded!"); 
      
    } catch (err) {
      // alert("Post error");
      toast.error("Post Error")

      console.log(err);
    }
  };


  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setBanner(event.target.result);
    };

    reader.readAsDataURL(file);

    console.log("file dropped", file);

    setImageUrl(null);

    /////////// Upload COde here bitchhh ///////////
    try {
      setIsUploading(true);
      const authData = await GetAuth();
      if (!authData) {
        toast.error("Error Getting Image Upload Data");

        setIsUploading(false);
        return;
      }
      imagekit.upload(
        {
          file: file,
          fileName: "banner-pic",
          useUniqueFileName: true,
          token: authData.token,
          expire: authData.expire,
          signature: authData.signature,
        },
        (err, result) => {
          if (err) {
            toast.error("Cannot Upload Image");
          } else {
            console.log(
              "maybe u aint a disapintment... this is the image uploaded: ",
              result
            );
            setImageUrl(result.url);
            console.log(setImageUrl);
            setIsUploading(false);
          }
        }
      );
    } catch (err) {
      toast.error("Uknown error")
      
      setIsUploading(false);
    }
  };

  console.log(imageUrl);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/jpeg": [".jpeg", ".JPEG"],
      "image/png": [".png", ".PNG"],
    },
  });

  return (
    <div className="postDetails">
      <div className="post-details-container">
        <h1 className="post-details-title">Almost Dune....</h1>
        <div className="post-details-content">
          <div className="post-details-header-container">
            <h1 className="post-details-header-title">Header</h1>
            <input
              type="text"
              className="post-details-header-input"
              required={true}
              maxLength={50}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="banner-container">
            <h1>Add Banner</h1>
            {imageUrl ? (
              <div
                style={{ backgroundImage: `url(${banner})` }}
                {...getRootProps({ className: "bannerr-place" })}
              >
                <input {...getInputProps()} />
              </div>
            ) : (
              <div {...getRootProps({ className: "banner-place" })}>
                <input {...getInputProps()} />
                <p>
                  drop or click here to upload a banner, make sure the its high
                  quality
                </p>
              </div>
            )}
            {isUploading && <p>Uploading....</p>}
            {imageUrl && <p>Uploaded</p>}
          </div>
          <div className="topic-place">
            <h1>Add Topic</h1>
            <TagsInput
              value={tags}
              onChange={setTags}
              name="tags"
              placeHolder="add Topics..."
              className="topic-input"
            />
            {taglimit && (
              <p style={{ color: "red" }}>
                not recomended to add more than 3 Tags
              </p>
            )}
          </div>
          <div className="post-details-btn-container">
            <input
              type="submit"
              className="post-details-button"
              value="submit"
              disabled={isSubmitDisabled}
              onClick={HandlePost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
