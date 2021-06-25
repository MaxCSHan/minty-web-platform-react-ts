import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isDropdown, setIsDropdown] = useState(false);

  return (
    <div>
      <div className="flex flex-col dark:bg-gray-800 dark:text-white ">
        <div className="h-14 flex items-center border-b justify-between">
          <div className="h-full ml-3 mr-1 sm:mr-3 text-sm sm:text-base flex items-center">
            <Link to="/">MintySpace</Link>
          </div>
          <div className="ml-1 sm:ml-3 h-8 sm:h-10 w-60 border rounded-full flex items-center ">
            <div className="ml-4 mr-2 flex items-center ">
              <i className="text-sm sm:text-base fas fa-search"></i>
            </div>
            <input
              className="w-full h-8 sm:h-10 border-t border-b rounded-r-full bg-gray-100 focus:bg-white outline-none transition duration-200 ease-in-out"
              type="text"
            ></input>
          </div>

          <div className="h-full w-48 md:w-64  flex items-center justify-around">
            <Link to="/Auth">
              <div>
                <i className="sm:text-2xl far fa-comment"></i>
              </div>
            </Link>
              <div className="relative">
                <div onClick={()=>setIsDropdown(!isDropdown)}>
                  <i className="sm:text-2xl far fa-heart cursor-pointer"></i>
                </div>

                <div
                  className={`origin-top-right absolute  -right-10 mt-2 py-2 w-80 sm:w-120 h-140 z-10 text-xs sm:text-base rounded-md bg-white border  focus:outline-none ${
                    isDropdown ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  } transition-all duration-200 ease-in-out flex flex-col`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                    <div className="h-12 border-b border-gray-50 flex items-center px-2">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="mx-2">tsukasakasa1231 liked your photo.</div> 
                    </div>
                </div>
              </div>

            <Link to="/User">
              <div>
                <i className=" sm:text-2xl fas fa-user-circle"></i>
              </div>
            </Link>

            {/* <Link to="/auth">
              <div className="h-8 hidden sm:flex items-center bg-primary text-white font-semibold cursor-pointer rounded-full px-4">
                Login
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
