import Message from 'interface/IMessage'
import { Subject } from 'rxjs'
import { reduceDuplicateEmoji } from 'utilities/chat/chatBlock'

type HeartProps = {
  message: Message
  isHoverReaction: boolean
  setIsHoverReaction: (value: boolean) => void
  isForward: boolean
  group: boolean
  previousUid?: string
  previousHasReply?: boolean
  clickEvent$: Subject<unknown>
}

const Heart = ({ message, isHoverReaction, setIsHoverReaction, isForward, group, previousUid, previousHasReply, clickEvent$ }: HeartProps) => {
  return (
    <div className={`flex flex-col mx-4 text-8xl text-red-500  ${isForward ? 'items-end' : 'items-start'}`} onClick={(e) => clickEvent$.next(e)}>
      {group && !isForward && (message.uid !== previousUid || previousHasReply) && <div className="text-xs text-gray-600">{message.username}</div>}
      <div className="relative">
        <i className=" fas fa-heart"></i>
        {message?.reaction?.length > 0 && (
          <div
            className="absolute z-10 -bottom-4 right-0 text-xl bg-white border  rounded-full h-8 px-1 flex items-center justify-center cursor-default"
            onMouseEnter={() => setIsHoverReaction(true)}
            onMouseLeave={() => setIsHoverReaction(false)}
          >
            {message?.reaction!.reduce(reduceDuplicateEmoji, [] as string[]).map((ele, index) => (
              <div className="mx-0.5 flex pt-0.5 items-center justify-center" key={`current_heart_reaction_${index}`}>
                {ele}
              </div>
            ))}
            <div
              className={`absolute z-30 bottom-8 flex-col items-end px-2 py-1 bg-white shadow-xl transition ease-in-out ${
                isHoverReaction ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              {message?.reaction!.map((ele, index) => (
                <div className="mx-0.5 whitespace-nowrap text-black" key={`current_heart_reactionlist_${index}`}>
                  {ele.emoji.emoji} <span className=" text-xs">{ele.from}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Heart
