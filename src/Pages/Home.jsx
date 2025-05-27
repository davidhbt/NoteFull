import React, { useState } from "react";
import "../Styles/Home.css";
import Posts from "../Components/Posts";

// import { db } from '../firebase-config';
import { db } from "../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-up";
import Top from "../assets/Top.png";
import Loader from "../Components/Loader";
import { toast, ToastContainer } from "react-toastify";


function Home() {
  const adminRef = doc(db, "Admins", "Leul");
  const [FirstName, setFirstName] = useState(null);
  const [LastName, setLastName] = useState(null);
  const [ProfileURL, setProfileURL] = useState(null);
  const [Description, setDescription] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  // const []


  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);
  

  useEffect(() => {
    if (postLoading || adminLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [postLoading, adminLoading]);

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
        setDescription(data.Description);
        setAdminLoading(false);
      } else {
        console.log("No such document!");
        setAdminLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // console.log(postLoading, adminLoading);
  const day = [new Date().getUTCFullYear(), new Date().getMonth(), new Date().getDate()];
  const CurentTime = {
    year: new Date().getUTCFullYear(),
    month: new Date().getUTCMonth(),
    date: new Date().getUTCDate()
  }
  console.log(day);
  console.log(CurentTime)


  return (
    <>
      {loading == true ? (
        <Loader />
      ) : (
        <div className="Home-Page">
          <div className="Home-Page-Container">
            {/* <div className="Home-Page-Profile-Box">
              <div className="Home-Page-Profile-Details">
                <img
                  className="Home-Page-Profile-Details-Image"
                  src={ProfileURL}
                />
                <div className="Home-Page-Profile-Details-ps">
                  <p className="Home-Page-Profile-Details-Name">
                    {FirstName + " " + LastName}
                  </p>

                  <p className="Home-Page-Profile-Details-Paragraph">
                    Personal Blog
                  </p>
                </div>
              </div>
              <div className="Home-Page-Profile-Description">{Description}</div>
            </div> */}
            <div className="Home-Page-Posts">
              <p className="Home-Page-Posts-Title">Latest Posts</p>
              <Posts
                setPostLoading={setPostLoading}
                FirstName={FirstName}
                LastName={LastName}
                ProfileURL={ProfileURL}
              />
            </div>
            <ScrollToTop showUnder={400}>
              <img src={Top} className="ScrollToTop" />
            </ScrollToTop>
          </div>
        </div>
      )}
    </>
  );
}

// function Home() {
//   return (
//     <div className='Home-Page'>
//       <div className="Home-Page-Container">
//         <div className="Home-Page-Profile-Box">
//           <div className="Home-Page-Profile-Details">
//             <img  className="Home-Page-Profile-Details-Image" />
//             <p className='Home-Page-Profile-Details-Paragraph'>Personal Blog</p>
//           </div>
//         </div>
//         <div className="Home-Page-Posts">
//           <p className='Home-Page-Posts-Title'>Latest Posts</p>
//             <Posts/>
//         </div>
//       </div>
//     </div>
//   )
// }

export default Home;
