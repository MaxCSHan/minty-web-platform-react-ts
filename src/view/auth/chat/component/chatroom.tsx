import React, { useState, useEffect } from "react";
import { getMessages } from "../../../../services/userService";
import Message from "../../../../interface/IMessage";

// const mes = [
//   { username: "Charlie", message: "我們在西門威秀的時候" },
//   { username: "Charlie", message: "我在甜的爆米花裡面" },
//   { username: "Charlie", message: "吃到巧克力的" },
//   { username: "Charlie", message: "對" },
//   { username: "Charlie", message: "現在西門威秀都關了" },
//   {
//     username: "Charlie",
//     message:
//       "我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了",
//   },
//   {
//     username: "Charlie",
//     message:
//       "我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了",
//   },
//   {
//     username: "Account Name",
//     message:
//       "我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了我們在西門威秀的時候我在甜的爆米花裡面吃到巧克力的對現在西門威秀都關了",
//   },
// ];

type ChatroomProps = {
  userName: string,
  myUserName: string
}



const Chatroom = ({userName,myUserName}:ChatroomProps) => {
  // const [keyPress,setKeyPress] = useState('');
  
  const [username, setUsername] = useState(userName);
  const [messages,setMes] = useState<Message[]>([]);
  
  useEffect(()=>{
    setUsername(userName);
    getMessages().subscribe(res => {console.log(res);setMes(res);})

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
    if(elmnt) elmnt.scrollIntoView();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.match(/^(?!\s*$).+/)) {
        setMes([...messages,{ username: myUserName, message: inputValue,date:new Date().getTime() } as Message]);
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    if(messages.length>0)    scrollToBottom(messages.length - 1);
  }, [messages]);

const starterTemplate = (
  <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
    Please select a user to start the chat.
</div>
);

  const chatroomTemplate = (
<div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-20 w-full flex flex-col items-center justify-center py-2 px-8 border-b">
        <div className="w-full flex text-lg font-semibold">{username}</div>
        <div className="w-full text-sm">Self Intro</div>
      </div>
      <div className="flex flex-col flex-grow px-4 overflow-y-scroll">
        {messages?messages.map((ele, index) => (
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
              <div className={`mx-2 ${
                ele.username === myUserName ? " text-right" : ""
              }`}>
                <div className="text-xs text-gray-600">{new Date(ele.date).toLocaleDateString()}</div>
                <div className="px-4 py-3 max-w-md flex flex-wrap break-all  items-center justify-around border rounded-3xl">
                {ele.message} 
              </div>
              </div>
              
            </div>
          </div>
        )):"hi"}
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

  return (
    username?chatroomTemplate:starterTemplate
  );
};

export default Chatroom;
