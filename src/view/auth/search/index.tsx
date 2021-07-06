import {useState} from "react";
import Searchbar from "../../../component/Searchbar/index";
import Post from "../../../component/Post/index";

const posts = [1,2,3,4,5,7,8,9,10,11,12,13,14,15]


const Search = () => {
  const [grid,setGrid] =useState(false);

  const onGridSwitch = (isGrid:boolean) => { setGrid(isGrid);}


  return (
    <div className="h-screen w-screen transition duration-100 ease-in-out mt-14">
      <Searchbar onGridSwitch={onGridSwitch}></Searchbar>
      <div className={`mt-16 flex ${grid?"flex-row flex-wrap":"flex-col"}  justify-center items-center transition duration-100 ease-in-out sm:bg-gray-100 bg-opacity-80`}>
        {posts.map((ele,index) =><Post key={`post_${index}`}></Post> )}
      </div>
    </div>
  );
};

export default Search;
