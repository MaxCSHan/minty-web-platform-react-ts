import React, { useState, useEffect } from "react";
import User from "../../user";

const mes = [
  { user: "Charlie", message: "我們在西門威秀的時候" },
  { user: "Charlie", message: "我在甜的爆米花裡面" },
  { user: "Charlie", message: "吃到巧克力的" },
  { user: "Charlie", message: "對" },
  { user: "Charlie", message: "現在西門威秀都關了" },
  {
    user: "Charlie",
    message:
      "我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了",
  },
  {
    user: "Charlie",
    message:
      "我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了",
  },
  {
    user: "Account Name",
    message:
      "我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了",
  },
];

type ChatroomProps = {
  userName: string,
  myUserName: string
}

type Message = {
  user:string,
  message:string
}

type messageList= Message[];

const Chatroom = ({userName,myUserName}:ChatroomProps) => {
  // const [keyPress,setKeyPress] = useState('');
  
  const [user, setUser] = useState(userName);
  const [messages,setMes] = useState<messageList>([]);
  
  useEffect(()=>{
    setUser(userName);
  },[userName]);

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
    elmnt!.scrollIntoView();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.match(/^(?!\s*$).+/)) {
        messages.push({ user: myUserName, message: inputValue });
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    if(messages.length>0)    scrollToBottom(messages.length - 1);
  }, [messages.length]);

const starterTemplate = (
  <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
    Please select a user to start the chat.
</div>
);

  const chatroomTemplate = (
<div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-14 flex items-center px-8">
        <div className="h-14 flex items-center ">{user}</div>
      </div>
      <div className="flex flex-col flex-grow px-4 overflow-scroll">
        {messages?messages.map((ele, index) => (
          <div
            className={`flex w-full ${
              ele.user === myUserName ? "flex-row-reverse" : ""
            }`}
            id={`message_${index}`}
            key={`message_${index}`}

            // ref={(el) => {
            //   messagesEnd = el!;
            // }}
          >
            <div
              className={`flex my-2 max-w-lg ${
                ele.user === myUserName ? "flex-row-reverse" : ""
              }`}
            >
              <img
                className="h-10 w-10 border rounded-full"
                alt=""
                src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
              />
              <div className=" mx-2 px-4 py-3 flex  items-center justify-around border rounded-3xl">
                {ele.message}
              </div>
            </div>
          </div>
        )):"hi"}
      </div>
      <div className="h-14 py-2 flex items-center px-4">
        <div className="w-full h-10 px-4 border rounded-full flex items-center ">
          <div className="w-10">front</div>
          <div className="ml-2 flex-grow">
            <input
              className="w-full outline-none"
              value={inputValue}
              placeholder="Message..."
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => handleKeyPress(e)}
            ></input>
          </div>
          <div className="w-20 ml-2 ">
            <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    user?chatroomTemplate:starterTemplate
  );
};

export default Chatroom;
