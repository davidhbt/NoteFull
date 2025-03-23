import React, { useState, useEffect, use } from "react";
import "../Styles/MarkdownUpload.css";
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
import { useNavigate } from "react-router-dom";
import { auth } from "../Config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {marked} from 'marked'


import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";

function MarkdownUpload() {
  const [content, setContent] = useState("");
  const[user, setUser] = useState(undefined)

  // const navigate = useNavigate()

  useEffect(() => {
    const getAuth =  auth.onAuthStateChanged((user) =>{
      setUser(user)
    })
    return () => getAuth
  }, [])

  useEffect(() =>{
    if(user === null){
      navigate('/auth')
    }
  }, [user])

  console.log(user)

  const navigate = useNavigate()

  const handleclick = () => {
    navigate('/postDetails', {state: {data: content}})
  }


  console.log(content)

  return (
    <div className="markdown-upload">
      <div className="markdown-upload-container">
        <h1 className="markdown-upload-title">Markdown Preview</h1>
        <div className="markdown-upload-text-area">
          <SimpleMDE value={content} onChange={setContent}  className="markdown-upload-text-input" />
          {/* <textarea className="markdown-upload-text-input" onChange={(e) => setContent(e.target.value)}></textarea> */}
          {/* <div className="markdown-upload-text-preview"> */}
          {/* <Markdown>{content}</Markdown> */}
          {/* </div> */}
        </div>
        <button className="markdown-upload-button"
        disabled={!content }
         onClick={handleclick}>Next</button>
      </div>
    </div>
  );
}

export default MarkdownUpload;
