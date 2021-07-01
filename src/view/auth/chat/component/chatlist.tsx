import { timeStamp } from "console";
import { useState, useEffect } from "react";
import { getUsers } from "../../../../services/userService";
import User from "../../../../interface/IUser";
const message = {
  text: "Hi Enchente",
  time: "11:07",
  userId: "max",
};

const list = [
  {
    username: "May",
    loginStatus: true,
    latest: "11:07",
    latestMessage: "message",
    avatar: "link",
  },
  {
    username: "Casper",
    loginStatus: false,
    latest: "11:08",
    latestMessage: "message",
    avatar: "link",
  },
  {
    username: "Shawn",
    loginStatus: true,
    latest: "11:09",
    latestMessage: "message",
    avatar: "link",
  },
];

type ChatlistProps = {
  myUsername: string;
  onSelectedUser: (user: User) => void;
};


const Chatlist = ({ myUsername, onSelectedUser }: ChatlistProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>();

  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    getUsers().subscribe((response) => setUserList(response));
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value.toLocaleLowerCase());
    }
  };

  const searchResult = () => {
    const res = userList.filter((ele) =>
      ele.username.toLocaleLowerCase().includes(inputValue)
    );
    return res;
  };

  const onSelect = (user:User) =>
  {
    onSelectedUser(user);
    setSelectedUser(user);
  }

  const loadingListComponent = [0,1,2,3,4,5,6,7,8,9].map((ele,index) =>(
    <div
      className="w-full animate-pulse px-4 h-20 flex items-center"
      key={`chatroomLoad_${index}`}
    >
      <div className=" h-16 w-16 rounded-full bg-gray-200">
      </div>
      <div className="ml-2 h-14 w-5/6 flex flex-col justify-around">
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>

      </div>
    </div>
  ));

  const searchResultComponent = (
    searchResult().map((ele, index) => (
      <div
        className={`w-full px-4 h-20 flex items-center ${ele.username===selectedUser?.username?"bg-gray-100 hover:bg-gray-100 ":"bg-white hover:bg-gray-50 "}`}
        key={`chatroom_${index}`}
        onClick={() => onSelect(ele)}
      >
        <div className="relative h-16 w-16 rounded-full bg-green-100">
          <img className="rounded-full" src={ele.avatar} />
          {ele.loginStatus && (
            <div className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-green-500"></div>
          )}
        </div>
        <div className="ml-2 flex flex-col">
          <div>{ele.username}</div>
          <div>
            {ele.latestMessage.slice(0, 20)} {"11:09PM"}
          </div>
        </div>
      </div>
    ))
  )

  return (
    <div className="w-screen sm:w-96 flex h-16 sm:h-auto">
      <div className="w-full bg-white border hidden sm:flex flex-col items-center">
        <div className="flex flex-col w-full">
          <div className="h-10 flex items-center justify-center font-semibold text-lg">
            {myUsername}
          </div>
          <div className="h-6 px-4">
            <input
              className="w-full appearance-none outline-none"
              placeholder="Search"
              onChange={(e) => handleInput(e)}
            ></input>
          </div>
        </div>
        <div className="w-full border-t overflow-y-scroll">
          {/* {loadingListComponent} */}
          {userList.length>0?searchResultComponent:loadingListComponent}
        </div>
      </div>
      <div className="sm:hidden">Hi</div>
    </div>
  );
};

export default Chatlist;
