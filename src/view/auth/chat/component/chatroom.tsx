//React
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { Link ,useParams} from 'react-router-dom'
import { useBeforeunload } from 'react-beforeunload'

//Interface
import Message from '../../../../interface/IMessage'
import User from '../../../../interface/IUser'
import IChatroom from '../../../../interface/IChatroom'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'
import IReplyMessage from '../../../../interface/IReplyMessage'

//DB
import { chatroomDB, userDB } from '../../../../setup/setupFirebase'

//Service
import { loginUser } from '../../../../services/authService'

//Component
import Chatblock from './chatBlock'
import ChatroomSettings from './ChatroomSettings'

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
  const [loadingTop, setLoadingTop] = useState(false)
  const [newUser, setNewUser] = useState<User>()
  const [myUserName, setMyUserName] = useState('')
  const [memberRef, setMemberRef] = useState<StringMap<IMember>>({})
  const [members, setMembers] = useState<IMember[]>([])
  const [typingRef, setTypingRef] = useState<StringMap<boolean>>()
  const [readRef, setReadRef] = useState<StringMap<string[]>>()
  const [forwardingRoom, setForwardingRoom] = useState<IChatroom>({} as IChatroom)
  const [isDetailed, setIsDetailed] = useState(false)
  const [messages, setMes] = useState<Message[]>([])
  const [stay, setStay] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useBeforeunload((event) => {
    if (isChatroomExist) {
      var typingUpdate: any = {}
      typingUpdate[`isTyping.${loginUser().uid}`] = false
      chatroomDB.doc(id).update(typingUpdate)
    }
  })

  /// Hooks
  useEffect(() => {

    setMyUserName(loginUser()?.username);
    const theOtherUid = id?.replace(loginUser().uid, '');

    if (theOtherUid) {
      userDB.doc(theOtherUid).get().then((doc) => {
        const userData: User = doc.data() as User
        if (userData)  setNewUser(userData);
      })
    }

    const chatRoomListener = chatroomDB.doc(id).onSnapshot((doc) => {
      const isExist = doc.exists;
      const chatroomData = doc.data() as IChatroom

      setIsChatroomExist(isExist)
      if (isExist) {
        setForwardingRoom(chatroomData);
        if (chatroomData.memberInfos) {
          setMemberRef(chatroomData.memberInfos)

          const arr = Object.keys(chatroomData.memberInfos)
            .map((key) => [key, chatroomData.memberInfos[key]])
            .map((ele) => ({ ...(ele[1] as IMember), uid: ele[0] as string } as IMember))
          //  console.log(arr)
          setMembers(arr)
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
        if (chatroomData.isTyping) setTypingRef(chatroomData.isTyping)


      }

    })
 

    return () => {
      chatRoomListener()
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
      console.log("Top loading trigger")
    }
  },[loadingTop])

  /// Hooks end

  /** Creat a new DM room */
  const creatDM = async (uid: string, input: string) => {
    const privateCoId = [loginUser().uid, uid].sort().join('');
    const group = false;

    await userDB
      .doc(loginUser().uid)
      .collection('roomList')
      .doc(privateCoId)
      .get()
      .then((doc) => {

        const setupNew = !doc.exists
        if (setupNew) {
          const creatDate = new Date().getTime();

          const newRoomRef = chatroomDB.doc(privateCoId);
          const newMessgaesListRef = newRoomRef.collection('messages').doc();
          newMessgaesListRef.set({
            username: myUserName,
            message: input,
            date: creatDate,
            timeHint: true,
            reply: replyMessage?.to.length ? replyMessage : null,
            id: newMessgaesListRef.id,
            uid: loginUser().uid,
            heart: input === '❤️',
            reaction: []
          })

          const memberUids = [loginUser().uid, uid]
          //
       
          const createDefaultMembers = (currentUser:User,memberUser:User) =>{
            const defaultMembers = {} as StringMap<IMember>
            defaultMembers[currentUser.uid] = { uid: currentUser.uid, username: currentUser.username, avatar: currentUser.avatar }
            defaultMembers[memberUser.uid!] = { uid: memberUser.uid!, username: memberUser.username!, avatar: memberUser.avatar! }
            return defaultMembers;
          }
          

          //
          const defaultRead = {} as StringMap<string>
          const defaultTyping = {} as StringMap<boolean>
          memberUids.forEach((muid) => {
            defaultRead[muid] = ''
            defaultTyping[muid] = false
          })

          chatroomDB.doc(privateCoId).set({
            id: newRoomRef.id,
            members: memberUids,
            memberInfos: createDefaultMembers(loginUser(),newUser!),
            latestMessage: input,
            latestMessageId: newMessgaesListRef.id,
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

  ///Input

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputValue('')
    else {
      setInputValue(value)
    }
  }

    ///Reply

  const [replyMessage, setReplyMessage] = useState<IReplyMessage>()
  const onReply = (id: string, to: string, toId: string, message: string) => {
    setReplyMessage({ id, uid: loginUser().uid, from: myUserName, to, toId, message } as IReplyMessage)
    inputRef!.current?.focus()
  }

  const onReaction = () => setStay(true)
  const resetReply = () => onReply('', '', '', '')
  const jumpTo = (id: string) => {
    const elmnt = document.getElementById(`message_${id}`)
    if (elmnt) {
      elmnt.scrollIntoView()
      const originStyle = elmnt?.getAttribute || ''
      elmnt.setAttribute('class', `animate-wiggle ${originStyle}`)
      setInterval(() => elmnt.setAttribute('class', `${originStyle}`), 200)
    }
  }

  const scrollTo = (index: string) => {
    const elmnt = document.getElementById(`message_${index}`)
    if (elmnt) elmnt.scrollIntoView()
  }

  const scrollToBottom = () => {
    scrollTo(messages[messages.length - 1]?.id)
  }

  const updateLatest = (newMessage: string, lastActiveDate: number, latestMessageId: string) => {
    const messageUpdate = {
      latestMessage: newMessage,
      latestActiveDate: lastActiveDate,
      latestMessageId: latestMessageId
    }
    chatroomDB.doc(id).update(messageUpdate);
  }

  const sendInput = () => {
    const currDateNumber = new Date().getTime();
    if (isChatroomExist && inputValue.match(/^(?!\s*$).+/)) {
      const newMessageRef = chatroomDB.doc(id).collection('messages').doc();
      const isIntervalGreaterThan = (mins:number) =>{
        const minute = (1000 * 60);
        return (currDateNumber - messages[messages.length - 1]?.date) / minute  > mins
      }
      newMessageRef.set({
        username: myUserName,
        message: inputValue,
        date: currDateNumber,
        timeHint: isIntervalGreaterThan(5),
        reply: replyMessage?.to.length ? replyMessage : null,
        id: newMessageRef.id,
        uid: loginUser().uid
      })
      updateLatest(inputValue, currDateNumber, newMessageRef.id!)
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
    inputRef!.current?.focus();
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
  const detailedComponent = <ChatroomSettings id={id!} forwardingRoom={forwardingRoom} members={members} setDetailed={(value)=>setIsDetailed(value)}></ChatroomSettings>
  

  const chatroomTemplate = (
    <div className=" overflow-hidden h-screen sm:h-auto  w-screen sm:w-96 md:w-120 lg:w-160 bg-white   sm:border flex flex-col">
      <div className="fixed z-20 sm:static h-12 sm:h-16 bg-white flex  items-center justify-center px-2 sm:px-8 border-b">
        <Link to="/chat/inbox">
          <div className="mx-4 sm:hidden">
            <i className="fas fa-chevron-left "></i>
          </div>
        </Link>
        <div className="h-16 w-60 sm:w-80 md:w-100 lg:w-140 flex flex-col items-start justify-center">
          <div className="w-full  items-center text-base sm:text-xl font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
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
