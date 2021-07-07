import React, { useState, useEffect, useRef, Fragment } from 'react'
// import { getMessages } from '../../../../services/userService'
import Message from '../../../../interface/IMessage'
import User from '../../../../interface/IUser'
import Chatblock from './chatBlock'
import IChatroom from '../../../../interface/IChatroom'
import { chatRef } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'
import { useParams } from 'react-router-dom'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'
import IReplyMessage from '../../../../interface/IReplyMessage'
type ChatroomProps = {
  userSelected?: User
  roomSelected?: string

  myUserName: string
  selfIntro?: string
}

const tempRef = '-Mdtq1ZeBs48gjlT4ZdQ'

const Chatroom = ({ userSelected, roomSelected }: ChatroomProps) => {
  const { id } = useParams<Record<string, string | undefined>>()

  // const [forwardingUser, setForwardingUser] = useState<User>(
  //   userSelected || ({} as User)
  // );
  const [roomId, setRoomId] = useState(id!)
  const [myUserName, setMyUserName] = useState('')
  const [memberRef, setMemberRef] = useState<StringMap<IMember>>({})
  const [members, setMembers] = useState<IMember[]>([])
  const [typingRef, setTypingRef] = useState<StringMap<boolean>>()
  const [readRef, setReadRef] = useState<StringMap<string[]>>()

  const [forwardingRoom, setForwardingRoom] = useState<IChatroom>({} as IChatroom)
  const [isDetailed, setIsDetailed] = useState(false)
  const [messages, setMes] = useState<Message[]>([])
  const [stay, setStay] = useState(false)
  // const [isTyping,setIsTyping] = useState(false)

  useEffect(() => {
    // console.log("Ref checker",tempRef,id)
    setRoomId(id!)
    setMyUserName(loginUser()?.username)
    // console.log("Log In Data =>> ",loginUser(),loginUser().username,myUserName)
    chatRef.child(`chatrooms/${id}/members/${loginUser().uid}/`).set({ username: loginUser()?.fullName, avatar: loginUser().avatar })

    chatRef.child(`chatrooms/${id}/members`).on('value', (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setMemberRef(data)
        // Object.keys(data).map((key) => [key, data[key]]).forEach(ele =>{
        //   const updateMembers = [...members,{...(ele[1] as IMember), uid:ele[0] as string} as IMember];
        //   console.log("updateMembers =>",updateMembers);
        //    setMembers(updateMembers);
        //   }) ;
        const arr = Object.keys(data)
          .map((key) => [key, data[key]])
          .map((ele) => ({ ...(ele[1] as IMember), uid: ele[0] as string } as IMember))
        //  console.log(arr)
        setMembers(arr)
        // console.log("members",members)
      }
    })
  }, [id])

  useEffect(() => {
    chatRef.child(`chatrooms/${id}/read`).on('value', (snapshot) => {
      const data: StringMap<string>= snapshot.val()
      const objectFlip =(obj:StringMap<string>) => {
        return Object.keys(obj).reduce((ret:StringMap<string[]>, key) => {
          if(ret[obj[key]]) ret[obj[key]] = [...ret[obj[key]],key]
          else ret[obj[key]] = [key]
          console.log(ret)
          return ret;
        }, {});
      }
      setReadRef(objectFlip(data));
    })
  }, [])

  useEffect(() => {
    chatRef.child(`chatrooms/${id}`).on('value', (snapshot) => {
      const data = snapshot.val() as IChatroom
      setForwardingRoom(data)
      setTypingRef(data.isTyping)
      // console.log("setForwardingRoom =>>",forwardingRoom)
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
          .map((ele) => ({ ...ele[1], id: ele[0] })) as Message[]
        setMes(arr)
      }
    })

    // setMes(roomSelected?.messages!)
    // console.log('CHeck in chatroom====> ', forwardingRoom)

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

  const [replyMessage, setReplyMessage] = useState<IReplyMessage>()
  const onReply = (id: string, to: string, toId: string, message: string) => {
    setReplyMessage({ id, uid: loginUser().uid, from: myUserName, to, toId, message } as IReplyMessage)
    inputRef!.current?.focus()
  }

  const onReaction = () => setStay(true)

  // useEffect(()=>{
  //   console.log(replyMessage)
  // },[replyMessage])

  const resetReply = () => onReply('', '', '', '')
  const jumpTo = (id: string) => {
    const elmnt = document.getElementById(`message_${id}`)
    console.log('Check =>', elmnt)
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
    scrollTo(messages[messages.length - 1]?.id)
  }

  const updateLatest = (newMessage: string, lastActiveDate: number, latestMessageId: string) => {
    chatRef.child(`chatrooms/${roomId}/latestMessage`).set(newMessage)
    chatRef.child(`chatrooms/${roomId}/latestActiveDate`).set(lastActiveDate)
    chatRef.child(`chatrooms/${roomId}/latestMessageId`).set(latestMessageId)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputValue.match(/^(?!\s*$).+/)) {
        // setMes([
        //   ...messages,
        //   {
        //     username: myUserName,
        //     message: inputValue,
        //     date: new Date().getTime(),
        //     timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
        //     reply: replyMessage?.to.length?replyMessage : null,
        //     id: Math.random(),
        //     uid: 'temp',
        //     reaction: []
        //   } as Message
        // ])
        const newMessageRef = chatRef.child(`Messages/${tempRef}`).push()
        newMessageRef.set({
          username: myUserName,
          message: inputValue,
          date: new Date().getTime(),
          timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
          reply: replyMessage?.to.length ? replyMessage : null,
          id: newMessageRef.key,
          uid: loginUser().uid,
          reaction: []
        })
        updateLatest(inputValue, new Date().getTime(), newMessageRef?.key!)
        setInputValue('')
        resetReply()
      }
    }
  }
  const handleHeartClick = () => {
    // setMes([
    //   ...messages,
    //   {
    //     username: myUserName,
    //     message: '❤️',
    //     date: new Date().getTime(),
    //     timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
    //     reply:  replyMessage?.to.length?replyMessage : null,
    //     id: Math.random(),
    //     uid: 'temp',
    //     heart: true,
    //     reaction: []
    //   } as Message
    // ])

    const newMessageRef = chatRef.child(`Messages/${tempRef}`).push()
    newMessageRef.set({
      username: myUserName,
      message: '❤️',
      date: new Date().getTime(),
      timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
      reply: replyMessage?.to.length ? replyMessage : null,
      id: newMessageRef.key,
      uid: loginUser().uid,
      heart: true,
      reaction: []
    })
    updateLatest('❤️', new Date().getTime(), newMessageRef?.key!)
    setInputValue('')
    resetReply()
  }

  const isTyping = (action: boolean) => {
    chatRef.child(`chatrooms/${id}/isTyping/${loginUser().uid}/`).set(action)
  }

  const showTyping = () => Object.values(typingRef!).reduce((accu, curr) => accu || curr, false)

  useEffect(() => {
    if (messages?.length > 0 && !stay) scrollToBottom()
    setStay(false)
    if (messages?.length > 0) chatRef.child(`chatrooms/${id}/read/${loginUser().uid}/`).set(messages[messages.length - 1].id)
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
          <div className="w-full" key={`loading_template_${index}`}>
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
    <Fragment>
      <Chatblock
        key={`Chatblock_outer_${index}`}
        previousUid={messages[index - 1]?.uid}
        previousHasReply={messages[index - 1]?.reply?.to?.length! > 0}
        nextUid={messages[index + 1]?.uid}
        nextHasReply={messages[index + 1]?.reply?.to?.length! > 0}
        group={forwardingRoom?.group}
        memberRef={memberRef}
        onReply={onReply}
        jumpTo={jumpTo}
        avatar={memberRef[ele.uid]?.avatar || forwardingRoom?.roomPhoto}
        isForward={ele.uid === loginUser().uid}
        roomId={tempRef}
        message={ele}
        myUserName={myUserName}
        onReaction={onReaction}
      ></Chatblock>
        {  readRef && readRef![ele.id] && 
          <div className=" flex justify-end  items-center">
              { readRef[ele.id].map( uid => 
                <img className="w-6 h-6 mx-1 rounded-full" alt="" src={memberRef[uid].avatar}></img>)}
          </div>
          
        }
    </Fragment>
  ))

  const messengerComponent = (
    <div className="flex flex-col flex-grow overflow-hidden transition-all duration-150 ease-in-out">
      <div className="flex flex-col flex-grow px-4 pt-4 overflow-x-hidden overflow-y-scroll">
        {messages && messages.length > 0 ? messagesList : messagesLoading}
      </div>
      {typingRef && (
        <div className={`flex items-center px-4 transtion-all duration-200 ease-in-out ${showTyping() ? 'opacity-100 h-14 pt-4 ' : 'opacity-0 h-0'}`}>
          {members.map((ele, index) => {
            return typingRef[ele.uid] ? (
              <div className="relative h-8 w-8 mr-2">
                <img className="w-full h-full rounded-full " alt="" src={ele.avatar} />
                <div className="w-full h-full absolute top-0 left-0 animate-ping  border rounded-full"> </div>
              </div>
            ) : (
              ''
            )
          })}
          {showTyping() && (
            <div>
              is typing <span className="animate-ping "> ... </span>
            </div>
          )}
        </div>
      )}
      <div className={`${replyMessage?.to.length! > 0 ? 'h-34' : 'h-14'} py-2 flex flex-col items-center px-4`}>
        {replyMessage?.to.length! > 0 && (
          <div className="w-full h-16 px-4  flex flex-col ">
            <div className="flex items-center justify-between">
              <div>
                Replying to:
                <span className="font-semibold"> {replyMessage!.to} </span>
              </div>
              <div className="text-gray-400 hover:text-gray-600" onClick={() => resetReply()}>
                <i className="fas fa-times"></i>
              </div>
            </div>
            <div className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">{replyMessage!.message}</div>
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
              onFocus={() => isTyping(true)}
              onBlur={() => isTyping(false)}
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
