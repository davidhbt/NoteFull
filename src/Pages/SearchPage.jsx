import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, startAt } from "firebase/firestore";
import { db } from "../Config/firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "../Styles/SearchPage.css";

function SearchPage() {
  const location = useLocation();
  const data = location.state?.value || undefined;
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [lastDocs, setLastDocs] = useState([]); // Store last docs for each page
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    if (data === undefined) {
      toast.error("No Search Query");
      navigate("/");
    }
  }, [data, navigate]);

  useEffect(() => {
    fetchPosts(0);
  }, [data]);

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
      const filteredPosts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (post) =>
            post.Title.toLowerCase().includes(data.toLowerCase()) ||
            post.Tags.some((tag) => tag.toLowerCase().includes(data.toLowerCase()))
        );

      setPosts(filteredPosts);

      // Save the last document of this page for future navigation
      const newLastDocs = [...lastDocs];
      newLastDocs[pageIndex] = snapshot.docs[snapshot.docs.length - 1];
      setLastDocs(newLastDocs);
    }

    if (totalPages === 1) {
      const totalDocsSnapshot = await getDocs(postsRef);
      const filteredDocs = totalDocsSnapshot.docs.filter(
        (doc) =>
          doc.data().Title.toLowerCase().includes(data.toLowerCase()) ||
          doc.data().Tags.some((tag) => tag.toLowerCase().includes(data.toLowerCase()))
      );
      setTotalPages(Math.ceil(filteredDocs.length / postsPerPage));
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
        <div className="SearchPage">
          <div className="SearchPageContainer">
            <h1 className="SearchPageTitle">Search Result for: {data}</h1>
            <div className="Home-Page-Posts-Container">
              {posts.length === 0 && <p>No Posts Found</p>}
              {posts.map((post) => (
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
                      <p className="postDate">
                        {new Date(post.Timestamp.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
        </div>
      )}
    </>
  );
}

export default SearchPage;
