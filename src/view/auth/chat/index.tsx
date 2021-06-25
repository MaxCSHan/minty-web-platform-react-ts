import React, { useState, useEffect } from "react";
import Chatroom from "./component/chatroom";


const Chat = () => {


  return (
    <div className="flex flex-grow w-screen justify-center items-center sm:bg-gray-100  transition duration-100 ease-in-out pt-2">
      <div className="h-200 flex">
        <div className=" w-96 bg-white border flex items-center">left</div>
        <Chatroom></Chatroom>
      </div>
    </div>
  );
};

export default Chat;
