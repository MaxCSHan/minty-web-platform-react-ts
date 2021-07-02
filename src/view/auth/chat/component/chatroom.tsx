import React, { useState, useEffect, useRef } from "react";
import { getMessages } from "../../../../services/userService";
import Message from "../../../../interface/IMessage";
import User from "../../../../interface/IUser";
import Chatblock from "./chatBlock";
import IReplyMessage from "../../../../interface/IReplyMessage";
import { randomInt } from "crypto";
type ChatroomProps = {
  userSelected?: User;
  myUserName: string;
  selfIntro?: string;
};

const Chatroom = ({ myUserName, userSelected }: ChatroomProps) => {
  // const [keyPress,setKeyPress] = useState('');

  const [forwardingUser, setForwardingUser] = useState<User>(
    userSelected || ({} as User)
  );

  const [messages, setMes] = useState<Message[]>([]);

  useEffect(() => {
    setForwardingUser(userSelected!);
    setMes([]);
    getMessages().subscribe((res) => {
      console.log("Success =>", res);
      setMes(res);
      scrollToBottom();
    });
  }, [userSelected]);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value);
    }
  };

  const [replyMessage, setReplyMessage] = useState({
    id: -1,
    from: "",
    to: "",
    message: "",
  });
  const onReply = (id: number, to: string, message: string) => {
    setReplyMessage({ id, from: myUserName, to, message });
    inputRef!.current?.focus();
  };

  const resetReply = () => onReply(-1, "", "");
  const jumpTo = (id: number) => {
    const elmnt = document.getElementById(`message_${id}`);
    console.log("Check =>", elmnt);
    if (elmnt) {
      elmnt.scrollIntoView();
      const originStyle = elmnt?.getAttribute || "";
      elmnt.setAttribute("class", `animate-wiggle ${originStyle}`);
      setInterval(() => elmnt.setAttribute("class", `${originStyle}`), 200);
    }
  };

  // let messagesEnd: HTMLDivElement;
  //   const scrollToBottom = () => {
  //     // console.log(messagesEnd)
  //     // messagesEnd.scrollIntoView({ behavior: "smooth" , block: "start", inline: "nearest"});
  //     console.log(mes.length - 2);
  //     const elmnt = document.getElementById(`message_${mes.length - 2}`);
  //     console.log(elmnt)
  //     elmnt!.scrollIntoView();
  //   };

  const scrollTo = (index: number) => {
    const elmnt = document.getElementById(`message_${index}`);
    if (elmnt) elmnt.scrollIntoView();
  };

  const scrollToBottom = () => {
    scrollTo(messages[messages.length - 1]?.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.match(/^(?!\s*$).+/)) {
        setMes([
          ...messages,
          {
            username: myUserName,
            message: inputValue,
            date: new Date().getTime(),
            timeHint:
              (new Date().getTime() - messages[messages.length - 1]?.date) /
                (1000 * 60) >
              5,
            reply: replyMessage.id > 0 ? replyMessage : null,
            id: Math.random(),
          } as Message,
        ]);
        setInputValue("");
        resetReply();
      }
    }
  };
  const handleHeartClick = () => {
      if (inputValue.match(/^(?!\s*$).+/)) {
        setMes([
          ...messages,
          {
            username: myUserName,
            message: inputValue,
            date: new Date().getTime(),
            timeHint:
              (new Date().getTime() - messages[messages.length - 1]?.date) /
                (1000 * 60) >
              5,
            reply: replyMessage.id > 0 ? replyMessage : null,
            id: Math.random(),
            heart:true
          } as Message,
        ]);
      }

  };

  useEffect(() => {
    if (messages?.length > 0) scrollToBottom();
  }, [messages]);

  const starterTemplate = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
      Please select a user to start the chat.
    </div>
  );

  const messagesLoading = (
    <div className="animate-puls">
      {userSelected?.latestMessage &&
        [...Array(15)].map((ele, index) => (
          <div className="w-full">
            <div
              className={`flex w-full `}
              id={`message_${index}`}
              key={`message_${index}`}
            >
              <div className={`flex my-2 w-full`}>
                <div className="h-10 w-10  rounded-full bg-gray-200"></div>
                <div className={`mx-2  w-5/6`}>
                  <div className="h-14 w-5/6 px-4 py-3 max-w-md bg-gray-200 flex flex-wrap break-all  items-center justify-around border rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  // const messagesList = (
  //   <div>
  //     {messages.map((ele, index) => (
  //       <div className="group">
  //         <div className="text-center text-xs text-gray-600 my-4">
  //           {dateController(ele)}
  //         </div>

  //         <div
  //           className={`flex w-full ${
  //             ele.username === myUserName ? "flex-row-reverse" : ""
  //           }`}
  //           id={`message_${index}`}
  //           key={`message_${index}`}

  //           // ref={(el) => {
  //           //   messagesEnd = el!;
  //           // }}
  //         >
  //           <div
  //             className={`flex my-2 max-w-lg ${
  //               ele.username === myUserName ? "flex-row-reverse" : ""
  //             }`}
  //           >
  //             <img
  //               className="h-10 w-10 border rounded-full"
  //               alt=""
  //               src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
  //             />
  //             <div
  //               className={`mx-2 flex last:hidden ${
  //                 ele.username === myUserName ? " text-right" : ""
  //               }`}
  //             >
  //               <div className="px-4 py-3 max-w-sm flex flex-wrap break-all  items-center justify-around border rounded-3xl">
  //                 {ele.message}
  //               </div>
  //               <div className=" group-hover:flex">
  //                 <i className="fas fa-reply"></i>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );

  const messagesList = messages.map((ele, index) => (
    <Chatblock
      onReply={onReply}
      jumpTo={jumpTo}
      avatar={forwardingUser?.avatar}
      isForward={ele.username === myUserName}
      index={index}
      message={ele}
    ></Chatblock>
  ));

  const chatroomTemplate = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-18 w-full flex flex-col items-center justify-center py-2 px-8 border-b">
        <div className="w-full flex text-lg font-semibold">
          {forwardingUser ? forwardingUser.username : "Select a user"}
        </div>
        <div className="w-full text-sm">
          {forwardingUser ? forwardingUser.intro : "text"}
        </div>
      </div>
      <div className="flex flex-col flex-grow px-4 overflow-y-scroll">
        {messages && messages.length > 0 ? messagesList : messagesLoading}
      </div>
      <div
        className={`${
          replyMessage.id > 0 ? "h-34" : "h-14"
        } py-2 flex flex-col items-center px-4`}
      >
        {replyMessage.id > 0 && (
          <div className="w-full h-16 px-4  flex flex-col ">
            <div className="flex items-center justify-between">
              <div>
                Replying to:
                <span className="font-semibold"> {replyMessage.to} </span>
              </div>
              <div
                className="text-gray-400 hover:text-gray-600"
                onClick={() => resetReply()}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>
            <div className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
              {replyMessage.message}
            </div>
          </div>
        )}
        <div className="w-full h-10 px-4 border rounded-full flex items-center ">
          {/* <div className="w-10">front</div> */}
          <div className="ml-2 flex-grow">
            <input
              className="w-full outline-none"
              value={inputValue}
              placeholder="Message..."
              ref={inputRef}
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => handleKeyPress(e)}
            ></input>
          </div>
          <div className="w-8 ml-2 "
          onClick={() => handleHeartClick()}
          >
            <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
          </div>
        </div>
      </div>
    </div>
  );

  return forwardingUser ? chatroomTemplate : starterTemplate;
};

export default Chatroom;
