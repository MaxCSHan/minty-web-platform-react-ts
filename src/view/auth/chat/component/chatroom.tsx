import React, { useState, useEffect, useRef } from 'react'
import { getMessages } from '../../../../services/userService'
import Message from '../../../../interface/IMessage'
import User from '../../../../interface/IUser'
import Chatblock from './chatBlock'
import IChatroom from '../../../../interface/IChatroom'
import { chatRef } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'
import { useLocation, useParams } from 'react-router-dom'
import StringMap from "../../../../interface/StringMap"
import IMember from "../../../../interface/IMember"

type ChatroomProps = {
  userSelected?: User
  roomSelected?: string

  myUserName: string
  selfIntro?: string
}



const tempRef = '-Mdtq1ZeBs48gjlT4ZdQ'

const Chatroom = ({  userSelected, roomSelected }: ChatroomProps) => {
  const  {id}=  useParams<Record<string, string | undefined>>();

  // const [forwardingUser, setForwardingUser] = useState<User>(
  //   userSelected || ({} as User)
  // );
  const [roomId, setRoomId] = useState(id!)
  const [myUserName, setMyUserName] = useState("")
  const [memberRef, setMemberRef] = useState<StringMap<IMember>>({})
  const [members, setMembers] = useState<IMember[]>([])

  const [forwardingRoom, setForwardingRoom] = useState<IChatroom>({} as IChatroom)
  const [isDetailed, setIsDetailed] = useState(false)
  const [messages, setMes] = useState<Message[]>([])
  const [stay, setStay] = useState(false)

  

  useEffect(()=>{
    setRoomId(id!);
    setMyUserName(loginUser()?.username)
    console.log("Log In Data =>> ",loginUser(),loginUser().username,myUserName)
    chatRef.child(`chatrooms/${id}/members/${loginUser().uid}/`).set({username:loginUser()?.fullName,avatar:loginUser().avatar})

  },[id])

  useEffect(() => {
    chatRef.child(`chatrooms/${id}`).on('value', (snapshot) => {
      const data = snapshot.val() as IChatroom
      setForwardingRoom(data);
      console.log("setForwardingRoom =>>",forwardingRoom)
      setMemberRef(data.members)
      Object.keys(data.members).map((key) => [key, data.members[key]]).forEach(ele =>{
        const updateMembers = [...members,{...(ele[1] as IMember), uid:ele[0] as string} as IMember];
        console.log("updateMembers =>",updateMembers);
         setMembers(updateMembers);
        }) ;
      console.log("members",members)


    })

    // setForwardingUser(userSelected!);
    setIsDetailed(false)


    setMes([])
    chatRef.child(`Messages/${tempRef}`).on('value', (snapshot) => {
      const data = snapshot.val()
      // console.log(data)
      if (data) {
        const arr = Object.keys(data)
          .map((key) => [key, data[key]])
          .map((ele) => ({ ...ele[1], uid: ele[0] })) as Message[]
        setMes(arr)
      }
    })

    // setMes(roomSelected?.messages!)
    console.log('CHeck in chatroom====> ', forwardingRoom)

    // getMessages(roomSelected?.id!).subscribe((res) => {
    //   console.log("Success =>", res);
    //   setMes(res);
    //   scrollToBottom();
    // });
  }, [roomId])

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputValue('')
    else {
      setInputValue(value)
    }
  }

  const [replyMessage, setReplyMessage] = useState({
    id: -1,
    uid: '',
    from: '',
    to: '',
    message: ''
  })
  const onReply = (id: number, uid: string, to: string, message: string) => {
    setReplyMessage({ id, uid, from: myUserName, to, message })
    inputRef!.current?.focus()
  }

  const onReaction = () => setStay(true)

  // useEffect(()=>{
  //   console.log(replyMessage)
  // },[replyMessage])

  const resetReply = () => onReply(-1, '', '', '')
  const jumpTo = (uid: string) => {
    const elmnt = document.getElementById(`message_${uid}`)
    // console.log('Check =>', elmnt)
    if (elmnt) {
      elmnt.scrollIntoView()
      const originStyle = elmnt?.getAttribute || ''
      elmnt.setAttribute('class', `animate-wiggle ${originStyle}`)
      setInterval(() => elmnt.setAttribute('class', `${originStyle}`), 200)
    }
  }

  // let messagesEnd: HTMLDivElement;
  //   const scrollToBottom = () => {
  //     // console.log(messagesEnd)
  //     // messagesEnd.scrollIntoView({ behavior: "smooth" , block: "start", inline: "nearest"});
  //     console.log(mes.length - 2);
  //     const elmnt = document.getElementById(`message_${mes.length - 2}`);
  //     console.log(elmnt)
  //     elmnt!.scrollIntoView();
  //   };

  const scrollTo = (index: string) => {
    const elmnt = document.getElementById(`message_${index}`)
    if (elmnt) elmnt.scrollIntoView()
  }

  const scrollToBottom = () => {
    scrollTo(messages[messages.length - 1]?.uid)
  }

  const updateLatest = (newMessage: string, lastActiveDate: number) => {
    chatRef.child(`chatrooms/${roomId}/latestMessage`).set(newMessage)
    chatRef.child(`chatrooms/${roomId}/latestActiveDate`).set(lastActiveDate)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputValue.match(/^(?!\s*$).+/)) {
        setMes([
          ...messages,
          {
            username: myUserName,
            message: inputValue,
            date: new Date().getTime(),
            timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
            reply: replyMessage.id > 0 ? replyMessage : null,
            id: Math.random(),
            uid: 'temp',
            reaction: []
          } as Message
        ])
        const newMessageRef = chatRef.child(`Messages/${tempRef}`).push()
        newMessageRef.set({
          username: myUserName,
          message: inputValue,
          date: new Date().getTime(),
          timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
          reply: replyMessage.id > 0 ? replyMessage : null,
          id: Math.random(),
          uid: newMessageRef.key,
          reaction: []
        })
        updateLatest(inputValue, new Date().getTime())
        setInputValue('')
        resetReply()
      }
    }
  }
  const handleHeartClick = () => {
    setMes([
      ...messages,
      {
        username: myUserName,
        message: '❤️',
        date: new Date().getTime(),
        timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
        reply: replyMessage.id > 0 ? replyMessage : null,
        id: Math.random(),
        uid: 'temp',
        heart: true,
        reaction: []
      } as Message
    ])

    const newMessageRef = chatRef.child(`Messages/${tempRef}`).push()
    newMessageRef.set({
      username: myUserName,
      message: '❤️',
      date: new Date().getTime(),
      timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
      reply: replyMessage.id > 0 ? replyMessage : null,
      id: Math.random(),
      uid: newMessageRef.key,
      heart: true,
      reaction: []
    })
    updateLatest('❤️', new Date().getTime())
    setInputValue('')
    resetReply()
  }

  useEffect(() => {
    if (messages?.length > 0 && !stay) scrollToBottom()
    setStay(false)
  }, [messages])

  const starterTemplate = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
      Please select a user to start the chat.
    </div>
  )

  const messagesLoading = (
    <div className="animate-puls">
      {forwardingRoom &&
        forwardingRoom?.latestMessage &&
        [...Array(15)].map((ele, index) => (
          <div className="w-full">
            <div className={`flex w-full `} id={`message_${index}`} key={`message_${index}`}>
              <div className={`flex my-2 w-full`}>
                <div className="h-10 w-10  rounded-full bg-gray-200"></div>
                <div className={`mx-2  w-5/6`}>
                  <div className="h-14 w-5/6 px-4 py-3 max-w-md bg-gray-200 flex flex-wrap break-all  items-center justify-around border rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )

  // const messagesList = (
  //   <div>
  //     {messages.map((ele, index) => (
  //       <div className="group">
  //         <div className="text-center text-xs text-gray-600 my-4">
  //           {dateController(ele)}
  //         </div>

  //         <div
  //           className={`flex w-full ${
  //             ele.username === myUserName ? "flex-row-reverse" : ""
  //           }`}
  //           id={`message_${index}`}
  //           key={`message_${index}`}

  //           // ref={(el) => {
  //           //   messagesEnd = el!;
  //           // }}
  //         >
  //           <div
  //             className={`flex my-2 max-w-lg ${
  //               ele.username === myUserName ? "flex-row-reverse" : ""
  //             }`}
  //           >
  //             <img
  //               className="h-10 w-10 border rounded-full"
  //               alt=""
  //               src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
  //             />
  //             <div
  //               className={`mx-2 flex last:hidden ${
  //                 ele.username === myUserName ? " text-right" : ""
  //               }`}
  //             >
  //               <div className="px-4 py-3 max-w-sm flex flex-wrap break-all  items-center justify-around border rounded-3xl">
  //                 {ele.message}
  //               </div>
  //               <div className=" group-hover:flex">
  //                 <i className="fas fa-reply"></i>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );

  const messagesList = messages?.map((ele: Message, index) => (
    <Chatblock
      group={forwardingRoom?.group}
      onReply={onReply}
      jumpTo={jumpTo}
      avatar={memberRef[ele.uid]?.avatar || forwardingRoom?.roomPhoto}
      isForward={ele.username === myUserName}
      uid={tempRef}
      message={ele}
      myUserName={myUserName}
      onReaction={onReaction}
    ></Chatblock>
  ))

  const messengerComponent = (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="flex flex-col flex-grow px-4 overflow-y-scroll">{messages && messages.length > 0 ? messagesList : messagesLoading}</div>
      <div className={`${replyMessage.id > 0 ? 'h-34' : 'h-14'} py-2 flex flex-col items-center px-4`}>
        {replyMessage.id > 0 && (
          <div className="w-full h-16 px-4  flex flex-col ">
            <div className="flex items-center justify-between">
              <div>
                Replying to:
                <span className="font-semibold"> {replyMessage.to} </span>
              </div>
              <div className="text-gray-400 hover:text-gray-600" onClick={() => resetReply()}>
                <i className="fas fa-times"></i>
              </div>
            </div>
            <div className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">{replyMessage.message}</div>
          </div>
        )}
        <div className="w-full h-10 px-4 border rounded-full flex items-center ">
          {/* <div className="w-10">front</div> */}
          <div className="ml-2 flex-grow">
            <input
              className="w-full outline-none"
              value={inputValue}
              placeholder="Message..."
              ref={inputRef}
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => handleKeyPress(e)}
            ></input>
          </div>
          <div className="w-8 ml-2 " onClick={() => handleHeartClick()}>
            <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
          </div>
        </div>
      </div>
    </div>
  )
  const detailedComponent = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-16 w-full flex  items-center justify-center px-8 border-b">
        <div className="h-16  w-full flex flex-col items-start justify-center">
          <div className="w-full flex items-center text-xl font-semibold">Chatroom settings</div>
        </div>
        <div
          className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 bg-gray-600 hover:bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center"
          onClick={() => setIsDetailed(false)}
        >
          <i className="text-white fas fa-ellipsis-v"></i>
        </div>
      </div>
      {forwardingRoom?.group && (
        <div className="w-full flex flex-col justify-center px-8 py-4 border-b">
          <div className="font-semibold text-lg mb-2">Room name</div>
          <div className="flex items-center justify-between">
            <div className="mx-2 my-2 flex items-center">{forwardingRoom?.title}</div>
            {forwardingRoom?.title && <div className="font-semibold cursor-pointer text-blue-500">Change Name</div>}
          </div>
        </div>
      )}

      <div className="w-full flex flex-col justify-center px-8 py-4 border-b">
        <div className="flex items-center justify-between  mb-2">
          <div className="font-semibold text-lg">Members</div>
          {forwardingRoom?.group && <div className="font-semibold cursor-pointer">+ Add member</div>}
        </div>
        <div className="flex flex-col">
          {members &&
            members.map((member:IMember, index) => (
              <div className="mx-2 my-2 flex items-center">
                <img className="h-14 w-14 bg-red-200 rounded-full" src={member.avatar} />
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

  const chatroomTemplate = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col">
      <div className="h-16 w-full flex  items-center justify-center px-8 border-b">
        <div className="h-16  w-full flex flex-col items-start justify-center">
          <div className="w-full flex items-center text-xl font-semibold">{forwardingRoom ? forwardingRoom.title : 'Select a user'}</div>
          <div className="w-full items-center text-sm">{forwardingRoom ? forwardingRoom.intro : 'text'}</div>
        </div>
        <div
          className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full h-10 w-10 flex items-center justify-center"
          onClick={() => setIsDetailed(true)}
        >
          <i className="fas fa-ellipsis-v"></i>
        </div>
      </div>
      {messengerComponent}
    </div>
  )

  return roomId ? (isDetailed ? detailedComponent : chatroomTemplate) : starterTemplate
}

export default Chatroom
