import React, { use, useEffect, useState } from "react";
import "../Styles/Details.css";
import { db } from "../Config/firebase";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { auth } from "../Config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ScrollToTop from "react-scroll-up";

import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import TurndownService from "turndown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Top from "../assets/Top.png";
import ReactConfirmPopup from "react-confirm-popup";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";
import "../Styles/Markdown.css";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";

import { PencilOutline } from "react-ionicons";

function Detail() {
  const [title, setTitle] = useState('')
  const { id } = useParams();
  const [post, setPost] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [user, setUser] = useState(undefined);
  // console.log(rawMarkdown);
  const [postLoading, setPostLoading] = useState();
  const [adminLoading, setAdminLoading] = useState();
  const [loading, setLoading] = useState();
  const [tags, setTags] = useState();


  console.log(title, 'bbg')
  useEffect(() => {
    const getAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => getAuth;
  }, []);

  const DocRef = doc(db, "Post", id);
  const ProfileRef = doc(db, "Admins", "Leul");

  const navigate = useNavigate();

  useEffect(() => {
    setPostLoading(true);
    // setPostLoading(true);
    const getPost = async () => {
      try {
        const snapshot = await getDoc(DocRef);

        if (snapshot.exists()) {
          const postData = { id: snapshot.id, ...snapshot.data() };
          setPost(postData);
          setRawMarkdown(atob(postData.MarkDown));
          setTitle(postData.Title)
          setPostLoading(false);

          setTags(postData.Tags);
        } else {
          // alert("Document not found");
          // setPostLoading(false);
          setPostLoading(false);

          navigate("/");
        }
      } catch (err) {
        // setPostLoading(false);
        setPostLoading(false);
        toast.error("Cannot Get Post!");
        navigate("/");
      }
    };
    setAdminLoading(true);
    const getProfile = async () => {
      try {
        const snapshot = await getDoc(ProfileRef);

        if (snapshot.exists()) {
          const ProfileData = snapshot.data();
          setProfile(ProfileData);
          console.log("dune bitch");
          setAdminLoading(false);
        } else {
          // alert("Document not found");
          toast.error("Post Not Found.");
          navigate("");
          setAdminLoading(false);
        }
      } catch (err) {
        setAdminLoading(false);
        toast.error("Post not found");
        navigate("");
      }
    };
    // setPostLoading(false);
    getProfile();
    getPost();
  }, []);
  console.log(postLoading, adminLoading);

  useEffect(() => {
    if (postLoading || adminLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [postLoading, adminLoading]);

  const handleEdit = () => {
    console.log(id, "wsg");
    navigate("/editpost", { state: { mark: rawMarkdown, id: id, title: title, tags: tags } });
  };

  return (
    <div className="DetailsPage">
      <div className="DetailsPageContainer">
        {loading == true ? (
          <Loader />
        ) : (
          <div className="DetailsPagePost">
            <div className="DetailsPagePostData">
              <div className="DetailsPagePostAuthor">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    className="DetailsPagePostAuthorImage"
                    src={profile?.ProfileURL}
                  />
                  <p className="DetailsPagePostAuthorName">
                    {profile?.FirstName + " " + profile?.LastName}
                  </p>{" "}
                </div>
                {/* <b className="DetailsPagePostAuthorbutton">x</b/utton> */}
                {/* {user && (
                  <ReactConfirmPopup
                    title="are you sure you wanto delete this Post?"
                    onConfirmClicked={async () => {
                      try {
                        await deleteDoc(DocRef);
                        // alert('wsgg')
                        toast.success("Deleted Post!")
                        navigate("/");
                      } catch (err) {
                        toast.error("Cannot Delete Post!")

                      }
                    }}
                    // onCancelClicked={() => alert('nahh')}

                    trigger={
                      <button className="DetailsPagePostAuthorbutton">x</button>
                    }
                  />
                )} */}
                {user && (
                  <div
                    onClick={handleEdit}
                    style={{ display: "flex", gap: "15px", cursor: "pointer" }}
                  >
                    <p
                      style={{
                        cursor: "pointer",
                        color: "black",
                        fontSize: "18px",
                      }}
                    >
                      Edit page
                    </p>
                    <PencilOutline
                      className="pencilicon"
                      color={"var(--secondary)"}
                      // title={}
                      height="20px"
                      width="20px"
                    />
                  </div>
                )}
              </div>
              <div className="DetailsPagePostTags">
                {tags?.map((tag) => {
                  return <p key={post.id}>{tag}</p>;
                })}
              </div>
              <div>
                Date:{" "}
                {new Date(post?.Timestamp?.seconds * 1000).toLocaleDateString()}
              </div>
              <h1 className="DetailsPagePostTitle">{post?.Title}</h1>
            </div>
            <div className="HomePagePostContent">
              <Markdown
                remarkPlugins={[remarkGfm, remarkMath, remarkFrontmatter]}
                rehypePlugins={[
                  rehypeKatex,
                  rehypeRaw,
                  rehypeHighlight,
                  rehypeSlug,
                  rehypeAutolinkHeadings,
                  // rehypeSanitize,
                ]}
              >
                {rawMarkdown}
              </Markdown>
            </div>
            <ScrollToTop showUnder={160}>
              <img src={Top} className="ScrollToTop" />
            </ScrollToTop>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detail;
