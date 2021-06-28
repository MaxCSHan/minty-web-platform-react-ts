import { timeStamp } from "console";
import { useState } from "react";

const message = {
  text: "Hi Enchente",
  time: "11:07",
  userId: "max",
};

const list = [
  {
    userName: "May",
    loginStatus: true,
    latest: "11:07",
    latestMessage: message,
    avatar: "link",
  },
  {
    userName: "Casper",
    loginStatus: false,
    latest: "11:08",
    latestMessage: message,
    avatar: "link",
  },
  {
    userName: "Shawn",
    loginStatus: true,
    latest: "11:09",
    latestMessage: message,
    avatar: "link",
  },
  {
    userName: "Shawn",
    loginStatus: true,
    latest: "11:09",
    latestMessage: message,
    avatar: "link",
  },
  {
    userName: "Shawn",
    loginStatus: true,
    latest: "11:09",
    latestMessage: message,
    avatar: "link",
  },
];

type ChatlistProps = {
  myUserName: string;
  onSelectedUser: (user: string) => void;
};

const Chatlist = ({ myUserName, onSelectedUser }: ChatlistProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value.toLocaleLowerCase());
    }
  };

  const searchResult = () => {
    const res = list.filter((ele) => ele.userName.toLocaleLowerCase().includes(inputValue));
    return res;
  };

  return (
    <div className="w-screen sm:w-96 flex h-16 sm:h-auto">
      <div className="w-full bg-white border hidden sm:flex flex-col items-center">
        <div className="flex flex-col w-full">
          <div className="h-14 flex items-center justify-center font-semibold text-lg">
            {myUserName}
          </div>
          <div className="px-4">
            <input
              className="w-full appearance-none outline-none"
              placeholder="Search"
              onChange={(e) => handleInput(e)}
            ></input>
          </div>
        </div>
        <div className="w-full border-t">
          {searchResult().map((ele, index) => (
            <div
              className="w-full px-4 h-20 flex items-center hover:bg-gray-50"
              key={`chatroom_${index}`}
              onClick={() => onSelectedUser(ele.userName)}
            >
              <div className="relative h-16 w-16 rounded-full bg-green-100">
                {ele.loginStatus && (
                  <div className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-green-600"></div>
                )}
              </div>
              <div className="ml-2 flex flex-col">
                <div>{ele.userName}</div>
                <div>
                  {ele.latestMessage.text} {ele.latestMessage.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:hidden">Hi</div>
    </div>
  );
};

export default Chatlist;
