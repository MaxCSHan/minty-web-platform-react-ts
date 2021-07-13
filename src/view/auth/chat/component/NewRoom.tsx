import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { Link } from 'react-router-dom'
import IChatroom from '../../../../interface/IChatroom'
import IMember from '../../../../interface/IMember'
import User from '../../../../interface/IUser'
import StringMap from '../../../../interface/StringMap'
import { loginUser } from '../../../../services/authService'
import { chatroomDB, userDB } from '../../../../setup/setupFirebase'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, distinctUntilKeyChanged, map, startWith, switchMap } from 'rxjs/operators'
import UserSelecter from './UserSelecter'

const NewRoom = () => {
  const [title, setTitle] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedUser, setSelectedUser] = useState<User[]>([])

  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setTitle('')
    else {
      setTitle(value)
    }
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
        title: title.length > 0 ? title : null,
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
            className={`mr-6 sm:mr-2 flex items-centers  font-bold text-lg ${
              selectedUser.length > 0 ? 'text-black  cursor-pointer' : 'text-gray-400 cursor-default'
            }`}
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
      <div className="mt-12 sm:mt-0">
        <UserSelecter description={`To:`} selectedUser={selectedUser} setSelectedUser={setSelectedUser}></UserSelecter>
      </div>
    </div>
  )
}

export default NewRoom
