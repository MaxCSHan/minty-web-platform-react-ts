import Message from '../../../../interface/IMessage'
import { useEffect, useState } from 'react'
import IReaction from '../../../../interface/IReaction'
import IEmoji from '../../../../interface/IEmoji'
import { chatroomDB } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'

const emojiList = [
  { emoji: '❤️', name: 'red heart', shortname: ':heart:', unicode: '2764', html: '&#10084;', category: 'Smileys & Emotion (emotion)', order: '1286' },
  {
    emoji: '😂',
    name: 'face with tears of joy',
    shortname: ':joy:',
    unicode: '1f602',
    html: '&#128514;',
    category: 'Smileys & Emotion (face-smiling)',
    order: '3'
  },
  {
    emoji: '😢',
    name: 'crying face',
    shortname: ':cry:',
    unicode: '1f622',
    html: '&#128546;',
    category: 'Smileys & Emotion (face-concerned)',
    order: '54'
  },
  {
    emoji: '😮',
    name: 'face with open mouth',
    shortname: ':open_mouth:',
    unicode: '1f62e',
    html: '&#128558;',
    category: 'Smileys & Emotion (face-concerned)',
    order: '29'
  },
  { emoji: '🔥', name: 'fire', shortname: ':fire:', unicode: '1f525', html: '&#128293;', category: 'Travel & Places (sky & weather)', order: '1753' },
  {
    emoji: '👍',
    name: 'thumbs up',
    shortname: ':thumbsup:',
    unicode: '1f44d',
    html: '&#128077;',
    category: 'People & Body (hand-fingers-closed)',
    order: '1176'
  }
]

type chatBlockProps = {
  previousUid?: string
  previousHasReply?:boolean
  nextUid?: string
  nextHasReply?:boolean
  group: boolean
  memberRef: StringMap<IMember>
  myUserName: string
  message: Message
  roomId: string
  isForward: boolean
  avatar?: string
  onReply: (id: string, to: string, toId: string, message: string) => void
  jumpTo: (uid: string) => void
  onReaction: () => void
}

const Chatblock = ({ previousUid,previousHasReply,nextUid,nextHasReply, group, memberRef, myUserName, message, roomId, isForward, avatar, onReply, onReaction, jumpTo }: chatBlockProps) => {
  const [isHover, setIsHover] = useState(false)
  const [isHoverReaction, setIsHoverReaction] = useState(false)
  const [onClikReaction, setOnClikReaction] = useState(false)
  // const [selectedReaction, setSelectedReaction] = useState<IReaction>()
  const [messageData, setMessageData] = useState(message)

  useEffect(() => {
    setMessageData(message)
  }, [message])

  // useEffect(() => {
  //   const filter = messageData?.reaction?.filter((ele) => ele.from !== myUserName)
  //   if (filter) setSelectedReaction(filter[0])
  // }, [])

  // useEffect(()=>{
  //   ref.on('value', (snapshot) => {
  //     const data = snapshot.val();
  //     console.log("value",data)
  //   })
  // },[messageData])

  const dateController = (ele: Message) => {
    const mesDate = new Date(ele.date)
    // if(mesDate.getUTCDate()!==dateChecker?.getUTCDate()){
    //   setDateChecker(mesDate);
    //   return [mesDate].map(ele => `${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}`)
    // }
    // return "";
    return (
      ele.timeHint &&
      [mesDate].map((ele) => (
        <div
          className={`text-center text-xs text-gray-600 ${messageData.timeHint ? 'my-3' : ''}`}
        >{`${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`}</div>
      ))
    )
  }

  // useEffect(()=>{
  //   if(!isHover) setOnClikReaction(false)
  // },[isHover])

  const onCheckReply = () => {
    jumpTo(messageData.reply!.id)
  }

  const reduceDuplicateEmoji = (accumulator: string[], currentValue: IReaction) => {
    return accumulator.includes(currentValue.emoji.emoji) ? accumulator : [...accumulator, currentValue.emoji.emoji]
  }

  const setEmoji = (emojiToSet: IEmoji) => {
    setOnClikReaction(false);
    const ref = chatroomDB.doc(roomId).collection("messages").doc(message.id);

    onReaction()

    if (messageData && messageData.reaction.length===0) {
      ref.update({"reaction": [{ from: myUserName, emoji: emojiToSet }] })
      return
    }

    const filter = messageData?.reaction?.filter((ele) => !(ele.from === myUserName && ele.emoji.emoji === emojiToSet.emoji))
    // console.log(`Filter : ${filter}`)

    if (filter && filter.length === messageData.reaction.length) {
      const newReaction = [...messageData?.reaction?.filter((ele) => ele.from !== myUserName), { from: myUserName, emoji: emojiToSet }]
      ref.set({ ...messageData, reaction: newReaction })
      // setMessageData({...messageData,reaction:newReaction})
    } else {
      ref.set({ ...messageData, reaction: filter })
      // setMessageData({...messageData,reaction:filter})
    }
  }

  const replyBlock = messageData.reply && (
    <div className={`max-w-xs  flex flex-col -mb-2  ${isForward ? 'items-end ' : 'items-start ml-4'}`} onClick={() => onCheckReply()}>
      <div className="text-sm  whitespace-nowrap">
        {messageData.reply.uid === loginUser().uid ? 'You' : messageData.reply.from} replied to
        <span className="font-semibold"> {messageData.reply.toId === loginUser().uid ? 'You' : messageData.reply.to}</span>
      </div>
      <div className="max-w-3/4  sm:max-w-xs bg-gray-200 rounded-full px-3 py-2 text-sm text-gray-700  whitespace-nowrap overflow-hidden overflow-ellipsis">
        {messageData.reply.message}
      </div>
    </div>
  )

  const block = (
    <div
      className={`transition-all ease-in-out duration-100 ${messageData?.reply?.id ? 'mt-3' : ''} ${
        messageData?.reaction?.length > 0 ? 'mb-7' : 'mb-1'
      }`}
    >
      {/* date */}
      {dateController(messageData)}

      {!message.create?
      <div
        className={`flex w-full  ${isForward ? 'flex-row-reverse' : 'flex-row'}`}
        id={`message_${messageData.id}`}
        key={`message_${messageData.id}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className={`relative  flex items-end ${isForward ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isForward && group &&<div className="h-10 w-10"> { (messageData.uid !== nextUid || nextHasReply) && <img className="h-10 w-10 border rounded-full" alt="" src={avatar!} />}</div>}
          {messageData.heart ? (
            <div className={`flex flex-col mx-4 text-8xl text-red-500  ${isForward ? 'items-end' : 'items-start'}`}>
              {group && !isForward &&  (messageData.uid !== previousUid || previousHasReply) && <div className="text-xs text-gray-600">{memberRef[message.uid].username}</div>}
              <div className="relative">
                <i className=" fas fa-heart"></i>
                {messageData?.reaction?.length > 0 && (
                  <div
                    className="absolute z-20 -bottom-4 right-0 text-xl bg-white border  rounded-full h-8 px-1 flex items-center justify-center cursor-default"
                    onMouseEnter={() => setIsHoverReaction(true)}
                    onMouseLeave={() => setIsHoverReaction(false)}
                  >
                    {messageData?.reaction!.reduce(reduceDuplicateEmoji, [] as string[]).map((ele, index) => (
                      <div className="mx-0.5 flex pt-0.5 items-center justify-center" key={`current_heart_reaction_${index}`}>
                        {ele}
                      </div>
                    ))}
                    <div
                      className={`absolute z-30 bottom-8 flex-col items-end px-2 py-1 bg-white shadow-xl transition ease-in-out ${
                        isHoverReaction ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                    >
                      {messageData?.reaction!.map((ele, index) => (
                        <div className="mx-0.5 whitespace-nowrap text-black" key={`current_heart_reactionlist_${index}`}>
                          {ele.emoji.emoji} <span className=" text-xs">{ele.from}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`flex flex-col  sm:max-w-none 	 ${isForward ? 'items-end' : 'items-start'} `}>
              {group && !isForward && !messageData.reply && (messageData.uid !== previousUid || previousHasReply)  && <div className="text-xs text-gray-600 ml-4">{memberRef[message.uid]?.username}</div>}
              {replyBlock}
              <div className={`z-10 border   ${(messageData.uid !== previousUid || previousHasReply || messageData.reply) ? isForward? "rounded-tr-3xl ":"rounded-tl-3xl":""} ${(messageData.uid !== nextUid || nextHasReply || messageData.reply)? isForward?"rounded-br-3xl":"rounded-bl-3xl":""}  ${isForward ? `rounded-l-3xl rounded-r-lg ` : ` rounded-r-3xl rounded-l-lg`}   bg-white mx-2  flex ${isForward ? 'flex-row-reverse' : 'flex-row'}  `}>
                <div className="relative px-3  py-2 max-w-mini sm:max-w-xs flex   break-all  items-center justify-center">
                  <div className="flex items-center ">{messageData.message}</div>
                  {messageData?.reaction?.length > 0 && (
                    <div
                      className="absolute z-20 -bottom-6 right-2 text-xl bg-white border  rounded-full h-8 px-1 flex items-center justify-center cursor-default"
                      onMouseEnter={() => setIsHoverReaction(true)}
                      onMouseLeave={() => setIsHoverReaction(false)}
                    >
                      {messageData?.reaction!.reduce(reduceDuplicateEmoji, [] as string[]).map((ele, index) => (
                        <div className="mx-0.5 flex pt-0.5 items-center justify-center" key={`current_reaction_${index}`}>
                          {ele}
                        </div>
                      ))}
                      <div
                        className={`absolute z-30 bottom-8 flex-col items-end px-2 py-1 bg-white shadow-xl transition ease-in-out ${
                          isHoverReaction ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                      >
                        {messageData?.reaction!.map((ele, index) => (
                          <div className="mx-0.5 whitespace-nowrap" key={`current_reactionlist_${index}`}>
                            {ele.emoji.emoji} <span className=" text-xs">{ele.from}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {(isHover || onClikReaction) && (
            <div className={`sm:relative mx-2 w-12 sm:w-16 flex justify-between  text-xl sm:text-2xl text-gray-400 ${isForward ? 'flex-row-reverse' : 'flex-row'}`}>
              {onClikReaction && (
                <div
                  className={`${
                    isForward ? '-right-2 sm:-right-8' : '-left-5 sm:-left-12'
                  } absolute -top-10 sm:-top-14  z-50  w-64 h-12 shadow-lg rounded-full bg-white flex items-center justify-around px-2`}
                >
                  {emojiList.map((ele, index) => (
                    <span className="text-3xl cursor-pointer " key={`reaction_selection_${index}`} onMouseDownCapture={() => setEmoji(ele)}>
                      {ele.emoji}
                    </span>
                  ))}
                </div>
              )}
              <button
                className="appearance-none focus:outline-none hover:text-gray-500"
                onClick={() => setOnClikReaction(!onClikReaction)}
                onBlur={() => setOnClikReaction(false)}
              >
                <i className="far fa-smile"></i>
              </button>
              <div
                className="hover:text-gray-500"
                onClick={() => onReply(messageData.id, memberRef[messageData.uid].username, messageData.uid, messageData.message)}
              >
                <i className="fas fa-reply"></i>
              </div>
            </div>
          )}
        </div>
      </div>
    :
    <div className={`text-center text-gray-600 my-3`}>{message.username} has created a new room</div>
    }
    </div>
  )

  return block
}

export default Chatblock
