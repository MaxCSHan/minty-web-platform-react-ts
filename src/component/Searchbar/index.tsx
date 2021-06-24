// import { Link } from "react-router-dom";
import { useState } from "react";

const Skills = ["Photography", "Modeling", "Make-up Artist"];

const Searchbar = () => {
  const [selectFilter, setSelectFilter] = useState("Photography");
  const [isDropdown, setIsDropdown] = useState(false);

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
            <div className=" hidden sm:flex items-center ">
              {Skills.map((skill,index) => (
                <div
                key={`${index}-${skill}`}
                  className={`h-6 rounded-full px-3 mx-2 whitespace-nowrap hidden first:flex md:flex items-center md:hover:bg-gray-100    ${
                    selectFilter === skill
                      ? "md:bg-blue-500 md:hover:bg-blue-500 md:text-white"
                      : ""
                  }`}
                  onClick={() => setSelectFilter(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>

            <div className="relative inline-block text-left sm:hidden">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full whitespace-nowrap  px-4 py-2 text-sm font-medium text-gray-700  focus:outline-none "
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setIsDropdown(!isDropdown)}
                >
                  {selectFilter}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div
                className={`origin-top-right absolute right-0 mt-2 w-56 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
                  isDropdown ? "opacity-100 scale-100" : "opacity-0 scale-90"
                } transition-all duration-200 ease-in-out`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <div className="py-1" role="none">
                  {Skills.map((skill, index) => (
                    <a
                      href="/"
                      className="text-gray-700 block px-4 py-2 text-sm "
                      role="menuitem"
                      key={`menu-item-${index}`}
                      id={`menu-item-${index}`}
                      onClick={() => {
                        setSelectFilter(skill);
                        setIsDropdown(!isDropdown);
                      }}
                    >
                      {skill}
                    </a>
                  ))}

                  {/* <form method="POST" action="#" role="none">
                    <button
                      type="submit"
                      className="text-gray-700 block w-full text-left px-4 py-2 text-sm"
                      role="menuitem"
                      id="menu-item-3"
                    >
                      Sign out
                    </button>
                  </form> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
