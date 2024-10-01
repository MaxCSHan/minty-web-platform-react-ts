import Message from '../../../../interface/IMessage'
import { useEffect, useState, Fragment } from 'react'
import IReaction from '../../../../interface/IReaction'
import IEmoji from '../../../../interface/IEmoji'
import { chatroomDB } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'
import { Subject, of } from 'rxjs'
import { map, bufferCount, filter, tap, mergeMap, delay, takeUntil } from 'rxjs/operators'
import { useMediaQuery } from 'react-responsive'
import { emojiList } from '../../../../constant/development'
import { DateController, textParser } from 'utilities/chat/chatBlock'
import Heart from './block/heart'
import ReplyBlock from './block/reply'
import ImageBlock from './block/image'

type chatBlockProps = {
  previousUid?: string
  previousHasReply?: boolean
  nextUid?: string
  nextHasReply?: boolean
  group: boolean
  memberRef: StringMap<IMember>
  myUserName: string
  message: Message
  roomId: string
  isForward: boolean
  avatar?: string
  onReply: (id: string, to: string, toId: string, message: string, imageUrl?: string) => void
  jumpTo: (uid: string) => void
  onReaction: () => void
  setShowImage: (imgUrl: string) => void
}

const Chatblock = ({
  previousUid,
  previousHasReply,
  nextUid,
  nextHasReply,
  group,
  memberRef,
  myUserName,
  message,
  roomId,
  isForward,
  avatar,
  onReply,
  onReaction,
  jumpTo,
  setShowImage
}: chatBlockProps) => {
  const [isHover, setIsHover] = useState(false)
  const [isHoverReaction, setIsHoverReaction] = useState(false)
  const [onClikReaction, setOnClikReaction] = useState(false)

  const isMobile = useMediaQuery({ query: '(min-device-width: 640px)' })

  const onCheckReply = () => {
    jumpTo(message.reply!.id)
  }

  const reduceDuplicateEmoji = (accumulator: string[], currentValue: IReaction) => {
    return accumulator.includes(currentValue.emoji.emoji) ? accumulator : [...accumulator, currentValue.emoji.emoji]
  }

  const setEmoji = (emojiToSet: IEmoji) => {
    setOnClikReaction(false)
    const ref = chatroomDB.doc(roomId).collection('messages').doc(message.id)
    onReaction()

    if (message && (message.reaction === undefined || message.reaction.length === 0)) {
      ref.update({ reaction: [{ from: myUserName, emoji: emojiToSet }] })
      return
    }

    const filter = message?.reaction?.filter((ele) => !(ele.from === myUserName && ele.emoji.emoji === emojiToSet.emoji))

    if (filter && filter.length === message.reaction.length) {
      const newReaction = [...message?.reaction?.filter((ele) => ele.from !== myUserName), { from: myUserName, emoji: emojiToSet }]
      ref.set({ ...message, reaction: newReaction })
      // setMessageData({...messageData,reaction:newReaction})
    } else {
      ref.set({ ...message, reaction: filter })
      // setMessageData({...messageData,reaction:filter})
    }
  }

  const clickEvent$ = new Subject()
  const mouseDown$ = new Subject()
  const mouseUp$ = new Subject()

  const clickCount = 2
  const clickTimespan = 1000
  // const messsageBlock = document.getElementById(`messageBlock_${message.id}`)
  // console.log('messsageBlock', messsageBlock)
  const doubleClick$ = clickEvent$.pipe(
    map(() => new Date().getTime()),
    // Emit the last `clickCount` timestamps.
    bufferCount(clickCount, 1),
    // `timestamps` is an array the length of `clickCount` containing the last added `timestamps`.
    filter((timestamps) => {
      // `timestamps[0]` contains the timestamp `clickCount` clicks ago.
      // Check if `timestamp[0]` was within the `clickTimespan`.
      return timestamps[0] > new Date().getTime() - clickTimespan
    })
  )

  const longPress$ = mouseDown$.pipe(
    mergeMap((e) => {
      return of(e).pipe(delay(500), takeUntil(mouseUp$))
    }),
    tap(() => console.log('longpress'))
  )

  useEffect(() => {
    const listener = doubleClick$.subscribe((ele) => setEmoji(emojiList[0]))

    const longPressSubscriber = longPress$.subscribe((ele) => setOnClikReaction(true))

    return () => {
      listener.unsubscribe()
      longPressSubscriber.unsubscribe()
    }
  })

  const textBlock = (
    <div
      className={`flex w-full  ${isForward ? 'flex-row-reverse' : 'flex-row'}`}
      id={`message_${message.id}`}
      key={`message_${message.id}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={`relative  flex items-end ${isForward ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isForward && group && (
          <div className="h-10 w-10">
            {(message.uid !== nextUid || nextHasReply) && <img className="h-10 w-10 bg-gray-200 border rounded-full" alt="" src={avatar!} />}
          </div>
        )}
        {message.heart ? (
          <Heart
            message={message}
            isHoverReaction={isHoverReaction}
            setIsHoverReaction={setIsHoverReaction}
            isForward={isForward}
            group={group}
            previousUid={previousUid}
            previousHasReply={previousHasReply}
            clickEvent$={clickEvent$}
          />
        ) : (
          <div
            className={`flex flex-col  sm:max-w-none 	 ${isForward ? 'items-end' : 'items-start'} `}
            onClick={(e) => clickEvent$.next(e)}
            onTouchStart={(e) => mouseDown$.next(e)}
            onTouchEnd={(e) => mouseUp$.next(e)}
          >
            {group && !isForward && !message.reply && (message.uid !== previousUid || previousHasReply) && (
              <div className="text-xs text-gray-600 ml-4">{memberRef[message.uid]?.username || 'User Not Found'}</div>
            )}
            <ReplyBlock message={message} isForward={isForward} onCheckReply={onCheckReply} />
            <div
              id={`messageBlock_${message.id}`}
              className={`z-10 border  ${
                message.uid !== previousUid || previousHasReply || message.reply ? (isForward ? 'rounded-tr-3xl ' : 'rounded-tl-3xl') : ''
              } ${message.uid !== nextUid || nextHasReply || message.reply ? (isForward ? 'rounded-br-3xl' : 'rounded-bl-3xl') : ''}  ${
                isForward ? `rounded-l-3xl rounded-r-lg ` : ` rounded-r-3xl rounded-l-lg`
              }  ${onClikReaction ? 'z-40' : ''}  bg-white mx-2  flex ${isForward ? 'flex-row-reverse' : 'flex-row'}  `}
            >
              <div
                className={`relative ${
                  message.message.length > 0 && 'px-3  py-2'
                } max-w-mini sm:max-w-xs flex   break-all  items-center justify-center`}
              >
                <div className="flex flex-col ">
                  <div className=" flex items-center flex-wrap cursor-default select-none sm:select-auto">{textParser(message.message)}</div>
                  <ImageBlock message={message} setShowImage={setShowImage} onClikReaction={onClikReaction} />
                </div>

                {message?.reaction?.length > 0 && (
                  <div
                    className="absolute z-20 -bottom-6 right-2 text-xl bg-white border  rounded-full h-8 px-1 flex items-center justify-center cursor-default"
                    onMouseEnter={() => setIsHoverReaction(true)}
                    onMouseLeave={() => setIsHoverReaction(false)}
                  >
                    {message?.reaction!.reduce(reduceDuplicateEmoji, [] as string[]).map((ele, index) => (
                      <div className="mx-0.5 flex pt-0.5 items-center justify-center" key={`current_reaction_${index}`}>
                        {ele}
                      </div>
                    ))}
                    <div
                      className={`absolute z-30 bottom-8 flex-col items-end px-2 py-1 bg-white shadow-xl transition ease-in-out ${
                        isHoverReaction ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                    >
                      {message?.reaction!.map((ele, index) => (
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
          <div
            className={`sm:relative mx-2 w-12 sm:w-16 flex justify-between  text-xl sm:text-2xl text-gray-400 ${
              isForward ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {onClikReaction && (
              <Fragment>
                <div
                  className={`${
                    isForward ? '-right-2 sm:-right-8' : '-left-5 sm:-left-12'
                  } absolute -top-10 sm:-top-14  z-50  w-64 h-12 shadow-lg rounded-full bg-white flex items-center justify-around px-2 transition-all duration-300 ease-in-out  ${
                    onClikReaction ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {emojiList.map((ele, index) => (
                    <span
                      className="text-3xl cursor-pointer hover:text-3xl  select-none"
                      key={`reaction_selection_${index}`}
                      onMouseDownCapture={() => setEmoji(ele)}
                    >
                      {ele.emoji}
                    </span>
                  ))}
                </div>
              </Fragment>
            )}
            <button
              className=" appearance-none focus:outline-none hover:text-gray-500"
              onClick={() => setOnClikReaction(!onClikReaction)}
              onBlur={() => setOnClikReaction(false)}
            >
              <i className="far fa-smile"></i>
            </button>
            <div
              className="hover:text-gray-500"
              onClick={() => onReply(message.id, memberRef[message.uid].username, message.uid, message.message, message.image)}
            >
              <i className="fas fa-reply"></i>
            </div>

            <div
              className={`fixed sm:static z-40 sm:hidden inset-0  transition-all duration-200 ease-in-out flex flex-col ${
                onClikReaction ? 'visible' : 'invisible'
              }`}
            >
              <div
                className={`flex-grow bg-gray-200 ${onClikReaction ? 'bg-opacity-30 visible' : 'bg-opacity-0 invisible'}`}
                onTouchStart={() => setOnClikReaction(false)}
              ></div>
              <div
                className={`flex h-16 w-full z-30 justify-around items-center bg-white text-black transition-all duration-200 ease-in-out text-xl font-semibold select-none ${
                  onClikReaction ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <div
                  onTouchStart={() => {
                    setOnClikReaction(false)
                    navigator.clipboard.writeText(message.message)
                  }}
                >
                  Copy
                </div>
                <div
                  onTouchStart={() => {
                    setOnClikReaction(false)
                    onReply(message.id, memberRef[message.uid].username, message.uid, message.message, message.image)
                  }}
                >
                  Reply
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const messageContent = () => {
    if (message.create) return <div className={`text-center text-gray-600 my-3`}>{message.username} has created a new room</div>
    if (message.notification)
      return (
        <div className={`text-center text-gray-600 my-3`}>
          {message.username} {message.notification}
        </div>
      )
    return textBlock
  }

  return (
    <div
      className={` select-none sm:select-auto transition-all ease-in-out duration-100 ${message?.reply?.id ? 'mt-3' : ''} ${
        message?.reaction?.length > 0 ? 'mb-7' : 'mb-1'
      }`}
    >
      <DateController message={message} />
      {messageContent()}
    </div>
  )
}

export default Chatblock
