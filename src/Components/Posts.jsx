import React, { useEffect, useState } from "react";
import { db } from "../Config/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  startAt,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import ReactPaginate from "react-paginate";

function Posts({ FirstName, LastName, ProfileURL }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [lastDocs, setLastDocs] = useState([]); // Store last docs for each page
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const fetchPosts = async (pageIndex) => {
    setLoading(true);
    const postsRef = collection(db, "Post");

    let q;

    if (pageIndex === 0) {
      // First page: get first 9 posts
      q = query(postsRef, orderBy("Timestamp", "desc"), limit(postsPerPage));
    } else if (pageIndex > currentPage && lastDocs[pageIndex - 1]) {
      // Moving forward: use last saved doc
      q = query(
        postsRef,
        orderBy("Timestamp", "desc"),
        startAfter(lastDocs[pageIndex - 1]),
        limit(postsPerPage)
      );
    } else if (pageIndex < currentPage && lastDocs[pageIndex]) {
      // Moving backward: use stored doc for that page
      q = query(
        postsRef,
        orderBy("Timestamp", "desc"),
        startAt(lastDocs[pageIndex]),
        limit(postsPerPage)
      );
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // Save the last document of this page for future navigation
      const newLastDocs = [...lastDocs];
      newLastDocs[pageIndex] = snapshot.docs[snapshot.docs.length - 1];
      setLastDocs(newLastDocs);
    }

    if (totalPages === 1) {
      const totalDocsSnapshot = await getDocs(collection(db, "Post"));
      setTotalPages(Math.ceil(totalDocsSnapshot.docs.length / postsPerPage));
    }

    setCurrentPage(pageIndex);
    setLoading(false);
  };

  const handlePageClick = ({ selected }) => {
    fetchPosts(selected);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="anotherPostPageContainer">
          <div className="Home-Page-Posts-Container">
            {posts.length === 0 && <>No Posts</>}

            {posts.map((post) => (
              <Link
                to={`/details/${post.id}`}
                className="Home-Page-Post"
                key={post.id}
              >
                <img
                  className="Home-Page-Post-img"
                  src={post.BannerUrl}
                  alt="Post"
                />
                <div className="Home-Page-Post-Content">
                  <div className="Home-Page-Post-Tags">
                    {post.Tags.map((tag, index) => (
                      <p className="Home-Page-Post-Tag" key={index}>
                        {tag}
                      </p>
                    ))}
                  </div>
                  <div className="Home-Page-Post-Titlee">
                    {post.Title.length > 15 ? <>{post.Title.slice(0, 25)}...</> : <>{post.Title}</>}
                  </div>
                  <div className="Home-Page-Post-ProfileData">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        className="Home-Page-Post-Profile-Img"
                        src={ProfileURL}
                        alt="Profile"
                      />
                      <p className="Home-Page-Post-Profile-Name">
                        {FirstName + " " + LastName}
                      </p>
                    </div>
                    <p className="postDate">
                      {new Date(
                        post.Timestamp.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* React Paginate Component */}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={totalPages}
            onPageChange={handlePageClick}
            forcePage={currentPage}
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
