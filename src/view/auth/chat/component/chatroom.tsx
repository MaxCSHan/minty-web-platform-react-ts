//React
import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { useBeforeunload } from 'react-beforeunload'

//Interface
import Message from '../../../../interface/IMessage'
import IUser from '../../../../interface/IUser'
import IChatroom from '../../../../interface/IChatroom'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'
import IReplyMessage from '../../../../interface/IReplyMessage'

//Firebase
import firebase, { chatroomDB, userDB, imagesRef } from '../../../../setup/setupFirebase'

//Service
import { loginUser } from '../../../../services/authService'

//Component
import Chatblock from './chatBlock'
import ChatroomSettings from './ChatroomSettings'
import InputBar from './InputBar'

//Package
import { useDropzone } from 'react-dropzone'
import IReaction from '../../../../interface/IReaction'

type ChatroomProps = {
  userSelected?: IUser
  roomSelected?: string

  myUserName: string
  selfIntro?: string
}

const Chatroom = ({ userSelected, roomSelected }: ChatroomProps) => {
  const history = useHistory()
  const location = useLocation()
  type stateProps = {
    roomObject: IChatroom
    theOtherUser: IUser
  }
  const { roomObject } = (location.state as stateProps) || {}
  const { theOtherUser } = (location.state as stateProps) || {}

  const loginUid = loginUser().uid
  const { id } = useParams<Record<string, string | undefined>>()
  const [isChatroomExist, setIsChatroomExist] = useState(true)
  const [loaded, setIsloaded] = useState(false)
  const [loadingTop, setLoadingTop] = useState(false)
  const [newUser, setNewUser] = useState<IUser>(theOtherUser)
  const [myUserName, setMyUserName] = useState('')
  const [memberRef, setMemberRef] = useState<StringMap<IMember>>({})
  const [members, setMembers] = useState<IMember[]>([])
  const [typingRef, setTypingRef] = useState<StringMap<boolean>>()
  const [readRef, setReadRef] = useState<StringMap<string[]>>()
  const [forwardingRoom, setForwardingRoom] = useState<IChatroom>(roomObject || ({} as IChatroom))
  const [isDetailed, setIsDetailed] = useState(false)
  const [messages, setMes] = useState<Message[]>([])
  const [stay, setStay] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<any>([])
  const [showImage, setShowImage] = useState('')
  const [isFocusingInput, setIsFocusingInput] = useState(false)
  const [isShowTags, setIsShowTags] = useState(-1)
  const [inputTags, setInputTags] = useState('')
  const [mentionedUser, setMentionedUser] = useState(0)

  const mentionRecommendation = members.filter((member) => member.username.includes(inputTags))

  useBeforeunload((event) => {
    if (isChatroomExist) {
      var typingUpdate: any = {}
      typingUpdate[`isTyping.${loginUid}`] = false
      chatroomDB.doc(id).update(typingUpdate)
    }
  })

  /// Hooks
  useEffect(() => {
    setMyUserName(loginUser()?.username)

    const chatRoomListener = chatroomDB.doc(id).onSnapshot((doc) => {
      const isExist = doc.exists
      const chatroomData = doc.data() as IChatroom

      setIsChatroomExist(isExist)
      if (isExist) {
        setForwardingRoom(chatroomData)
        if (chatroomData.memberInfos) {
          setMemberRef(chatroomData.memberInfos)

          const arr = Object.keys(chatroomData.memberInfos)
            .map((key) => [key, chatroomData.memberInfos[key]])
            .map((ele) => ({ ...(ele[1] as IMember), uid: ele[0] as string } as IMember))
            .sort((a, b) => {
              var nameA = a.username.toLowerCase(),
                nameB = b.username.toLowerCase()
              if (nameA < nameB)
                //sort string ascending
                return -1
              if (nameA > nameB) return 1
              return 0 //default return value (no sorting)
            })
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
      const theOtherUid = id?.replace(loginUid, '')

      if (theOtherUid) {
        userDB
          .doc(theOtherUid)
          .get()
          .then((doc) => {
            const userData: IUser = doc.data() as IUser
            if (userData) setNewUser(userData)
            if (!userData && !isExist) history.push('/chat/inbox')
          })
      }
    })

    return () => {
      chatRoomListener()
      setMemberRef({})
      setNewUser({} as IUser)
      setMembers([])
      setReadRef({})
      setTypingRef({})
      setMes([])
      setForwardingRoom({} as IChatroom)
      setMyUserName(loginUser()?.username)
      setIsChatroomExist(false)
      setIsDetailed(false)
      console.log('room', forwardingRoom)
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
    } else setIsloaded(true)
    return () => {
      if (isChatroomExist) messageListener()
      setIsloaded(false)
    }
  }, [id, isChatroomExist])

  useEffect(() => {
    if (messages.length > 0) {
      const readSetter = chatroomDB.doc(id)
      var usersUpdate: any = {}
      usersUpdate[`read.${loginUid}`] = messages[messages.length - 1].id
      if (messages?.length > 0 && !stay) scrollToBottom()
      setStay(false)
      if (messages?.length > 0) readSetter.update(usersUpdate)
    }
  }, [messages])

  useEffect(() => {
    if (loadingTop) {
      console.log('Top loading trigger')
    }
  }, [loadingTop])

  /// Hooks end

  /** Creat a new DM room */
  const creatDM = async (uid: string, input: string) => {
    const privateCoId = [loginUid, uid].sort().join('')
    const group = false

    await userDB
      .doc(loginUid)
      .collection('roomList')
      .doc(privateCoId)
      .get()
      .then((doc) => {
        const setupNew = !doc.exists
        if (setupNew) {
          const creatDate = new Date().getTime()

          const newRoomRef = chatroomDB.doc(privateCoId)
          const newMessgaesListRef = newRoomRef.collection('messages').doc()
          newMessgaesListRef.set({
            username: myUserName,
            message: input,
            date: creatDate,
            timeHint: true,
            reply: replyMessage?.to.length ? replyMessage : null,
            id: newMessgaesListRef.id,
            uid: loginUid,
            heart: input === '❤️',
            reaction: []
          })

          const memberUids = [loginUid, uid]
          //

          const createDefaultMembers = (currentUser: IUser, memberUser: IUser) => {
            const defaultMembers = {} as StringMap<IMember>
            defaultMembers[currentUser.uid] = { uid: currentUser.uid, username: currentUser.username, avatar: currentUser.avatar }
            defaultMembers[memberUser.uid!] = { uid: memberUser.uid!, username: memberUser.username!, avatar: memberUser.avatar! }
            return defaultMembers
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
            memberInfos: createDefaultMembers(loginUser(), newUser!),
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

  ///Reply

  const [replyMessage, setReplyMessage] = useState<IReplyMessage>()
  const onReply = (id: string, to: string, toId: string, message: string, imageUrl?: string) => {
    setReplyMessage({ id, uid: loginUid, from: myUserName, to, toId, message, image: imageUrl } as IReplyMessage)
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
    chatroomDB.doc(id).update(messageUpdate)
  }

  const sendMessage = (text: string, replyMessage?: IReplyMessage, fileUrl?: string) => {
    const currDateNumber = new Date().getTime()
    console.log('About to send', fileUrl)

    if (isChatroomExist && (text.match(/^(?!\s*$).+/) || fileUrl)) {
      const newMessageRef = chatroomDB.doc(id).collection('messages').doc()
      const isIntervalGreaterThan = (mins: number) => {
        const minute = 1000 * 60
        return (currDateNumber - messages[messages.length - 1]?.date) / minute > mins
      }
      newMessageRef.set({
        username: myUserName,
        message: text,
        date: currDateNumber,
        timeHint: isIntervalGreaterThan(5),
        reply: replyMessage?.to ? replyMessage : null,
        id: newMessageRef.id,
        uid: loginUid,
        heart: text === '❤️',
        reatcion: [] as IReaction[],
        image: fileUrl ? fileUrl : null
      })
      updateLatest(text, currDateNumber, newMessageRef.id!)
    } else {
      creatDM(newUser?.uid!, text)
    }
  }

  const isTop = () => {
    const elmnt = document.getElementById(`message_${messages[0]?.id}`)
    const mesTop = document.getElementById('messagesList')

    if (elmnt && mesTop && elmnt.getBoundingClientRect().y > mesTop.getBoundingClientRect().top) return true
  }

  const handleScroll = (e: any) => {
    if (isTop() && !loadingTop) {
      setLoadingTop(isTop()!)
    }
  }

  const isTyping = (action: boolean) => {
    // console.log('id', id, 'isChatroomExist', isChatroomExist)
    if (isChatroomExist) {
      var typingUpdate: any = {}
      typingUpdate[`isTyping.${loginUid}`] = action
      chatroomDB.doc(id).update(typingUpdate)
    }
  }

  const showTyping = () =>
    Object.keys(typingRef!)
      .filter((uid) => uid !== loginUid)
      .map((ele) => typingRef![ele])
      .reduce((accu, curr) => accu || curr, false)

  // DropFiles
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles)
    setFiles(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    )

    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({ noClick: true, accept: 'image/*', onDrop })

  //Upload Image
  const sendWithImage = (file: File, inputValue: string, replyMessage?: IReplyMessage) => {
    // Create the file metadata

    var metadata = {
      contentType: file.type
    }

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = imagesRef.child(`${id}/${file.name}`).put(file, metadata)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused')
            break
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running')
            break
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break
          case 'storage/canceled':
            // User canceled the upload
            break

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
          sendMessage(inputValue, replyMessage, downloadURL)
        })
      }
    )
  }

  const DMProfile = (uid: string) => {
    return <img className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover" alt="" src={memberRef[uid]?.avatar} />
  }

  const groupProfile = (members: StringMap<IMember>) => {
    const imgArr = Object.values(members)
      .slice(0, 2)
      .map((ele) => ele.avatar)

    return (
      <div className="h-8 w-8 sm:h-12 sm:w-12 flex flex-col justify-center">
        <img className="object-cover h-6 w-6 sm:h-8 sm:w-8 ml-4 sm:ml-6 rounded-full" alt="" src={imgArr[0]} />
        <img className="object-cover h-6 w-6 sm:h-8 sm:w-8 -mt-4 border-2 border-white rounded-full" alt="" src={imgArr[1]} />
      </div>
    )
  }

  const profileIMG = (isGroup: boolean) => {
    return loaded ? (
      forwardingRoom.id ? (
        isGroup ? (
          groupProfile(memberRef)
        ) : (
          DMProfile(newUser?.uid!)
        )
      ) : (
        <img className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover bg-gray-100" alt="" src={newUser?.avatar} />
      )
    ) : (
      <div className="h-8 w-8 sm:h-12 sm:w-12 flex flex-col justify-center bg-gray-200 rounded-full"></div>
    )
  }

  const beforeLoad = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
      <div>Select a chatroom</div>
    </div>
  )

  const starterTemplate = (
    <div className="flex-grow w-screen sm:w-160 flex flex-col items-center justify-center text-2xl">
      <img className="rounded-full w-32 h-32" alt="" src={newUser?.avatar} />
      <div className="mt-4">{newUser?.username}</div>
      <Link to={`/user/${newUser?.username}`}>
        <div className="mt-6 rounded-xl py-2 px-2  border text-sm font-semibold cursor-pointer">View Profile</div>
      </Link>
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
          isForward={ele.uid === loginUid}
          roomId={id!}
          message={ele}
          myUserName={myUserName}
          onReaction={onReaction}
          setShowImage={setShowImage}
        ></Chatblock>
        {readRef && readRef![ele.id] && (
          <div className=" flex justify-end  items-center select-none">
            {readRef[ele.id].map((uid) => (
              <img key={`readRef_${uid}`} className="w-6 h-6 mx-1 rounded-full" alt="" src={memberRef[uid].avatar}></img>
            ))}
          </div>
        )}
      </Fragment>
    ))

  const messengerComponent = (
    <div className={`flex flex-col flex-grow overflow-hidden  transition-all duration-150 ease-in-out pt-10 sm:pt-0`}>
      <div
        className="flex flex-col flex-grow flex-shrink h-screen px-4 pt-4 overflow-x-hidden overflow-y-scroll"
        id="messagesList"
        onScroll={(e) => handleScroll(e)}
      >
        {messages && messages.length > 0 ? messagesList : messagesLoading}
      </div>
      {typingRef && (
        <div className={`flex items-center px-4 transtion-all duration-200 ease-in-out ${showTyping() ? 'opacity-100 h-14 pt-4 ' : 'opacity-0 h-0'}`}>
          {members
            .filter((mem) => mem.uid !== loginUid)
            .map((ele, index) => {
              return typingRef[ele.uid] ? (
                <div className="relative h-8 w-8 mr-2" key={`typing_${ele.uid}`}>
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
    <ChatroomSettings
      myUserName={myUserName}
      loginUid={loginUid}
      id={id!}
      forwardingRoom={forwardingRoom}
      members={members}
      setDetailed={(value) => setIsDetailed(value)}
    ></ChatroomSettings>
  )

  const chatroomTemplate = (
    <div {...getRootProps({ class: 'overflow-hidden h-screen sm:h-auto  w-screen sm:w-96 md:w-120 lg:w-160 bg-white sm:border flex flex-col' })}>
      {showImage.length > 0 && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 flex items-center justify-center"
          onClick={(event) => {
            event.stopPropagation()
            setShowImage('')
          }}
        >
          <div>
            <img className=" xl:max-w-7xl xl:max-h-320" alt="" src={showImage}></img>
          </div>
        </div>
      )}
      <div className="fixed z-20 sm:static h-12 sm:h-16 bg-white w-full flex  items-center justify-center px-2 sm:px-8 border-b">
        <Link to="/chat/inbox">
          <div className="mx-4 sm:hidden">
            <i className="fas fa-chevron-left "></i>
          </div>
        </Link>
        <div className="h-16 w-60 sm:w-80 md:w-100 lg:w-140 flex flex-col items-start justify-center">
          <div className="w-full flex  items-center text-base sm:text-xl font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
            <div className="mx-3"> {profileIMG(forwardingRoom.group)}</div>

            {isChatroomExist
              ? forwardingRoom.title
                ? forwardingRoom.title
                : members
                    .filter((ele) => ele.uid !== loginUid)
                    .map((ele) => ele.username)
                    .join(', ')
              : newUser.username}
          </div>
        </div>
        <div className="w-full items-center text-sm">{forwardingRoom ? forwardingRoom.intro : 'text'}</div>

        {isChatroomExist && (
          <div
            className="cursor-pointer text-base sm:text-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full h-6 w-6 sm:h-10 sm:w-10 mr-6 sm:mr-0 flex items-center justify-center"
            onClick={() => setIsDetailed(true)}
          >
            <i className="fas fa-ellipsis-v"></i>
          </div>
        )}
      </div>
      <div className="relative flex flex-col flex-grow flex-shrink w-full overflow-hidden">
        {isDragActive && (
          <div className="absolute inset-0 z-30 bg-gray-400 bg-opacity-20 flex justify-center items-center">
            <div className="text-2xl flex items-center justify-center px-3 py-2">Drop files here</div>
          </div>
        )}
        {messengerComponent}

          <InputBar
            files={files}
            setFiles={setFiles}
            members={members}
            replyMessage={replyMessage}
            sendMessage={sendMessage}
            resetReply={resetReply}
            open={open}
            sendWithImage={sendWithImage}
            getInputProps={getInputProps}
            isTyping={isTyping}
          ></InputBar>
      </div>
    </div>
  )

  return isDetailed ? detailedComponent : chatroomTemplate
}

export default Chatroom
