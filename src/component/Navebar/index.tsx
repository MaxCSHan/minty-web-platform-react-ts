import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { logout } from "../../services/authService";

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};
const Skills = ["Photography", "Modeling", "Styling"];

const recommendations = ["Jolie", "Eric", "Leo", "Luke"];
const notifications = ["tsukasakasa1231", "max123", "ggaaw123"];

const MiniSearchbar = () => {
  const history = useHistory();
  const search = new URLSearchParams(useLocation().search);
  const [selectFilter, setSelectFilter] = useState(
    search.get("cate") || "Photography"
  );
  const [inputValue, setInputValue] = useState(search.get("keyword") || "");
  const [isDropdown, setIsDropdown] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.match(/^(?!\s*$).+/)) {
        history.push({
          pathname: "/search",
          search: `?keyword=${inputValue}&cate=${selectFilter}`,
          state: { keyword: inputValue },
        });
      }
    }
  };

  const clickSearch = (clickValue:string) => {
    if (inputValue.match(/^(?!\s*$).+/)) {
      history.push({
        pathname: "/search",
        search: `?keyword=${clickValue}&cate=${selectFilter}`,
        state: { keyword: clickValue },
      });
    }
};

  const clickCatSearch = (category:string) => {
      if (inputValue.match(/^(?!\s*$).+/)) {
        history.push({
          pathname: "/search",
          search: `?keyword=${inputValue}&cate=${category}`,
          state: { keyword: inputValue },
        });
      }
  };

  return (
    <div className={`relative ml-1 sm:ml-3 h-8 sm:h-10 w-60 sm:w-160 z-20  border rounded-full flex items-center ${ inputValue && isFocus ?"border-b-0":""}`}>
      <div className="ml-4 mr-2 flex items-center z-20">
        <i className="text-sm sm:text-base fas fa-search"></i>
      </div>
      <input
        className={`appearance-none w-full h-8 sm:h-10 z-20  border-t rounded-r-full bg-gray-100 focus:bg-white outline-none transition duration-200 ease-in-out ${ inputValue && isFocus ?"border-b-0":" border-b"}`}
        type="text"
        value={inputValue}
        placeholder={"What are you looking for?"}
        onChange={(e) => handleInput(e)}
        onKeyPress={(e) => handleKeyPress(e)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      ></input>
      
      <div
        className={` ${
          inputValue && isFocus ? "opacity-100 visible" : "opacity-0 invisible"
        } absolute top-0 z-0 w-full shadow-lg bg-white rounded-3xl focus:outline-none transition-all duration-200 ease-in-out`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="h-full flex flex-col pt-8 ">
          {recommendations.map((ele) => (
            <div className="h-10 pl-10  flex items-center hover:bg-gray-50 "
            onClick={()=>clickSearch(ele)}
            >
              {ele}
            </div>
          ))}
          <div className="pl-6 text-sm text-gray-600 ">Filter:</div>
          {
            Skills.map((skill,index)=>(
              <div className="h-10 pl-10  flex items-center hover:bg-gray-50 last:rounded-b-3xl font-bold"
              key={`miniSearchbarOption_${index}`}
              onClick={()=>clickCatSearch(skill)}
              >
                {skill}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isDropdown, setIsDropdown] = useState(false);

  return (
    <div className="fixed h-14 flex w-screen z-20 bg-white dark:bg-gray-800 dark:text-white items-center border-b justify-between">
      <div className="h-full ml-3 mr-1 sm:mr-3 text-sm sm:text-base flex items-center">
        <Link to="/">MintySpace</Link>
      </div>
      {usePathname() === "/search" ? "" : <MiniSearchbar></MiniSearchbar>}

      <div className="h-full w-48 md:w-64  flex items-center justify-around mr-3">
        <Link to="/">
          <div>
            <i className="sm:text-2xl fas fa-film"></i>
          </div>
        </Link>
        <Link to="/chat">
          <div>
            <i className="sm:text-2xl far fa-comment"></i>
          </div>
        </Link>
        <div className="relative">
          <button
            className="focus:outline-none"
            onClick={() => setIsDropdown(!isDropdown)}
            onBlur={() => setIsDropdown(false)}
          >
            <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
          </button>

          <div
            className={`origin-top-right absolute  -right-10 mt-2 py-2 w-80 sm:w-120 h-140 z-20 text-xs sm:text-base rounded-md bg-white border  focus:outline-none ${
              isDropdown
                ? "opacity-100 scale-100 visible "
                : "opacity-0 scale-90 invisible "
            } transition-all duration-200  ease-in-out flex flex-col`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            {notifications.map((note, index) => (
              <div
                className="h-12 border-b border-gray-50 flex items-center px-2"
                key={`notification_${index}`}
              >
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="mx-2">{note} liked your photo.</div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/User">
          <div>
            <i className=" sm:text-2xl fas fa-user-circle"></i>
          </div>
        </Link>

        <Link to="/auth">
              <div className="h-8 hidden sm:flex items-center bg-primary text-white font-semibold cursor-pointer rounded-full px-4"
              onClick={()=> logout()}
              >
                Logout
              </div>
            </Link>
      </div>
    </div>
  );
};

export default Navbar;
