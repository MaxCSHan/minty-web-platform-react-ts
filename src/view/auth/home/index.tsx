import React from "react";

import Post from "../../../component/Post/index";

const posts = [1,2,3,4,5]

const Home = () => {
  return (
    <div className="h-screen w-screen transition duration-100 ease-in-out mt-14">
      {/* <Searchbar></Searchbar> */}
      <div className=" flex flex-col items-center transition duration-100 ease-in-out sm:bg-gray-100 bg-opacity-80">
        {posts.map((ele,index) =><Post key={index}></Post> )}
      </div>
    </div>
  );
};

export default Home;
