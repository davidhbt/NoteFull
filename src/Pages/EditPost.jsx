import React, { useState, useEffect, use } from "react";
import "../Styles/EditPost.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";

import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../Config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { marked } from "marked";
import { useLocation } from "react-router-dom";

import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import ReactConfirmPopup from "react-confirm-popup";

function EditPost() {
  const [content, setContent] = useState("");
  const [user, setUser] = useState(undefined);
  const location = useLocation();
  const id = location.state?.id || undefined;
  const mark = location.state?.mark || undefined;

  const DocRef = doc(db, "Post", id);

  useEffect(() => {
    setContent(mark);
  }, []);

  console.log(id);

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

  const navigate = useNavigate();

  const handleclick = async () => {
    try {
      if (!content || content === mark) {
        toast.error("No changes to update!");
        return;
      }

      // Encode the content in Base64
      const encodedContent = btoa(content);

      await updateDoc(DocRef, {
        MarkDown: encodedContent, // Update the MarkDown field with the Base64-encoded content
      });

      toast.success("Post updated successfully!");
      navigate("/"); // Redirect to the homepage or another page after updating
    } catch (err) {
      console.error("Error updating document:", err);
      toast.error("Failed to update the post.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(DocRef);
      toast.success("Deleted Post!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Cannot Delete Post!");
    }
  };
  

  return (
    <div className="markdown-upload">
      <div className="markdown-upload-container">
        <h1 className="markdown-upload-title">Edit Post</h1>
        <div className="markdown-upload-text-area">
          <SimpleMDE
            value={content}
            onChange={setContent}
            className="markdown-upload-text-input"
          />
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
            
                  <ReactConfirmPopup
                    title="are you sure you wanto delete this Post?"
                    onConfirmClicked={() => handleDelete()}
                    // onCancelClicked={() => alert('nahh')}

                    trigger={
                       <button
            className="markdown-upload-button"
            disabled={!content}
            style={{ background: "red" }}
            // onClick={handleDelete}
          >
            Delete Post
          </button>
                    }
                  />
         
          <button
            className="markdown-upload-button"
            disabled={!content || content === mark}
            onClick={handleclick}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
