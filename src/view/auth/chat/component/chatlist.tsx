import { timeStamp } from "console";
import { useState, useEffect } from "react";
import { getUsers,getChatrooms } from "../../../../services/userService";
import IChatroom from "../../../../interface/IChatroom";
import User from "../../../../interface/IUser";
import {chatRef} from "../../../../setup/setupFirebase"

const message = {
  text: "Hi Enchente",
  time: "11:07",
  userId: "max",
};


type ChatlistProps = {
  myUsername: string;
  onSelectedUser: (user: User) => void;
  onSelectedRoom:(room:IChatroom) =>  void;
};


const Chatlist = ({ myUsername, onSelectedUser,onSelectedRoom }: ChatlistProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedRoom, setSelectedRoom] = useState<IChatroom>();

  const [userList, setUserList] = useState<User[]>([]);
  const [roomList, setRoomList] = useState<IChatroom[]>([]);

  useEffect(() => {
    // getUsers().subscribe((response) => setUserList(response));
    // getChatrooms().subscribe((response) => setRoomList(response));
    chatRef.child("chatrooms").limitToLast(3).on('value', (snapshot) => {
      const data = snapshot.val();
      // console.log(data)
      const objectReducer = (acc:any,curr: any[]) => {
        acc = [...acc,{...curr[1],id:curr[0]}] as IChatroom[]
      }
      const arr = Object.keys(data).map((key) => [key, data[key]]).map(ele => ({...ele[1],id:ele[0]})) as IChatroom[];
      setRoomList(arr)
    });
    // console.log("API CHatroom =>",roomList)
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") setInputValue("");
    else {
      setInputValue(value.toLocaleLowerCase());
    }
  };

  const searchResult = () => {
    // const res = userList.filter((ele) =>
    //   ele.username.toLocaleLowerCase().includes(inputValue)
    // ); 
    const res = roomList.filter((ele) =>
    ele.title.toLocaleLowerCase().includes(inputValue)
  );
    return res;
  };

  // const onSelect = (user:User) =>
  // {
  //   onSelectedUser(user);
  //   setSelectedUser(user);
  // }
  const onSelect = (room: IChatroom) =>
  {
    onSelectedRoom(room);
    setSelectedRoom(room);
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
        className={`w-full px-4 h-20 flex items-center ${ele.id===selectedRoom?.id?"bg-gray-100 hover:bg-gray-100 ":"bg-white hover:bg-gray-50 "}`}
        key={`chatroom_${index}`}
        onClick={() => onSelect(ele)}
      >
        <div className="relative h-16 w-16 rounded-full bg-green-100">
          <img className="h-16 w-16 rounded-full object-cover" src={ele.roomPhoto} />
          {ele?.loginStatus && (
            <div className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-green-500"></div>
          )}
        </div>
        <div className="ml-2 flex flex-col">
          <div>{ele.title}</div>
          <div className={`${!ele.read?"font-semibold":""}`}>
            {ele?.latestMessage!.slice(0, 20)} {"11:09PM"}
          </div>
        </div>
      </div>
    ))
  )

  const searchArea = () => searchResultComponent.length >0?searchResultComponent: <div className="flex h-full items-center justify-center flex-grow">No result matched</div> 
  

  return (
    <div className="w-screen sm:w-96 flex h-16 sm:h-auto">
      <div className="w-full bg-white border hidden sm:flex flex-col items-center">
        <div className="flex flex-col w-full">
          <div className="relative h-16 flex items-center justify-center font-semibold text-lg border-b">
            {myUsername} <div className="absolute right-10 h-10 w-10 flex items-center justify-center cursor-pointer rounded-full  hover:bg-gray-50"><i className="fas fa-paper-plane"></i></div>
          </div>
          <div className="h-12 flex items-center px-4">
            <input
              className="w-full appearance-none outline-none"
              placeholder="Search"
              onChange={(e) => handleInput(e)}
            ></input>
          </div>
        </div>
        <div className="w-full flex-grow border-t overflow-y-scroll">
          {/* {loadingListComponent} */}
          {roomList.length>0?searchArea():loadingListComponent}
        </div>
      </div>
      <div className="sm:hidden">Hi</div>
    </div>
  );
};

export default Chatlist;
