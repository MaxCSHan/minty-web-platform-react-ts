import Chatroom from "./component/chatroom";
import Chatlist from "./component/chatlist";
import IChatroom from "../../../interface/IChatroom";
import { useState,useEffect } from "react";
import User from "../../../interface/IUser";

const Chat = () => {
  const myUsername = "Max Chen"
  const [selectedUser, setSelectedUser] =useState<User>()
  const [selectedRoom, setSelectedRoom] =useState<IChatroom>()


  const onSelectedUser = (user:User) => { setSelectedUser(user);}
  const onSelectedRoom = (room:IChatroom) => { setSelectedRoom(room);}
  useEffect(()=>{
    console.log("on selectedRoom")
  },[selectedRoom])
  

  return (
    <div className="flex h-screen  pt-14  w-screen 	justify-center  sm:items-center sm:bg-gray-100  transition duration-100 ease-in-out">
      <div className=" max-h-180 sm:h-95/100 sm:max-h-240 md:max-h-280  2xl:max-h-320 flex-col sm:flex sm:flex-row md:flex-row">
        <Chatlist onSelectedRoom={onSelectedRoom} onSelectedUser={onSelectedUser} myUsername={myUsername}></Chatlist>
        <Chatroom roomSelected={selectedRoom} userSelected={selectedUser}  myUserName={myUsername}></Chatroom>
      </div>
    </div>
  );
};

export default Chat;
