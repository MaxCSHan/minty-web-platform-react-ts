import React from "react";
import { Link } from "react-router-dom";
import {loginUser, logout} from "../../../services/authService"

const User = () => {
  return (
    <div className="h-screen flex flex-col items-center transition duration-100 ease-in-out pt-14">
      <div className="relative w-screen h-48 bg-gray-100 flex flex-col sm:flex-row items-center justify-center bg-moctar-bg bg-cover">
        <img className="h-32 w-32 border flex items-center justify-center rounded-full bg-gray-200" alt="" src={loginUser()?.avatar} />
      </div>
      <div className="text-3xl font-semibold mt-5 flex items-center">{loginUser()?.fullName || "Please log in first"}       <span className="ml-2 text-sm "><i className="fas fa-user-edit"></i></span>
</div>
      <div className="w-full flex items-center px-4 justify-around">
        <div>Works | 320</div>
        <div>Likes | 320</div>
        <div>Followers | 320</div>
      </div>

      <div> <Link to="/auth">
              <div className="h-8 flex items-center bg-primary text-white font-semibold cursor-pointer rounded-full px-4"
              onClick={()=> logout()}
              >
                Logout
              </div>
            </Link></div>
    </div>
  );
};

export default User;
