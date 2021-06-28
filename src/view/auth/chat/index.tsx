import Chatroom from "./component/chatroom";
import Chatlist from "./component/chatlist";
import { useState } from "react";

const Chat = () => {
  const myUserName = "Max Chen"
  const [selectedUser, setSelectedUser] =useState('')

  const onSelectedUser = (user:string) => { setSelectedUser(user);}
  
  return (
    <div className="flex  flex-grow w-screen 	justify-center  sm:items-center sm:bg-gray-100  transition duration-100 ease-in-out pt-2">
      <div className=" max-h-180 sm:h-11/12 sm:max-h-240 flex-col sm:flex sm:flex-row md:flex-row">
        <Chatlist onSelectedUser={onSelectedUser} myUserName={myUserName}></Chatlist>
        <Chatroom userName={selectedUser} myUserName={myUserName}></Chatroom>
      </div>
    </div>
  );
};

export default Chat;
