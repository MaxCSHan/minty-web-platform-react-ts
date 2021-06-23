import { Link } from "react-router-dom";
import {useState} from "react"

const Skills = ["Photography", "Modeling", "Make-up Artist"];

const Navbar = () => {
    const [selectFilter,setSelectFilter] = useState('');

  return (
    <div>
      <div className="flex flex-col dark:bg-gray-800 dark:text-white ">
        <div className="h-14 flex items-center border-b justify-between">
          <div className="h-full mx-6 flex items-center">
            <Link to="/">MintySpace</Link>
          </div>

          <div className="h-full w-48 md:w-64  flex items-center justify-around">
            <Link to="/auth">
              <div>
                <i className="text-2xl far fa-comment"></i>
              </div>
            </Link>
            <Link to="/User">
              <div>
                <i className="text-2xl fas fa-user-circle"></i>
              </div>
            </Link>

            <Link to="/auth">
              <div className="h-8 flex items-center bg-primary text-white font-semibold cursor-pointer rounded-full px-4">
                Login
              </div>
            </Link>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default Navbar;
