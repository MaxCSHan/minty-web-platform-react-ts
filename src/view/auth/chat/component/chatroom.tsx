import React, { useState, useEffect } from "react";

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

const Chatroom = () => {
  // const [keyPress,setKeyPress] = useState('');
  const [user, setUser] = useState("Account Name");

  const [inputValue, setInputValue] = useState("");

  let messagesEnd: HTMLDivElement;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value);
    }
  };

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
        mes.push({ user: user, message: inputValue });
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    scrollToBottom(mes.length - 1);
  }, [mes.length]);

  return (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-14 flex items-center px-8">
        <div className="h-14 flex items-center ">{user}</div>
      </div>
      <div className="flex flex-col flex-grow px-4 overflow-scroll">
        {[...mes].map((ele, index) => (
          <div
            className={`flex w-full ${
              ele.user === user ? "flex-row-reverse" : ""
            }`}
            id={`message_${index}`}
            ref={(el) => {
              messagesEnd = el!;
            }}
          >
            <div
              className={`flex my-2 max-w-lg ${
                ele.user === user ? "flex-row-reverse" : ""
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
        ))}
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
};

export default Chatroom;
