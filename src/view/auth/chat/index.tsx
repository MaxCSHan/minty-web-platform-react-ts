import Chatroom from "./component/chatroom";
import Chatlist from "./component/chatlist";

const Chat = () => {
  return (
    <div className="flex  flex-grow w-screen 	justify-center  sm:items-center sm:bg-gray-100  transition duration-100 ease-in-out pt-2">
      <div className=" max-h-180 sm:h-11/12 sm:max-h-240 flex-col sm:flex sm:flex-row md:flex-row">
        <Chatlist></Chatlist>
        <Chatroom></Chatroom>
      </div>
    </div>
  );
};

export default Chat;
