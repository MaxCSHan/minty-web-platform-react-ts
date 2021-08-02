import { useRef, useState } from 'react'
import { imagesRef } from '../../../../setup/setupFirebase'

//Interface
import IMember from '../../../../interface/IMember'
import IReplyMessage from '../../../../interface/IReplyMessage'
import IUser from '../../../../interface/IUser'

type InputBarProps = {
  files: any
  members: IMember[]
  replyMessage?: IReplyMessage
  sendMessage: (text: string, replyMessage?: IReplyMessage, fileUrl?: string) => void
  resetReply: () => void
  open: () => void
  sendWithImage: (file: File, inputValue: string, replyMessage?: IReplyMessage) => void
  getInputProps: any
  isTyping: (typing: boolean) => void
  setFiles: (arr: any) => void
}

const InputBar = ({
  files,
  setFiles,
  members,
  replyMessage,
  resetReply,
  sendMessage,
  open,
  sendWithImage,
  isTyping,
  getInputProps
}: InputBarProps) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [showImage, setShowImage] = useState('')
  const [isFocusingInput, setIsFocusingInput] = useState(false)
  const [isShowTags, setIsShowTags] = useState(-1)
  const [inputTags, setInputTags] = useState('')
  const [mentionedUser, setMentionedUser] = useState(0)
  const [mentionList, setMentionList] = useState<IMember[]>([])


  const mentionRecommendation = members.filter((member) => member.username.includes(inputTags))

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.slice(-1) === ' ') {
      setIsShowTags(-1)
      setInputTags('')
    }
    if (isShowTags) setInputTags(value.slice(isShowTags))
    if (value.slice(-1) === '@' && (inputValue.slice(-1) === ' ' || inputValue ==="")) {
      setIsShowTags(inputValue.length + 1)
      setInputTags('')
    }
    setInputValue(value)

    console.log(isShowTags)

    console.log(inputTags)
  }

  const sendHeart = () => sendMessage('❤️')
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isShowTags >= 0) mentioned(mentionRecommendation[mentionedUser])
      else handleSend()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isShowTags >= 0) {
      const limit = mentionRecommendation.length - 1
      if (e.key === 'ArrowUp') setMentionedUser(mentionedUser > 0 ? mentionedUser - 1 : limit)
      if (e.key === 'ArrowDown') setMentionedUser(mentionedUser + 1 > limit ? 0 : mentionedUser + 1)
    }
  }

  const handleSend = () => {
    if (files.length > 0) sendWithImage(files[0], inputValue, replyMessage)
    else sendMessage(inputValue, replyMessage)
    setInputValue('')
    resetReply()
    setFiles([])
  }
  const handleTouchSend = () => {
    handleSend()
    inputRef!.current?.focus()
  }

  const mentioned = (member: IMember) => {
    setMentionList([...mentionList,member])
    setInputValue(inputValue.slice(0,isShowTags) + member.username)
    inputRef!.current?.focus()
    setIsShowTags(-1)
    setInputTags('')
  }

  const tagComponent = (
    <div className="absolute z-30 bottom-10 min-h-full bg-gray-200 overflow-y-scroll scrollbar-hide  flex flex-col shadow-xl">
      {mentionRecommendation.map((member, index) => (
        <div
          className={`${index === mentionedUser ? 'bg-gray-100' : 'bg-white'} px-2 flex items-center justify-start cursor-default bg-whitepx-1 h-10`}
          onClick={() => mentioned(member)}
          onMouseEnter={() => setMentionedUser(index)}
        >
          <img className="w-6 h-6 rounded-full mr-2" alt="profile" src={member.avatar}></img>
          <div>{member.username}</div>
        </div>
      ))}
    </div>
  )
  const thumbs = files.map((file: any) => (
    <div className="mr-2" key={file.name}>
      <div className="relative h-14 w-14 rounded-2xl group">
        <img className="h-14 w-14 rounded-2xl object-cover" alt="" src={file.preview} />
        <div
          className="absolute top-0 right-0 w-4 h-4  items-center justify-center bg-white rounded-full hidden group-hover:flex"
          onClick={() => setFiles([])}
        >
          <span className="material-icons text-xs cursor-pointer">close</span>
        </div>
      </div>
    </div>
  ))

  return (
    <div className={`${replyMessage?.to.length! > 0 ? 'h-34' : files.length > 0 ? 'h-36' : ' h-14'}   py-2 flex flex-col items-center px-4`}>
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
          {replyMessage?.image ? (
            <img className="w-8 h-8 rounded object-cover" alt="" src={replyMessage?.image}></img>
          ) : (
            <div className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">{replyMessage!.message}</div>
          )}
        </div>
      )}
      <div className={` flex flex-col flex-grow w-full ${files.length > 0 ? 'h-28' : ' h-10'} px-4 border rounded-3xl `}>
        <input className="select-none" {...getInputProps()} />
        <div className={`${files.length > 0 ? 'mt-1' : 'invisible'} flex items-center`}>{thumbs}</div>
        {/* <div className="w-10">front</div> */}
        <div className="relative flex  items-center flex-grow">
          <div className="flex-grow">
            <input
              className={`w-full outline-none ${isFocusingInput ? 'select-text' : 'select-none'}`}
              value={inputValue}
              placeholder="Message..."
              ref={inputRef}
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => handleKeyPress(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              onFocus={() => {
                setIsFocusingInput(true)
                isTyping(true)
              }}
              onBlur={() => {
                setIsFocusingInput(false)
                isTyping(false)
              }}
            ></input>
            {isShowTags >= 0 && tagComponent}
          </div>
          <div className="w-8 ml-2 flex items-center justify-center cursor-pointer select-none" onClick={() => open()}>
            <span className="material-icons">insert_photo</span>
          </div>
          {inputValue.length > 0 || files.length > 0 ? (
            <div className="w-8 ml-2  origin-center cursor-pointer select-none" onClick={() => handleTouchSend()}>
              <i className="fas fa-location-arrow fa-rotate-45"></i>
            </div>
          ) : (
            <div className="w-8 ml-2 select-none" onClick={() => sendHeart()}>
              <i className="sm:text-2xl far fa-heart cursor-pointer "></i>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InputBar
