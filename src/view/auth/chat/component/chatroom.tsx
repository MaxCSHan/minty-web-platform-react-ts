import React, { useState, useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'

// import { getMessages } from '../../../../services/userService'
import Message from '../../../../interface/IMessage'
import User from '../../../../interface/IUser'
import Chatblock from './chatBlock'
import IChatroom from '../../../../interface/IChatroom'
import { chatroomDB, userDB } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'
import { useParams } from 'react-router-dom'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'
import IReplyMessage from '../../../../interface/IReplyMessage'

import { useBeforeunload } from 'react-beforeunload'

type ChatroomProps = {
  userSelected?: User
  roomSelected?: string

  myUserName: string
  selfIntro?: string
}

const Chatroom = ({ userSelected, roomSelected }: ChatroomProps) => {
  const { id } = useParams<Record<string, string | undefined>>()
  const [isChatroomExist, setIsChatroomExist] = useState(true)
  const [loaded, setIsloaded] = useState(false)
  // const [loadMessgae, setLoadMessgae] = useState(20)
  const [loadingTop, setLoadingTop] = useState(false)

  const [tempRef, setTempRef] = useState('')
  const [roomTitle, setRoomTitle] = useState('')
  const [newUser, setNewUser] = useState<User>()

  // const [roomId, setRoomId] = useState(id!)
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

  useBeforeunload((event) => {
    if (isChatroomExist) {
      var typingUpdate: any = {}
      typingUpdate[`isTyping.${loginUser().uid}`] = false
      chatroomDB.doc(id).update(typingUpdate)
    }
  })

  /// Hooks
  useEffect(() => {
    // console.log('started', id)
    // setTempRef('')
    // setMemberRef({})
    // setMembers([])
    // setReadRef({})
    // setTypingRef({})
    // setMes([])
    // setForwardingRoom({} as IChatroom)
    // setMyUserName(loginUser()?.username)
    // setIsDetailed(false)
    let isExist: boolean
    const theOtherUid = id?.replace(loginUser().uid, '')

    if (theOtherUid) {
      userDB.doc(theOtherUid!).get().then((doc) => {
        const data: User = doc.data() as User
        // console.log(!forwardingRoom.group, 'Antother user is', data)

        if (theOtherUid && data) {
          setNewUser(data)
          setRoomTitle(data.username)
        }
      })
    }

    const chatRoomListener = chatroomDB.doc(id).onSnapshot((doc) => {
      // console.log('Current data: ', doc.data())
      const data = doc.data() as IChatroom
      const chatroomData: IChatroom = data

      const isExist = data !== undefined
      setIsChatroomExist(isExist)
      if (isExist) {
        // chatRef.child(`chatrooms/${id}/members/${loginUser().uid}/`).update({ username: loginUser()?.fullName, avatar: loginUser().avatar })

        // console.log("messages id=>",chatroomData.messages)
        setTempRef(chatroomData.messages)

        // console.log('membersRef =>', chatroomData.memberInfos)
        if (chatroomData.memberInfos) {
          setMemberRef(chatroomData.memberInfos)

          const arr = Object.keys(chatroomData.memberInfos)
            .map((key) => [key, chatroomData.memberInfos[key]])
            .map((ele) => ({ ...(ele[1] as IMember), uid: ele[0] as string } as IMember))
          //  console.log(arr)
          setMembers(arr)
          if (chatroomData.group && !chatroomData.title) {
            setRoomTitle(arr.map(ele => ele.username).filter(ele => ele!==loginUser().username).join(", "))
          }

        }

        // console.log("readRef =>",chatroomData.read)
        const objectFlip = (obj: StringMap<string>) => {
          return Object.keys(obj).reduce((ret: StringMap<string[]>, key) => {
            if (ret[obj[key]]) ret[obj[key]] = [...ret[obj[key]], key]
            else ret[obj[key]] = [key]
            return ret
          }, {})
        }
        if (chatroomData.read) setReadRef(objectFlip(chatroomData.read))

        // console.log("isTyping =>",chatroomData.isTyping)
        if (chatroomData.isTyping) setTypingRef(chatroomData.isTyping)

        // console.log("Room =>",chatroomData);
        setForwardingRoom(chatroomData)

      }

    })
 

    return () => {
      chatRoomListener()
      setTempRef('')
      setMemberRef({})
      setNewUser({} as User)
      setMembers([])
      setReadRef({})
      setTypingRef({})
      setMes([])
      setForwardingRoom({} as IChatroom)
      setMyUserName(loginUser()?.username)
      setIsChatroomExist(false)
      setIsDetailed(false)
      console.log("room",forwardingRoom)
    }
  }, [id])

  useEffect(() => {
    let messageListener: () => void
    if (isChatroomExist) {
      // console.log('isChatroomExist', isChatroomExist)
      messageListener = chatroomDB
        .doc(id)
        .collection('messages')
        .orderBy('date', 'desc')
        .limit(100)
        .onSnapshot((doc) => {
          if (doc) {
            const mesarr = [] as Message[]
            doc.forEach((mes) => {
              mesarr.unshift(mes.data() as Message)
            })
            setMes(mesarr)
          }
          setIsloaded(true)
        })
    }
    return () => {
      if (isChatroomExist) messageListener()
      setIsloaded(false)
    }
  }, [id, isChatroomExist])


  useEffect(() => {
    if (messages.length > 0) {
      const readSetter = chatroomDB.doc(id)
      var usersUpdate: any = {}
      usersUpdate[`read.${loginUser().uid}`] = messages[messages.length - 1].id
      if (messages?.length > 0 && !stay) scrollToBottom()
      setStay(false)
      if (messages?.length > 0) readSetter.update(usersUpdate)
    }
  }, [messages])

  useEffect(()=>{
    if(loadingTop){
      console.log("trigger")
    }
  },[loadingTop])

  /// Hooks end

  /** Creat a new DM room */
  const creatDM = async (uid: string, input: string) => {
    const privateCoId = [loginUser().uid, uid].sort().join('')
    const group = false

    await userDB
      .doc(loginUser().uid)
      .collection('roomList')
      .doc(privateCoId)
      .get()
      .then((doc) => {

        const setupNew = !doc.exists
        // console.log('Need to set up', setupNew)

        if (setupNew) {
          // console.log('setupNew ')
          const creatDate = new Date().getTime()

          const newRoom = chatroomDB.doc(privateCoId)
          const newMessgaesList = newRoom.collection('messages').doc()
          newMessgaesList.set({
            username: myUserName,
            message: input,
            date: creatDate,
            timeHint: true,
            reply: replyMessage?.to.length ? replyMessage : null,
            id: newMessgaesList.id,
            uid: loginUser().uid,
            heart: input === '❤️',
            reaction: []
          })

          const memberUids = [loginUser().uid, uid]
          //
          const defaultRead = {} as StringMap<string>
          const defaultTyping = {} as StringMap<boolean>
          const defaultMembers = {} as StringMap<IMember>
          defaultMembers[loginUser().uid] = { uid: loginUser().uid, username: loginUser().username, avatar: loginUser().avatar }
          defaultMembers[newUser?.uid!] = { uid: newUser?.uid!, username: newUser?.username!, avatar: newUser?.avatar! }

          //
          memberUids.forEach((muid) => {
            defaultRead[muid] = ''
            defaultTyping[muid] = false
          })

          chatroomDB.doc(privateCoId).set({
            id: newRoom.id,
            title: `${loginUser().username}`,
            members: memberUids,
            memberInfos: defaultMembers,
            latestMessage: input,
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
            userDB.doc(ele).collection('roomList').doc(privateCoId).set({ privateCoId: true })
          })
        }
      })
    setIsChatroomExist(true)

  }

  ///

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
    scrollTo(messages[messages.length - 1]?.id)
  }

  const updateLatest = (newMessage: string, lastActiveDate: number, latestMessageId: string) => {
    var messageUpdate = {
      latestMessage: newMessage,
      latestActiveDate: lastActiveDate,
      latestMessageId: latestMessageId
    }
    // console.log('update!!', messageUpdate)
    chatroomDB.doc(id).update(messageUpdate)

    // chatRef.child(`chatrooms/${id}/latestMessage`).set(newMessage)
    // chatRef.child(`chatrooms/${id}/latestActiveDate`).set(lastActiveDate)
    // chatRef.child(`chatrooms/${id}/latestMessageId`).set(latestMessageId)
  }

  const sendInput = () => {
    if (isChatroomExist && inputValue.match(/^(?!\s*$).+/)) {
      const newMessageRef = chatroomDB.doc(id).collection('messages').doc()
      newMessageRef.set({
        username: myUserName,
        message: inputValue,
        date: new Date().getTime(),
        timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
        reply: replyMessage?.to.length ? replyMessage : null,
        id: newMessageRef.id,
        uid: loginUser().uid,
        reaction: []
      })
      updateLatest(inputValue, new Date().getTime(), newMessageRef.id!)
    } else {
      creatDM(newUser?.uid!, inputValue)
    }
    setInputValue('')
    resetReply()
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendInput()
    }
  }
  const isTop = () => {
    const elmnt = document.getElementById(`message_${messages[0]?.id}`)
    const mesTop = document.getElementById("messagesList")
    
    if (elmnt && mesTop &&elmnt.getBoundingClientRect().y > mesTop.getBoundingClientRect().top) return true;
  }

  const handleScroll = (e: any) => {
    if(isTop() && !loadingTop) {
      setLoadingTop(isTop()!)
    };
  }

  const handleTouchSend = () => {
    sendInput()
    inputRef!.current?.focus()
  }

  const handleHeartClick = () => {
    if (isChatroomExist) {
      const newMessageRef = chatroomDB.doc(id).collection('messages').doc()
      newMessageRef.set({
        username: myUserName,
        message: '❤️',
        date: new Date().getTime(),
        timeHint: (new Date().getTime() - messages[messages.length - 1]?.date) / (1000 * 60) > 5,
        reply: replyMessage?.to.length ? replyMessage : null,
        id: newMessageRef.id,
        uid: loginUser().uid,
        heart: true,
        reaction: []
      })
      updateLatest('❤️', new Date().getTime(), newMessageRef?.id!)
    } else {
      creatDM(newUser?.uid!, '❤️')
    }
    setInputValue('')
    resetReply()
  }

  const isTyping = (action: boolean) => {
    // console.log('id', id, 'isChatroomExist', isChatroomExist)
    if (isChatroomExist) {
      var typingUpdate: any = {}
      typingUpdate[`isTyping.${loginUser().uid}`] = action
      chatroomDB.doc(id).update(typingUpdate)
    }
  }

  const showTyping = () =>
    Object.keys(typingRef!)
      .filter((uid) => uid !== loginUser().uid)
      .map((ele) => typingRef![ele])
      .reduce((accu, curr) => accu || curr, false)

  const beforeLoad = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
      <div>Select a chatroom</div>
    </div>
  )

  const starterTemplate = (
    <div className="flex-grow w-screen sm:w-160 flex flex-col items-center justify-center text-2xl">
      <img className="rounded-full w-32 h-32" alt="" src={newUser?.avatar} />
      <div className="mt-4">{newUser?.username}</div>
      <div className="mt-6 rounded-xl py-2 px-2  border text-sm font-semibold cursor-pointer">View Profile</div>
    </div>
  )

  const messagesLoading = (
    <div>
      {!isChatroomExist && loaded && starterTemplate}
      {isChatroomExist &&
        [...Array(15)].map((ele, index) => (
          <div className="w-full animate-pulse" key={`loading_template_${index}`}>
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

  const messagesList =
    messages &&
    messages.length > 0 &&
    messages?.map((ele: Message, index) => (
      <Fragment>
        <Chatblock
          key={`Chatblock_outer_${index}`}
          previousUid={messages[index - 1]?.uid}
          previousHasReply={messages[index - 1]?.reply?.to?.length! > 0 || messages[index - 1]?.heart}
          nextUid={messages[index + 1]?.uid}
          nextHasReply={messages[index + 1]?.reply?.to?.length! > 0 || messages[index + 1]?.heart}
          group={forwardingRoom?.group}
          memberRef={memberRef}
          onReply={onReply}
          jumpTo={jumpTo}
          avatar={memberRef[ele.uid]?.avatar || forwardingRoom?.roomPhoto}
          isForward={ele.uid === loginUser().uid}
          roomId={id!}
          message={ele}
          myUserName={myUserName}
          onReaction={onReaction}
        ></Chatblock>
        {readRef && readRef![ele.id] && (
          <div className=" flex justify-end  items-center">
            {readRef[ele.id].map((uid) => (
              <img className="w-6 h-6 mx-1 rounded-full" alt="" src={memberRef[uid].avatar}></img>
            ))}
          </div>
        )}
      </Fragment>
    ))

  const messengerComponent = (
      <div className={`flex flex-col flex-grow overflow-hidden  transition-all duration-150 ease-in-out pt-10 sm:pt-0`}>
        <div className="flex flex-col flex-grow flex-shrink h-screen px-4 pt-4 overflow-x-hidden overflow-y-scroll" id="messagesList" onScroll={(e) => handleScroll(e)}>
          {messages && messages.length > 0 ? messagesList : messagesLoading}
        </div>
        {typingRef && (
          <div
            className={`flex items-center px-4 transtion-all duration-200 ease-in-out ${showTyping() ? 'opacity-100 h-14 pt-4 ' : 'opacity-0 h-0'}`}
          >
            {members
              .filter((mem) => mem.uid !== loginUser().uid)
              .map((ele, index) => {
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
                is typing <span className="animate-ping text-lg"> . . . </span>
              </div>
            )}
          </div>
        )}
      </div>
  )
  const detailedComponent = (
    <div className="flex-grow w-screen overflow-y-scroll sm:overflow-hidden sm:w-96 md:w-120 lg:w-160 bg-white  border flex flex-col">
      <div className="h-12 sm:h-16 w-full flex  items-center justify-center px-2 sm:px-8 border-b">
        <div className="h-12 sm:h-16  w-full flex flex-col items-start justify-center">
          <div className="w-full flex items-center text-base sm:text-xl font-semibold ml-4 sm:ml-0">Chatroom settings</div>
        </div>
        <div
          className="cursor-pointer text-base sm:text-lg  mr-6 sm:mr-0  text-gray-400 hover:text-gray-600 bg-gray-600 hover:bg-gray-600 rounded-full h-6 w-6 sm:h-10 sm:w-10 flex items-center justify-center"
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
    <div className=" overflow-hidden h-screen sm:h-auto  w-screen sm:w-96 md:w-120 lg:w-160 bg-white   sm:border flex flex-col">
      <div className="fixed z-20 sm:static h-12 sm:h-16 bg-white w-full flex  items-center justify-center px-2 sm:px-8 border-b">
        <Link to="/chat/inbox">
          <div className="mx-4 sm:hidden">
            <i className="fas fa-chevron-left "></i>
          </div>
        </Link>
        <div className="h-16  w-full flex flex-col items-start justify-center">
          <div className="w-full flex items-center text-base sm:text-xl font-semibold">
            {isChatroomExist? forwardingRoom.title ? forwardingRoom.title : members.filter(ele => ele.uid!==loginUser().uid).map(ele => ele.username).join(", ") : newUser?.username}
          </div>
          <div className="w-full items-center text-sm">{forwardingRoom ? forwardingRoom.intro : 'text'}</div>
        </div>
        {isChatroomExist && (
          <div
            className="cursor-pointer text-base sm:text-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full h-6 w-6 sm:h-10 sm:w-10 mr-6 sm:mr-0 flex items-center justify-center"
            onClick={() => setIsDetailed(true)}
          >
            <i className="fas fa-ellipsis-v"></i>
          </div>
        )}
      </div>
      {messengerComponent}
      <div className={`${replyMessage?.to.length! > 0 ? 'h-34' : 'h-14'}    py-2 flex flex-col items-center px-4`}>
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
        <div className=" flex   w-full h-10 px-4 border rounded-full  items-center">
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
      </div>
    </div>
  )

  return isDetailed ? detailedComponent : chatroomTemplate
}

export default Chatroom
