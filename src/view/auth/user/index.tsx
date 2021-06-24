import React from "react";
import {withRouter} from 'react-router';

const User = () => {
  return (
    <div className="h-screen flex flex-col items-center transition duration-100 ease-in-out pt-2">
      <div className="h-32 w-32 border flex items-center justify-center rounded-full">profile</div>
      <div className="text-3xl font-semibold mt-5">Max Chen</div>
      <div className="w-full flex items-center px-4 justify-around">
          <div>Works | 320</div>
          <div>Likes | 320</div>
          <div>Followers | 320</div>

      </div>
    </div>
  );
};

export default withRouter(User);
