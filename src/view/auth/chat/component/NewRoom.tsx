import React, { useState, useEffect, useRef, useMemo,Fragment } from 'react'
import { Link } from 'react-router-dom'
import IChatroom from '../../../../interface/IChatroom'
import IMember from '../../../../interface/IMember'
import User from '../../../../interface/IUser'
import StringMap from '../../../../interface/StringMap'
import { loginUser } from '../../../../services/authService'
import { chatroomDB, userDB } from '../../../../setup/setupFirebase'
import {Subject} from "rxjs"
import { debounceTime, distinctUntilChanged, distinctUntilKeyChanged, map, startWith, switchMap } from 'rxjs/operators'
import UserSelecter from './UserSelecter'

const NewRoom = () => {
  const [title, setTitle] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [reccomendList, setReccomendList] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<User[]>([])

  const [searchUserResult, setSearchUserResult] = useState<User[]>()
  const inputRef = useRef<HTMLInputElement>(null)

  const keyword$ = new Subject<string>();
  const suggestList$ = keyword$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(ele => {
      
      if(ele.replace(/\s/g, '').length===0) return [[]];
      return userDB
      .where("username",">=",ele)
      .where('username', '<=', ele+ '\uf8ff')
      .get()
      .then((docs)=> {
        const arr:User[] = [];
        docs.forEach(doc => arr.push(doc.data() as User))
        return arr;
      })
    })
  );

  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setTitle('')
    else {
      setTitle(value)
    }
  }
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputValue('')
    else {
      setInputValue(value)
    }
  }
  const handleTouchSend = () => {}
  const handleHeartClick = () => {}

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue.length===0) {
      setSelectedUser(selectedUser.slice(0, selectedUser.length - 1))
    }
  }

  useEffect(() => {
    userDB
      .limit(10)
      .get()
      .then((doc) => {
        const arr: User[] = []
        doc.forEach((ele) => arr.push(ele.data() as User))
        console.log(arr)
        setReccomendList(arr.filter(user => user.uid!==loginUser().uid))
      })
  }, [])
  useEffect(()=>{
    const subscription = suggestList$.subscribe( ele => {
         setSearchUserResult(ele);
      })
    return()=>{
      subscription.unsubscribe()
    }
  })
  useEffect(()=> keyword$.next(inputValue) ,[inputValue])

  const radioBtnUserList = (newUser: User) => {
    if (!selectedUser.includes(newUser)) addToUserlist(newUser)
    else removeFromUserList(newUser)
  }

  const addToUserlist = (user: User) => {
    setSelectedUser([...selectedUser!, user])
  }

  const removeFromUserList = (user: User) => {
    setSelectedUser(selectedUser.filter((item) => item.uid !== user.uid))
  }

  const searchUser = () => {
    userDB
      .limit(10)
      .get()
      .then((doc) => {
        const arr: User[] = []
        doc.forEach((ele) => arr.push(ele.data() as User))
        // console.log(arr)
        setSearchUserResult(arr)
      })
  }

  const creatDM = async (selectedList: User[]) => {
    if (selectedList.length > 0) {
      const group = true
      const groupUserList = [loginUser(), ...selectedList]

      const creatDate = new Date().getTime()

      const newRoom = chatroomDB.doc()
      const newMessgaesList = newRoom.collection('messages').doc()
      newMessgaesList.set({
        username: loginUser().username,
        message: '',
        date: creatDate,
        timeHint: true,
        id: newMessgaesList.id,
        uid: loginUser().uid,
        heart: false,
        reaction: [],
        create: true
      })

      const memberUids = groupUserList.map((ele) => ele.uid)
      //
      const defaultRead = {} as StringMap<string>
      const defaultTyping = {} as StringMap<boolean>
      const defaultMembers = {} as StringMap<IMember>
      groupUserList.forEach((ele) => {
        defaultMembers[ele.uid] = { uid: ele.uid, username: ele.username, avatar: ele.avatar }
      })

      //
      memberUids.forEach((muid) => {
        defaultRead[muid] = ''
        defaultTyping[muid] = false
      })

      chatroomDB.doc(newRoom.id).set({
        id: newRoom.id,
        title: title.length>0?title:null,
        members: memberUids,
        memberInfos: defaultMembers,
        latestMessage: '',
        latestMessageId: newMessgaesList.id,
        latestActiveDate: creatDate,
        read: defaultRead,
        isTyping: defaultTyping,
        loginStatus: true,
        group: group,
        createdDate: creatDate,
        intro: ''
      } as IChatroom)

      memberUids.forEach((ele) => {
        userDB.doc(ele).collection('roomList').doc(newRoom.id).set({ id: ele })
      })
    }
  }

  return (
    <div className=" overflow-hidden h-screen sm:h-auto  w-screen sm:w-96 md:w-120 lg:w-160 bg-white   sm:border flex flex-col">
      <div className="fixed z-20 sm:static h-12 sm:h-16 bg-white w-full flex  items-center justify-center px-2 sm:px-8 border-b">
        <div className="mx-4 sm:hidden">
        <Link to="/chat/inbox">
          <i className="fas fa-chevron-left "></i>
          </Link>
        </div>
        <div className="h-16  w-full flex items-center justify-center">
          <div className="w-full flex items-center text-base sm:text-lg font-semibold">
            <div className="flex flex-shrink-0"> Group Name: </div>
            <input className="outline-none pl-2 w-full" placeholder="Optional" value={title} onChange={(e) => handleTitleInput(e)} />
          </div>
          <div
            className={`mr-6 sm:mr-2 flex items-centers  font-bold text-lg ${selectedUser.length > 0 ? 'text-black  cursor-pointer' : 'text-gray-400 cursor-default'}`}
            onClick={() => creatDM(selectedUser)}
          >
            Chat
          </div>
        </div>
      </div>
      {/* <div
        className={`${
          true ? 'visible opacity-100 h-24' : 'invisible opacity-0 h-0'
        } flex  items-center px-4 scrollbar-hide  overflow-x-scroll transition-all duration-300 ease-in-out`}
      >
        {searchUserResult?.map((user, index) => (
          <div className="flex flex-col flex-shrink-0 relative items-center justify-center mx-2 mt-2" onClick={() => removeFromUserList(user)}>
            <div className="absolute right-0 top-0 flex items-center justify-center bg-gray-200 h-4 w-4 rounded-full">
              <i className="fas fa-times text-xs"></i>
            </div>
            <img className="h-16 w-16 rounded-full" alt="" src={user.avatar}></img>
            <div className="text-xs">{user.username}</div>
          </div>
        ))}
      </div> */}
      <UserSelecter></UserSelecter>
      <div className="flex flex-col flex-grow px-6 mt-12 sm:mt-0">
        <div className="flex flex-col ">
          <div className="mt-3">To:</div>
          <div className={`mb-3 flex  items-center  scrollbar-hide  overflow-x-scroll transition-all duration-300 ease-in-out`}>
            { selectedUser?.map((user, index) => (
              <div className="flex flex-shrink-0 relative items-center justify-center mx-1 mt-2 border rounded-full px-3 py-1">
                <img className="h-8 w-8 rounded-full mr-1" alt="" src={user.avatar}></img>
                <div className="text-sm cursor-default">{user.username}</div>
                <div
                  className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-300 h-4 w-4 rounded-full cursor-pointer"
                  onClick={() => removeFromUserList(user)}
                >
                  <i className="fas fa-times text-xs text-gray-700"></i>
                </div>
              </div>
            ))}
            <div>
              <input
                className="outline-none pl-2 min-w-max w-full"
                placeholder="Search a user"
                onChange={(e) => handleSearchInput(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                ref={inputRef}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
        {inputValue.replace(/\s/g, '').length!==0 &&searchUserResult?.map((user) => (
            <div className="flex items-center justify-between mx-3 my-1" onClick={() => radioBtnUserList(user)}>
              <div className="flex items-center">
                <img className="h-10 w-10 rounded-full mr-3" alt="" src={user.avatar}></img>
                <div>{user.username}</div>
              </div>

              <div className={`w-6 h-6 border-2 rounded-full cursor-pointer ${selectedUser.includes(user) ? 'bg-green-400' : ''}`}></div>
            </div>
          ))}
          <div className="font-semibold mb-2">Suggested</div>
          {reccomendList?.map((user) => (
            <div className="flex items-center justify-between mx-3 my-1" onClick={() => radioBtnUserList(user)}>
              <div className="flex items-center">
                <img className="h-10 w-10 rounded-full mr-3" alt="" src={user.avatar}></img>
                <div>{user.username}</div>
              </div>

              <div className={`w-6 h-6 border-2 rounded-full cursor-pointer ${selectedUser.includes(user) ? 'bg-green-400' : ''}`}></div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className={`h-14   py-2 flex flex-col items-center px-4`}>
        <div className=" flex   w-full h-10 px-4 border rounded-full  items-center">
          <div className="ml-2 flex-grow">
            <input
              className="w-full outline-none"
              value={inputValue}
              placeholder="Message..."
            ></input>
          </div>
          {inputValue.length > 0 ? (
            <div className="w-8 ml-2  origin-center cursor-pointer" onClick={() => handleTouchSend()}>
              <i className="fas fa-location-arrow fa-rotate-45"></i>
            </div>
          ) : (
            <div className="w-8 ml-2 " onClick={() => handleHeartClick()}>
              <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
            </div>
          )}
        </div>
      </div> */}
    </div>
  )
}

export default NewRoom
