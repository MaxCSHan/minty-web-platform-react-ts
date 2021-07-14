import { useState } from 'react'
import IChatroom from '../../../../interface/IChatroom'
import IMember from '../../../../interface/IMember'
import User from '../../../../interface/IUser'
import { chatroomDB } from '../../../../setup/setupFirebase'
import UserSelecter from './UserSelecter'

type ChatroomSettingsProps = {
  id: string
  forwardingRoom: IChatroom
  members: IMember[]
  setDetailed: (value: boolean) => void
}

const ChatroomSettings = ({ id, forwardingRoom, members, setDetailed }: ChatroomSettingsProps) => {
  const [inputTitleValue, setInputTitleValue] = useState<string | undefined>(forwardingRoom.title)
  const [selectedUser, setSelectedUser] = useState<User[]>([])
  const [editMember, setEditMember] = useState(false)

  const [editTitle, setEditTitle] = useState(false)
  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputTitleValue('')
    else {
      setInputTitleValue(value)
    }
  }
  const saveTitle = () => {
    setEditTitle(false)
    chatroomDB.doc(id).update({ title: inputTitleValue })
  }
  const discardTitle = () => {
    setEditTitle(false)
    setInputTitleValue(forwardingRoom.title)
  }
  const closeModal = ()=>{
    setSelectedUser([]);
    setEditMember(false);
}

  const addUser = ()=>{
      const newMembers =[...forwardingRoom.members];
      const newMemberInfos = {...forwardingRoom.memberInfos}
      selectedUser.forEach(user => {
        if(!newMembers.includes(user.uid)){
            newMembers.push(user.uid);
            newMemberInfos[user.uid] = user;
        }
      })
      chatroomDB
      .doc(id)
      .update({"members":newMembers,"memberInfos":newMemberInfos})
      setSelectedUser([]);
      setEditMember(false);
  }
  return (
    <div className="flex-grow w-screen overflow-y-scroll sm:overflow-hidden sm:w-96 md:w-120 lg:w-160 bg-white  border flex flex-col">
      <div className="h-12 sm:h-16 w-full flex  items-center justify-center px-2 sm:px-8 border-b">
        <div className="h-12 sm:h-16  w-full flex flex-col items-start justify-center">
          <div className="w-full flex items-center text-base sm:text-xl font-semibold ml-4 sm:ml-0">Chatroom settings</div>
        </div>
        <div
          className="cursor-pointer text-base sm:text-lg  mr-6 sm:mr-0  text-gray-400 hover:text-gray-600 bg-gray-600 hover:bg-gray-600 rounded-full h-6 w-6 sm:h-10 sm:w-10 flex items-center justify-center"
          onClick={() => setDetailed(false)}
        >
          <i className="text-white fas fa-ellipsis-v"></i>
        </div>
      </div>
      {forwardingRoom?.group && (
        <div className="w-full flex flex-col justify-center px-8 py-4 border-b">
          <div className="font-semibold text-lg mb-2">Room name</div>
          <div className="flex items-center justify-between">
            <div className="mx-2 my-2 flex items-center">
              <input
                onChange={(e) => handleTitleInput(e)}
                className={`bg-white`}
                value={inputTitleValue}
                disabled={!editTitle}
                placeholder={'Set a room name'}
              ></input>
            </div>
            {/* <div className="mx-2 my-2 flex items-center">{forwardingRoom?.title}</div> */}

            {editTitle && (
              <div className="flex">
                <div className="font-semibold cursor-pointer text-blue-500 mr-3" onClick={() => saveTitle()}>
                  Save
                </div>
                {
                  <div className="font-semibold cursor-pointer text-red-500" onClick={() => discardTitle()}>
                    Discard
                  </div>
                }
              </div>
            )}
            {!editTitle && (
              <div className="font-semibold cursor-pointer text-blue-500" onClick={() => setEditTitle(true)}>
                Change Name
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full flex flex-col justify-center px-8 py-4 border-b">
        <div className="flex items-center justify-between  mb-2">
          <div className="font-semibold text-lg">Members</div>
          {forwardingRoom?.group && (
            <div className="font-semibold cursor-pointer" onClick={() => setEditMember(!editMember)}>
              + Add member
            </div>
          )}
        </div>
        {forwardingRoom?.group && editMember && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-20 flex items-center justify-center">
            <div className="w-96 sm:w-120 bg-white px-3 py-2 sm:py-4 rounded-2xl shadow-xl">
              <div className="w-full h-4 flex flex-row justify-between px-8 mt-3">
                <div className="flex items-center justify-center">
                  <i className="fas fa-times text-gray-700 cursor-pointer" onClick={() => closeModal()}></i>
                </div>
                {selectedUser.length > 0 && <div className="flex justify-center items-center font-bold  cursor-pointer  text-blue-500"
                onClick={() => addUser()}
                >Add +</div>}
              </div>
              <UserSelecter selectedUser={selectedUser} setSelectedUser={setSelectedUser}></UserSelecter>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          {members &&
            members.map((member: IMember, index) => (
              <div className="mx-2 my-2 flex items-center" key={`member_${index}`}>
                <img className="h-14 w-14 bg-red-200 rounded-full" alt="" src={member.avatar} />
                <div className="ml-4">{member.username}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-full flex flex-col justify-center px-8 py-4 border-b">
        <div className="font-semibold text-lg mb-2">Created Date</div>
        <div className="flex flex-col">
          <div className="mx-2 my-2 flex items-center">{new Date(forwardingRoom?.createdDate!).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center px-8 py-3 border-b">
        <div className="font-semibold text-lg text-red-500 cursor-pointer">Leave this chatroom</div>
        <div className=" my-2 flex items-center text-sm">You won't get messages from this group unless someone adds you back to the chat.</div>
      </div>
    </div>
  )
}

export default ChatroomSettings
