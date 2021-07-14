import Chatroom from "./component/chatroom";
import Chatlist from "./component/chatlist";
import NewRoom from "./component/NewRoom"
import { useState,useEffect } from "react";
import {loginUser} from "../../../services/authService"
import { Switch, Route,Redirect, useLocation} from "react-router-dom";
import Starter from "./component/Starter";



const Chat = () => {
  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  };
  const location = usePathname().includes("/chat/room")
  const [myUsername,setMyUserName] = useState("");

  useEffect(()=>{
    setMyUserName(loginUser()?.username);

  },[])


  return (
    <div className={` flex h-screen  ${location?"sm:pt-14":"pt-14"}  w-screen 	justify-center  sm:items-center sm:bg-gray-100  transition duration-100 ease-in-out`}>
      <div className="sm:h-95/100 sm:max-h-240 md:max-h-280  2xl:max-h-320 flex flex-col sm:flex sm:flex-row md:flex-row">
        <Chatlist   myUsername={myUsername}></Chatlist>
        <Switch>
          <Route exact path="/chat/inbox" component={Starter} />
          <Route exact path="/chat/inbox/new" component={NewRoom} />
          <Redirect exact from="/chat/room/" to="/chat/inbox" />
          <Redirect exact from="/chat/" to="/chat/inbox" />
          <Route exact path="/chat/room/:id" component={Chatroom} />
        </Switch>
        {/* <Chatroom roomSelected={selectedRoom} userSelected={selectedUser}  myUserName={myUsername}></Chatroom> */}
      </div>
    </div>
  );
};

export default Chat;
