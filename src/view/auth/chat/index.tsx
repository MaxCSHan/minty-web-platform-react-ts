import Chatroom from "./component/chatroom";
import Chatlist from "./component/chatlist";
import { useState } from "react";

const Chat = () => {
  const myUsername = "Max Chen"
  const [selectedUser, setSelectedUser] =useState('')

  const onSelectedUser = (user:string) => { setSelectedUser(user);}
  
  return (
    <div className="flex h-screen  pt-14  w-screen 	justify-center  sm:items-center sm:bg-gray-100  transition duration-100 ease-in-out">
      <div className=" max-h-180 sm:h-95/100 sm:max-h-240 md:max-h-280  2xl:max-h-320 flex-col sm:flex sm:flex-row md:flex-row">
        <Chatlist onSelectedUser={onSelectedUser} myUsername={myUsername}></Chatlist>
        <Chatroom userName={selectedUser} myUserName={myUsername}></Chatroom>
      </div>
    </div>
  );
};

export default Chat;
