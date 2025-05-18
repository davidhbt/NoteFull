import React, { useEffect, useState } from "react";
import "../Styles/PostDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { TagsInput } from "react-tag-input-component";
import { db } from "../Config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ImageKit from "imagekit-javascript";
import { toast } from "react-toastify";

function UpdatePostDetails() {
  const [title, setTitle] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tags, setTags] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [taglimit, setTaglimit] = useState(false);
  const location = useLocation();
  const data = location.state?.data || undefined;
  const id = location.state?.id || undefined;
  const titlee = location.state?.title || undefined;
  const tagss = location.state?.tags || undefined;
  const [banner, setBanner] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setTags(tagss);
    setTitle(titlee);
  }, [tagss, titlee]);

  useEffect(() => {
    if (title && tags.length > 0) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [title, tags]);

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
        const finalMk = btoa(data); // Encode the markdown content in Base64
        const currentDate = new Date(); // Get the current date

        // Reference the document by its ID
        const docRef = doc(db, "Post", id);

        // Update the document
        await updateDoc(docRef, {
          Title: title,
          MarkDown: finalMk,
          BannerUrl: imageUrl || 'https://ik.imagekit.io/notefull/banner-pic_HoFZo1KsF',
          Tags: tags,
          Timestamp: currentDate, // Update the Timestamp field with the current date
        });

        toast.success("Post updated successfully!");
        navigate("/"); // Redirect to the homepage
      } catch (err) {
        console.error("Error updating document:", err);
        toast.error("Failed to update the post.");
      }
    };

    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          setBanner(event.target.result);
        };

        reader.readAsDataURL(file);

        console.log("file dropped", file);

        setImageUrl(null);

        // Upload logic here
      },
      maxFiles: 1,
      accept: {
        "image/jpeg": [".jpeg", ".JPEG"],
        "image/png": [".png", ".PNG"],
      },
    });

    return (
      <div className="postDetails">
        <div className="post-details-container">
          <h1 className="post-details-title">Update Post</h1>
          <div className="post-details-content">
            <div className="post-details-header-container">
              <h1 className="post-details-header-title">Header</h1>
              <input
                type="text"
                className="post-details-header-input"
                required={true}
                maxLength={50}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
            <div className="banner-container">
              <h1>Add Banner</h1>
              {imageUrl ? (
                <div
                  style={{ backgroundImage: `url(${banner})` }}
                  {...getRootProps({ className: "banner-place" })}
                >
                  <input {...getInputProps()} />
                </div>
              ) : (
                <div {...getRootProps({ className: "banner-place" })}>
                  <input {...getInputProps()} />
                  <p>Drop or click here to upload a banner</p>
                </div>
              )}
            </div>
            <div className="topic-place">
              <h1>Add Topic</h1>
              <TagsInput
                value={tags}
                onChange={setTags}
                name="tags"
                placeHolder="Add Topics..."
                className="topic-input"
              />
              {taglimit && (
                <p style={{ color: "red" }}>Not recommended to add more than 3 tags</p>
              )}
            </div>
            <div className="post-details-btn-container">
              <input
                type="submit"
                className="post-details-button"
                value="Update Post"
                disabled={isSubmitDisabled}
                onClick={HandlePost}
              />
            </div>
          </div>
        </div>
      </div>
    );
}

export default UpdatePostDetails;
