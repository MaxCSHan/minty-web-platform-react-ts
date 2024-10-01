import Message from 'interface/IMessage'
import { loginUser } from 'services/authService'
import { textParser } from 'utilities/chat/chatBlock'

type ReplyBlockProps = { message: Message; isForward: boolean; onCheckReply: () => void }

const ReplyBlock = ({ message, isForward, onCheckReply }: ReplyBlockProps) => {
  if (!message.reply) return null
  return (
    <div className={`max-w-xs  flex flex-col -mb-2  ${isForward ? 'items-end ' : 'items-start ml-4'}`} onClick={() => onCheckReply()}>
      <div className="text-sm  whitespace-nowrap  select-none">
        {message.reply.uid === loginUser().uid ? 'You' : message.reply.from} replied to
        <span className="font-semibold"> {message.reply.toId === loginUser().uid ? 'You' : message.reply.to}</span>
      </div>
      <div className="max-w-3/4  sm:max-w-xs bg-gray-200 rounded-3xl px-3 py-2 text-sm text-gray-700  whitespace-nowrap overflow-hidden overflow-ellipsis">
        {message.reply?.image ? (
          <img className="w-10 h-10 rounded object-cover" alt="" src={message.reply?.image}></img>
        ) : (
          textParser(message.reply.message)
        )}
      </div>
    </div>
  )
}

export default ReplyBlock
