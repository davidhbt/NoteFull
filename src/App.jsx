import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import PostDetails from "./Pages/PostDetails";
import MarkdownUpload from "./Pages/MarkdownUpload";
import EditProfile from "./Pages/EditProfile";
import Detail from "./Pages/Detail";
import { ToastContainer } from "react-toastify";
import SearchPage from "./Pages/SearchPage";
import NotFound from "./Pages/NotFound";
import EditPost from "./Pages/EditPost";
import UpdatePostDetails from "./Pages/UpdatePostDetails";
// import MarkdownUpdate from "./Pages/MarkdownUpdate";


function App() {
  return (
    <div>
    <ToastContainer/>

      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/post" element={<Post />} /> */}
        <Route path="/postDetails" element={<PostDetails />} />
        <Route path="/post" element={<MarkdownUpload />} />
        <Route path="/editprofile" element={<EditProfile/>} />
        <Route path="/details/:id" element={<Detail/>} />
        <Route path="/search/" element={<SearchPage/>} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/editpost" element={<EditPost/>} />
        <Route path="/editDetails" element={<UpdatePostDetails/> } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
