import React from "react";

const User = () => {
  return (
    <div className="h-screen flex flex-col items-center transition duration-100 ease-in-out pt-14">
      <div className="relative w-screen h-48 bg-gray-100 flex flex-col sm:flex-row items-center justify-center bg-moctar-bg bg-cover">
        <div className="h-32 w-32 border flex items-center justify-center rounded-full">
          profile
        </div>
      </div>
      <div className="text-3xl font-semibold mt-5">Max Chen</div>
      <div className="w-full flex items-center px-4 justify-around">
        <div>Works | 320</div>
        <div>Likes | 320</div>
        <div>Followers | 320</div>
      </div>
    </div>
  );
};

export default User;
