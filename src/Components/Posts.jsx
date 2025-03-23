import React, { useEffect, useState } from "react";
import { db } from "../Config/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import ReactPaginate from "react-paginate";
// import "./Pagination.css"; // Add custom styles

function Posts({ FirstName, LastName, ProfileURL }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 9; // Adjust per page count

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      const postsRef = collection(db, "Post");
      const q = query(postsRef, orderBy("Timestamp", "desc"));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Get current posts for the page
  const startIndex = currentPage * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="anotherPostPageContainer">
        <div className="Home-Page-Posts-Container">
          {posts.length === 0 && <>No Posts</>}

          {currentPosts.map((post) => (
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
                    {new Date(post.Timestamp.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}


          {/* React Paginate Component */}
          
        </div>
        <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={Math.ceil(posts.length / postsPerPage)}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      )}
    </>
  );
}

export default Posts;
