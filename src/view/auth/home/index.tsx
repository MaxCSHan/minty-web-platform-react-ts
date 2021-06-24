import React from "react";
import Navbar from "../../../component/Navebar/index";
import Searchbar from "../../../component/Searchbar/index";

import Post from "../../../component/Post/index";

const posts = [1,2,3,4,5]

const Home = () => {
  return (
    <div className="h-screen transition duration-100 ease-in-out ">
      <Searchbar></Searchbar>
      <div className="flex flex-col items-center transition duration-100 ease-in-out sm:bg-gray-100 bg-opacity-80">
        {posts.map(ele =><Post></Post> )}
      </div>
    </div>
  );
};

export default Home;
