import { Link } from "react-router-dom";


const Navbar = () => {

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
