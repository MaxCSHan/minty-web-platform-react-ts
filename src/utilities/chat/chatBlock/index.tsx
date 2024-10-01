import Message from 'interface/IMessage'
import IReaction from 'interface/IReaction'
import { Link } from 'react-router-dom'
import reactStringReplace from 'react-string-replace'

type DateControllerProps = {
  message: Message
}
const DateController = ({ message }: DateControllerProps) => {
  const messageDate = new Date(message.date)
  // if(mesDate.getUTCDate()!==dateChecker?.getUTCDate()){
  //   setDateChecker(mesDate);
  //   return [mesDate].map(ele => `${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}`)
  // }
  // return "";

  if (!message.timeHint) return null
  return (
    <div
      className={`text-center text-xs text-gray-600 ${message.timeHint ? 'my-3' : ''}`}
    >{`${messageDate.toLocaleDateString()}  ${messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`}</div>
  )
}

const textParser = (message: string) => {
  return reactStringReplace(message, /(@\[[^\]]+\]\([A-Za-z0-9]*\))/g, (match) => {
    const res = match.match(/@\[(.+)\]\(([A-Za-z0-9]*)\)/)
    const display = res![1]
    const uid = res![2]

    return (
      <Link to={`/User/${uid}`}>
        <span className="text-blue-400 cursor-pointer hover:underline">{display}</span>
      </Link>
    )
  })
}

const reduceDuplicateEmoji = (accumulator: string[], currentValue: IReaction) => {
  return accumulator.includes(currentValue.emoji.emoji) ? accumulator : [...accumulator, currentValue.emoji.emoji]
}

export { DateController, textParser, reduceDuplicateEmoji }
