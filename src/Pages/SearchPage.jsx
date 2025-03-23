import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Loader from "../Components/Loader";
import { useState } from "react";
import { useEffect } from "react";
import { collection } from "firebase/firestore";
import { db } from "../Config/firebase";
import { getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import '../Styles/SearchPage.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SearchPage() {
  const location = useLocation();
  const data = location.state?.value || undefined;
  const [adminLoading, setAdminLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [ProfileURL, setProfileURL] = useState(null);

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()

  const adminRef = doc(db, "Admins", "Leul");

  useEffect(() => {
    // toast.success("wsgg")
    setAdminLoading(true);
    const fetchAdminData = async () => {
      const adminDoc = await getDoc(adminRef);
      if (adminDoc.exists()) {
        console.log(adminDoc.data());
        const data = adminDoc.data();
        setFirstName(data.FirstName);
        setLastName(data.LastName);
        setProfileURL(data.ProfileURL);
        setAdminLoading(false);
      } else {
        console.log("No such document!");
        setAdminLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      const postsRef = collection(db, "Post");
      const snapshot = await getDocs(postsRef);
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() =>{
    if (data ==undefined){
      toast.error('no search query.')
      navigate('/')
    }
  }, [data])

  console.log(posts);
  console.log(loading);

  console.log(data);
  return (
    <>
      {loading == true ? (
        <Loader />
      ) : (
        <div className="SearchPage">
          <div className="SearchPageContainer">
            <h1 className="SearchPageTitle">Search Result for: {data}</h1>
            <div className="Home-Page-Posts-Container">
              {/* {loading && <div className="loader"></div>} */}
              {posts.map((post) => (
                post.Title.toLowerCase().includes(data.toLowerCase()) ||
                post.Tags.some(tag => tag.toLowerCase().includes(data.toLowerCase()))
              ) && (
                <Link to={`/details/${post.id}`} className="Home-Page-Post" key={post.id}>
                              <img className="Home-Page-Post-img" src={post.BannerUrl} alt="Post" />
                              <div className="Home-Page-Post-Content">
                                <div className="Home-Page-Post-Tags">
                                  {post.Tags.map((tag, index) => (
                                    <p className="Home-Page-Post-Tag" key={index}>
                                      {tag}
                                    </p>
                                  ))}
                                </div>
                                <div className="Home-Page-Post-Titlee">{post.Title}</div>
                                <div className="Home-Page-Post-ProfileData">
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <img className="Home-Page-Post-Profile-Img" src={ProfileURL} alt="Profile" />
                                    <p className="Home-Page-Post-Profile-Name">
                                      {FirstName + " " + LastName}
                                    </p>
                                  </div>
                                  <p className="postDate">
                                    {new Date(post.Timestamp.seconds * 1000).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchPage;
