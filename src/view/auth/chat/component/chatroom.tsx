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
import { LoadingDots } from 'component/common/loading'
import Dropzone from './dropzone'
import { DMProfile, GroupProfile, RoomProfile } from './profile'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<any>([])
  const [showImage, setShowImage] = useState('')
  const [loadingTop, setLoadingTop] = useState(false)
  const [justLoadedTop, setJustLoadedTop] = useState(false)

  const [lastVisible, setLastVisible] = useState<firebase.firestore.DocumentData>()
  const [currentVisible, setCurrentVisible] = useState<firebase.firestore.DocumentData>()
  const [loadMessageLength, setLoadMessageLength] = useState(100)
  const [messageTop, setMessageTop] = useState(false)

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

    // chatroomDB

    const chatRoomListener = chatroomDB.doc(id).onSnapshot((doc) => {
      const isExist = doc.exists
      console.log(isExist)
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
      } else if (!id?.includes(loginUid)) history.push('/chat/inbox')
      else setIsloaded(true)
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
      setLoadingTop(false)
      setIsloaded(false)
    }
  }, [id])

  useEffect(() => {
    let messageListener: () => void
    if (isChatroomExist && loaded) {
      messageListener = chatroomDB
        .doc(id)
        .collection('messages')
        .orderBy('date', 'desc')
        .limit(loadMessageLength)
        .onSnapshot((snap) => {
          if (loadingTop) setStay(true)

          if (snap) {
            const mesarr = [] as Message[]
            snap.forEach((mes) => {
              mesarr.unshift(mes.data() as Message)
            })

            if (mesarr.length < loadMessageLength) setMessageTop(true)
            setCurrentVisible(lastVisible)
            setLastVisible(snap.docs[snap.docs.length - 1])
            setMes(mesarr)
            setLoadingTop(false)
          }
        })
    } else setIsloaded(true)
    return () => {
      if (isChatroomExist && loaded) messageListener()
    }
  }, [id, isChatroomExist, loaded, loadMessageLength])

  useEffect(() => {
    if (messages.length > 0) {
      const readSetter = chatroomDB.doc(id)
      var usersUpdate: any = {}
      usersUpdate[`read.${loginUid}`] = messages[messages.length - 1].id
      if (justLoadedTop) scrollTo((currentVisible!.data() as Message).id)
      else if (messages?.length > 0 && !stay) scrollToBottom()
      setStay(false)
      setJustLoadedTop(false)
      if (messages?.length > 0) readSetter.update(usersUpdate)
    }
  }, [id, loginUid, messages])

  useEffect(() => {
    if (loadingTop && lastVisible) {
      const loadLength = loadMessageLength + 25
      setJustLoadedTop(true)
      setLoadMessageLength(loadLength)
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

  const sendMessage = ({
    text,
    replyMessage,
    fileUrl,
    mention,
    notification
  }: {
    text: string
    replyMessage?: IReplyMessage
    fileUrl?: string
    mention?: string[]
    notification?: string
  }) => {
    const currDateNumber = new Date().getTime()
    // console.log('About to send', fileUrl)

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
        image: fileUrl ? fileUrl : null,
        mention: mention && mention.length > 0 ? mention : null
      })

      const latestText = notification
        ? notification
        : mention && mention.length > 0
        ? text.replaceAll(/(@\[[^\]]+\]\([A-Za-z0-9]*\))/g, (match) => '@' + match.match(/@\[(.+)\]/)![1])
        : text
      updateLatest(latestText, currDateNumber, newMessageRef.id!)
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
    if (!messageTop) {
      if (isTop() && !loadingTop) {
        setLoadingTop(isTop()!)
      }
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
    // console.log(acceptedFiles)
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

  //
  const sendWithGif = ({ url, inputValue, replyMessage }: { url: string; inputValue: string; replyMessage?: IReplyMessage }) => {
    sendMessage({ text: inputValue, replyMessage, fileUrl: url, notification: `${myUserName} sent a GIF` })
  }

  //Upload Image
  const sendWithImage = ({
    file,
    inputValue,
    replyMessage,
    mention
  }: {
    file: File
    inputValue: string
    replyMessage?: IReplyMessage
    mention?: string[]
  }) => {
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
          sendMessage({ text: inputValue, replyMessage, fileUrl: downloadURL, mention: mention })
        })
      }
    )
  }

  const beforeLoad = (
    <div className="flex-grow w-screen sm:w-160 bg-white  border flex flex-col items-center justify-center text-2xl">
      <div>Select a chatroom</div>
    </div>
  )

  const starterTemplate = () => {
    if (isChatroomExist || !loaded) return null

    return (
      <div className="flex-grow w-screen sm:w-160 flex flex-col items-center justify-center text-2xl">
        <Link to={`/user/${newUser?.uid}`}>
          <img className="rounded-full w-32 h-32" alt="" src={newUser?.avatar} />
        </Link>

        <div className="mt-4">{newUser?.username}</div>
        <Link to={`/user/${newUser?.uid}`}>
          <div className="mt-6 rounded-xl py-2 px-2  border text-sm font-semibold cursor-pointer">View Profile</div>
        </Link>
      </div>
    )
  }

  const messagesLoading = (
    <div>
      {starterTemplate()}
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

  const messagesList = () => {
    if (!messages || messages.length === 0) return messagesLoading
    return (
      <>
        {messages?.map((ele: Message, index) => (
          <>
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
          </>
        ))}
      </>
    )
  }

  const messengerComponent = (
    <div className={`flex flex-col flex-grow overflow-hidden  transition-all duration-150 ease-in-out pt-10 sm:pt-0`}>
      <div
        className="flex flex-col flex-grow flex-shrink h-screen px-4 pt-4 overflow-x-hidden overflow-y-scroll"
        id="messagesList"
        onScroll={(e) => handleScroll(e)}
      >
        <LoadingDots isShow={loadingTop && lastVisible !== undefined} />
        {messagesList()}
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

  const chatroomTemplate = (
    <div className="h-screen relative sm:h-auto  w-screen sm:w-96 md:w-120 lg:w-160 bg-white sm:border flex flex-col">
      {isDetailed && (
        <div className="absolute z-40 h-full">
          <ChatroomSettings
            myUserName={myUserName}
            loginUid={loginUid}
            id={id!}
            forwardingRoom={forwardingRoom}
            members={members}
            setDetailed={(value) => setIsDetailed(value)}
          ></ChatroomSettings>
        </div>
      )}
      <div {...getRootProps({ class: 'overflow-hidden h-screen sm:h-auto  w-screen sm:w-96 md:w-120 lg:w-160 bg-white  flex flex-col' })}>
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
              <div className="mx-3">
                <RoomProfile
                  loaded={loaded}
                  isRoomExist={forwardingRoom.id !== undefined}
                  isGroup={forwardingRoom.group}
                  memberRef={memberRef}
                  newUser={newUser}
                />
              </div>

              {isChatroomExist
                ? forwardingRoom.title
                  ? forwardingRoom.title
                  : members
                      .filter((ele) => ele.uid !== loginUid)
                      .map((ele) => ele.username)
                      .join(', ')
                : newUser && newUser.username}
            </div>
          </div>
          <div className="w-full items-center text-sm">{forwardingRoom ? forwardingRoom.intro : 'text'}</div>

          {isChatroomExist && (
            <div
              className=" flex-shrink-0 cursor-pointer text-base sm:text-lg border text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full h-6 w-6 sm:h-10 sm:w-10 mr-6 sm:mr-0 flex items-center justify-center"
              onClick={() => setIsDetailed(true)}
            >
              <i className="fas fa-ellipsis-v"></i>
            </div>
          )}
        </div>
        <div className="relative flex flex-col flex-grow flex-shrink w-full overflow-hidden">
          <Dropzone isDragActive={isDragActive} />
          {messengerComponent}
          <InputBar
            isGroup={forwardingRoom?.group || false}
            files={files}
            setFiles={setFiles}
            members={members}
            replyMessage={replyMessage}
            sendMessage={sendMessage}
            resetReply={resetReply}
            open={open}
            sendWithGif={sendWithGif}
            sendWithImage={sendWithImage}
            getInputProps={getInputProps}
            isTyping={isTyping}
          ></InputBar>
        </div>
      </div>
    </div>
  )

  return chatroomTemplate
}

export default Chatroom
