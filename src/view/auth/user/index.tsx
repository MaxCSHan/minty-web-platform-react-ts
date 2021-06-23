import React from "react";
import Navbar from "../../../component/Navebar/index";
import Post from "../../../component/Post/index";

const posts = [1,2,3,4,5]

const User = () => {
  return (
    <div className="h-screen transition duration-100 ease-in-out">
      <div className="flex flex-col items-center transition duration-100 ease-in-out">
        {posts.map(ele =><Post></Post> )}
        asss
      </div>
    </div>
  );
};

export default User;
