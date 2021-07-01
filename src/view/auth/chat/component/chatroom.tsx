import React, { useState, useEffect } from "react";
import { getMessages } from "../../../../services/userService";
import Message from "../../../../interface/IMessage";
import User from "../../../../interface/IUser";



type ChatroomProps = {
  userSelected?:User;
  myUserName: string;
  selfIntro?:string;
};

const Chatroom = ({  myUserName,userSelected }: ChatroomProps) => {
  // const [keyPress,setKeyPress] = useState('');


  const [forwardingUser, setForwardingUser] = useState<User>(userSelected || {} as User);

  const [messages, setMes] = useState<Message[]>([]);
  const [dateChecker, setDateChecker] = useState<Date>();

  useEffect(() => {
    setForwardingUser(userSelected!);
    setMes([]);
    getMessages().subscribe((res) => {
      console.log("Success =>",res);
      setMes(res);
    });
  }, [userSelected]);

  const [inputValue, setInputValue] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value);
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

  const scrollToBottom = (lastChild: number) => {
    const elmnt = document.getElementById(`message_${lastChild}`);
    if (elmnt) elmnt.scrollIntoView();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.match(/^(?!\s*$).+/)) {
        console.log("1 ",new Date(),"2 " ,messages[messages.length-1]?.date)
        setMes([
          ...messages,
          {
            username: myUserName,
            message: inputValue,
            date: new Date().getTime(),
            timeHint:(new Date().getTime() - messages[messages.length-1]?.date)/(1000*60) > 5
          } as Message,
        ]);
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    if (messages?.length > 0) scrollToBottom(messages?.length - 1);
  }, [messages]);

  const dateController = (ele: Message) => {
    const mesDate = new Date(ele.date);
    // if(mesDate.getUTCDate()!==dateChecker?.getUTCDate()){
    //   setDateChecker(mesDate);
    //   return [mesDate].map(ele => `${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}`)
    // }
    // return "";
    return ele.timeHint?[mesDate].map(
      (ele) =>
        `${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
    ):"";
  };

  

  const starterTemplate = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
      Please select a user to start the chat.
    </div>
  );

  const messagesError = (
    <div className="flex-grow animate-pulse bg-white  flex flex-col items-center justify-center text-2xl">
      {[...Array(10)].map((ele, index) => (
              <div className="w-full">
                <div
                  className={`flex w-full `}
                  id={`message_${index}`}
                  key={`message_${index}`}
                >
                  <div
                    className={`flex my-2 w-full`}
                  >
                    <div
                      className="h-10 w-10 border rounded-full bg-gray-400"
                    />
                    <div
                      className={`mx-2  w-5/6`}
                    >
                      <div className="h-14 w-5/6 px-4 py-3 max-w-md flex flex-wrap break-all  items-center justify-around border rounded-3xl">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
                    }
    </div>
  );

  const chatroomTemplate = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-20 w-full flex flex-col items-center justify-center py-2 px-8 border-b">
        <div className="w-full flex text-lg font-semibold">{forwardingUser?forwardingUser.username :"Select a user"}</div>
        <div className="w-full text-sm">{forwardingUser?forwardingUser.intro: "text"}</div>
      </div>
      <div className="flex flex-col flex-grow px-4 overflow-y-scroll">
        {messages
          ? messages.map((ele, index) => (
              <div>
                <div className="text-center text-xs text-gray-600 my-4">
                  {dateController(ele)}
                </div>

                <div
                  className={`flex w-full ${
                    ele.username === myUserName ? "flex-row-reverse" : ""
                  }`}
                  id={`message_${index}`}
                  key={`message_${index}`}

                  // ref={(el) => {
                  //   messagesEnd = el!;
                  // }}
                >
                  <div
                    className={`flex my-2 max-w-lg ${
                      ele.username === myUserName ? "flex-row-reverse" : ""
                    }`}
                  >
                    <img
                      className="h-10 w-10 border rounded-full"
                      alt=""
                      src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
                    />
                    <div
                      className={`mx-2 ${
                        ele.username === myUserName ? " text-right" : ""
                      }`}
                    >
                      <div className="px-4 py-3 max-w-md flex flex-wrap break-all  items-center justify-around border rounded-3xl">
                        {ele.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : messagesError}
      </div>
      <div className="h-14 py-2 flex items-center px-4">
        <div className="w-full h-10 px-4 border rounded-full flex items-center ">
          {/* <div className="w-10">front</div> */}
          <div className="ml-2 flex-grow">
            <input
              className="w-full outline-none"
              value={inputValue}
              placeholder="Message..."
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => handleKeyPress(e)}
            ></input>
          </div>
          <div className="w-8 ml-2 ">
            <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
          </div>
        </div>
      </div>
    </div>
  );

  return forwardingUser ? chatroomTemplate : starterTemplate;
};

export default Chatroom;
