import React from "react";
import Searchbar from "../../../component/Searchbar/index";
import { useHistory } from 'react-router-dom'

import Post from "../../../component/Post/index";

const posts = [1,2,3,4,5,7,8,9,10,11,12,13,14,15]

type searchProps = {
  keyword?:string;
};

const Search = () => {
  return (
    <div className="h-screen w-screen transition duration-100 ease-in-out mt-14">
      <Searchbar></Searchbar>
      <div className="mt-16 flex flex-wrap justify-center items-center transition duration-100 ease-in-out sm:bg-gray-100 bg-opacity-80">
        {posts.map((ele,index) =><Post key={index}></Post> )}
      </div>
    </div>
  );
};

export default Search;
