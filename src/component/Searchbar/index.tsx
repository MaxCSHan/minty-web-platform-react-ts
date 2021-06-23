import { Link } from "react-router-dom";
import {useState} from "react"

const Skills = ["Photography", "Modeling", "Make-up Artist"];

const Searchbar = () => {
    const [selectFilter,setSelectFilter] = useState('');

  return (
    <div>
      <div className="flex flex-col dark:bg-gray-800 dark:text-white ">
        <div className="h-16 flex items-center  border-b">
          <div className="ml-3 h-10 w-4/6  md:w-7/12 lg:w-4/6 2xl:w-3/4  border rounded-l-full flex items-center bg-gray-100 focus:bg-white">
            <div className="ml-4 mr-2 flex items-center ">
              <i className="fas fa-search"></i>
            </div>
            <input
              className="w-full h-10 border-t border-b  bg-gray-100 focus:bg-white outline-none transition duration-100 ease-in-out"
              type="text"
            ></input>
          </div>
          <div className="text-sm font-semibold mr-3 h-10 w-2/6 md:w-5/12 lg:w-2/6 2xl:w-1/4  min-w-min border border-l-0 rounded-r-full  flex items-center pl-2 md:pl-4 bg-white ">
            {Skills.map((skill) => (
              <div className={`h-6 rounded-full px-3 mx-2 whitespace-nowrap hidden first:flex md:flex items-center md:hover:bg-gray-100    ${selectFilter===skill?'md:bg-blue-500 md:hover:bg-blue-500 md:text-white':''}`}
              onClick={()=>setSelectFilter(skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
