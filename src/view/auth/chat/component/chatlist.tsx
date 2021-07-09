import { useState, useEffect } from 'react'
// import { getUsers,getChatrooms } from "../../../../services/userService";
import IChatroom from '../../../../interface/IChatroom'
import { chatRef, usersRef } from '../../../../setup/setupFirebase'
import { Link, useLocation } from 'react-router-dom'
import { loginUser } from '../../../../services/authService'
import IMember from '../../../../interface/IMember'
import IMessage from '../../../../interface/IMessage'
import StringMap from '../../../../interface/StringMap'
import User from '../../../../interface/IUser'
import ListBlock from "./ListBlock"
type ChatlistProps = {
  myUsername: string
}

const Chatlist = ({ myUsername }: ChatlistProps) => {
  /**
   * RWD Check: If entered a room then hide.
   */
  const location = useLocation()
  const locationChecker = () => location.pathname === '/chat/inbox'
  const loginUid = loginUser().uid;
  //
  const [inputValue, setInputValue] = useState('')
  const [searching, setSearching] = useState(false)

  const [selectedRoom, setSelectedRoom] = useState<IChatroom>()
  const [searchUserResult, setSearchUserResult] = useState<User[]>()

  const [roomList, setRoomList] = useState<string[]>([])

  // const [roomList, setRoomList] = useState<IChatroom[]>([])

  useEffect(() => {
    // getUsers().subscribe((response) => setUserList(response));
    // getChatrooms().subscribe((response) => setRoomList(response));
    usersRef
      .child(`/${loginUid}/roomList`)
      .on('value', (snapshot) => {
        const data = snapshot.val()
        console.log("user",data)
        if(data){
           const arr = Object.keys(data);
        setRoomList(arr)
        }
       
      })
    searchUser()
    // console.log("API CHatroom =>",roomList)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputValue('')
    else {
      setInputValue(value.toLocaleLowerCase())
    }
  }

  const searchUser = () => {
    usersRef.limitToLast(10).once('value', (snapshot) => {
      const data = snapshot.val()
      const arr: User[] = Object.values(data)
      console.log(arr)
      setSearchUserResult(arr)
    })
  }

  const searchResult = () => {
    // const res = userList.filter((ele) =>
    //   ele.username.toLocaleLowerCase().includes(inputValue)
    // );
    const res = searchUserResult?.filter((ele) => ele.username.toLocaleLowerCase().includes(inputValue)) || []
    return res
  }

  // const onSelect = (user:User) =>
  // {
  //   onSelectedUser(user);
  //   setSelectedUser(user);
  // }
  const onSelect = (room: IChatroom) => {
    setSelectedRoom(room)
  }
  const dateController = (dateNumber: number) => {
    const mesDate = new Date(dateNumber)
    const curr = new Date()
    return curr.getDate() === mesDate.getDate()
      ? mesDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : mesDate.toLocaleDateString()
  }

  const goToRoom = async (uid: string) => {
    await usersRef
      .child(`${loginUser().uid}/roomList`)
      .once('value')
      .then(function (snapshot) {
        const group = false;
        const privateCoId = [loginUser().uid,uid].sort().join('');

        const setupNew = group? !snapshot.hasChild(`/${uid}`):!snapshot.hasChild(`/${privateCoId}`)
        if (setupNew) {
          console.log('setupNew ')

          const newRoom = group? chatRef.child(`/chatrooms`).push():chatRef.child(`/chatrooms/${privateCoId}`);
          const newMessgaesList = chatRef.child(`/Messages/${newRoom.key}`).push()
          const memberUids = [loginUser().uid,uid]
          //
          const defaultRead = {} as StringMap<string>;
          const defaultTyping = {} as StringMap<boolean>;
          const defaultMembers = {} as StringMap<IMember>
          //
          memberUids.forEach( muid => {
            defaultRead[muid] = "";
            defaultTyping[muid] = false;
          })



          newRoom.set({
            id: newRoom.key,
            title: `${loginUser().username}`,
            roomPhoto: `${loginUser().avatar}`,
            members: defaultMembers,
            latestMessage: '',
            latestMessageId: '',
            latestActiveDate: new Date().getTime(),
            messages: newMessgaesList.key,
            read: defaultRead,
            isTyping: defaultTyping,
            loginStatus: true,
            group: false,
            createdDate: new Date().getTime(),
            intro: ''
          } as IChatroom)

          memberUids.forEach(ele => {
            usersRef.child(`${ele}/roomList/${group?newRoom.key:privateCoId}`).set(true)
          })
        }
      })
    console.log('click')
    // setInputValue("")
  }

  //Components

  const groupProfile = (members: StringMap<IMember>) => {
    const imgArr = Object.values(members)
      .slice(0, 2)
      .map((ele) => ele.avatar)

    return (
      <div className="h-16 w-16 flex flex-col justify-center">
        <img className="object-cover h-10 w-10 ml-6 rounded-full" alt="" src={imgArr[0]} />
        <img className="object-cover h-11 w-11 -mt-4 border-2 border-white rounded-full" alt="" src={imgArr[1]} />
      </div>
    )
  }

  const loadingListComponent = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ele, index) => (
    <div className="w-full animate-pulse px-4 h-20 flex items-center" key={`chatroomLoad_${index}`}>
      <div className=" h-16 w-16 rounded-full bg-gray-200"></div>
      <div className="ml-2 h-14 w-5/6 flex flex-col justify-around">
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  ))

  const searchResultComponent = searchResult().map((ele, index) => (
   
    <Link key={`search_result_${index}`} to={`/chat/room/${[loginUser().uid,ele.uid].sort().join('')}`}>
    <div className="flex items-center  px-3 py-1 cursor-pointer" >
      <img className="h-10 w-10 rounded-full object-cover" alt="" src={ele.avatar} />
      <div className="ml-4">{ele.username}</div>
    </div>
    </Link >
  ))

  const roomListComponent = ["-Mdtq1YgZ08zGZtk6Ejy",...roomList].map((ele, index) => (
    <ListBlock roomId={ele} selectedRoomId={selectedRoom?.id!}></ListBlock>
  ))

  const searchArea = (
    <div
      className={`transition-all duration-200 delay-500 ease-in flex ${
        searching || inputValue.length > 0 ? 'opacity-100 visible ' : 'opacity-0 invisible '
      }`}
    >
      {searchResultComponent.length > 0 ? (
        <div className="flex flex-col flex-grow justify-center">
          {inputValue.length === 0 && <div className="h-14 flex items-center  pl-8 font-semibold">Suggested</div>}
          <div className={`${inputValue.length > 0?"mt-5":""}`}>{searchResultComponent}</div>
        </div>
      ) : (
        <div className="h-14 flex items-center  pl-8 font-semibold">No result matched</div>
      )}
    </div>
  )

  return (
    <div className={`w-screen sm:w-96 sm:flex ${locationChecker() ? '' : 'hidden'}`}>
      <div className="w-full bg-white border  flex flex-col items-center">
        <div className="flex flex-col w-full">
          <div className="relative h-16 flex items-center justify-center font-semibold text-lg border-b">
            {myUsername}
            <div className="absolute right-10 h-10 w-10 flex items-center justify-center cursor-pointer rounded-full  hover:bg-gray-50">
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
          <div className="h-12 flex items-center px-4">
            <input
              className="w-full appearance-none outline-none"
              placeholder="Search"
              value={inputValue}
              onFocus={() => setSearching(true)}
              onChange={(e) => handleInput(e)}
            ></input>{
              searching && 
              <div className="ml-2 text-gray-400 hover:text-gray-600" 
            onClick={() => setSearching(false)}
            >
                <i className="fas fa-times"></i>
              </div>
            }
            </div>
        </div>
        <div className="w-full flex-grow border-t overflow-y-scroll">
          {/* {loadingListComponent} */}
          {((searching || inputValue.length > 0 )? searchArea : roomListComponent) }
        </div>
      </div>
    </div>
  )
}

export default Chatlist
