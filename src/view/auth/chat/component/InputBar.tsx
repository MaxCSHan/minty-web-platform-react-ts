import { useRef, useState } from 'react'
import { MentionsInput, Mention } from 'react-mentions'

//Interface
import IMember from '../../../../interface/IMember'
import IReplyMessage from '../../../../interface/IReplyMessage'


import GifSearchbar from "./GifSearchbar"

type InputBarProps = {
  isGroup: boolean
  files: any
  members: IMember[]
  replyMessage?: IReplyMessage
  sendMessage: ({
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
  }) => void
  resetReply: () => void
  open: () => void
  sendWithGif: ({ url, inputValue, replyMessage }: { url: string; inputValue: string; replyMessage?: IReplyMessage }) => void
  sendWithImage: ({
    file,
    inputValue,
    replyMessage,
    mention
  }: {
    file: File
    inputValue: string
    replyMessage?: IReplyMessage
    mention?: string[]
  }) => void
  getInputProps: any
  isTyping: (typing: boolean) => void
  setFiles: (arr: any) => void
}

const InputBar = ({
  isGroup,
  files,
  setFiles,
  members,
  replyMessage,
  resetReply,
  sendMessage,
  open,
  sendWithGif,
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
  const [mentionList, setMentionList] = useState<string[]>([])
  const [showGif, setShowGif] = useState(false)
  const [gifList, setGifList] = useState<string[]>([])


  const mentionRecommendation = () =>
    members.filter((member) => member.username.includes(inputTags)).map((ele) => ({ ...ele, id: ele.uid, display: ele.username }))

  const handleInput = (e: any) => {
    const value = e.target.value
    if (value.slice(-1) === ' ') {
      setIsShowTags(-1)
      setInputTags('')
    }
    if (isGroup) {
      if (isShowTags) setInputTags(value.slice(isShowTags))
      if (value.slice(-1) === '@' && (inputValue.slice(-1) === ' ' || inputValue === '')) {
        setIsShowTags(inputValue.length + 1)
        setInputTags('')
      }
    }

    setInputValue(value)
  }

  const sendHeart = () => sendMessage({ text: '❤️' })
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleSend = () => {
    if (files.length > 0) sendWithImage({ file: files[0], inputValue: inputValue, replyMessage: replyMessage, mention: mentionList })
    else sendMessage({ text: inputValue, replyMessage, mention: mentionList })
    setMentionList([])
    setInputValue('')
    resetReply()
    setFiles([])
  }
  const handleTouchSend = () => {
    handleSend()
    inputRef!.current?.focus()
  }


  const sendGIf = (url: string) => {
    sendWithGif({ url, inputValue, replyMessage })
    setShowGif(false)
  }

  const tagComponent = (
    <div className="absolute z-30 bottom-10 min-h-full bg-gray-200 overflow-y-scroll scrollbar-hide  flex flex-col shadow-xl">
      {mentionRecommendation().map((member, index) => (
        <div
          className={`${index === mentionedUser ? 'bg-gray-100' : 'bg-white'} px-2 flex items-center justify-start cursor-default bg-white  h-10`}
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
    <div
      className={`${
        replyMessage?.to.length! > 0 ? (showGif ? 'h-72' : 'h-34') : showGif ? 'h-60' : files.length > 0 ? 'h-36' : 'h-14'
      }   py-2 flex flex-col items-center px-4`}
    >
      {showGif && <GifSearchbar sendGIf={sendGIf} setShowGif={setShowGif}></GifSearchbar>}
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
            <MentionsInput
              className={`mentions ${isFocusingInput ? 'select-text' : 'select-none'}`}
              value={inputValue}
              singleLine={true}
              placeholder="Message..."
              inputRef={inputRef}
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => handleKeyPress(e)}
              onFocus={() => {
                setIsFocusingInput(true)
                isTyping(true)
              }}
              onBlur={() => {
                setIsFocusingInput(false)
                isTyping(false)
              }}
            >
              <Mention
                trigger="@"
                style={{
                  backgroundColor: '#daf4fa'
                }}
                data={mentionRecommendation}
                appendSpaceOnAdd={true}
                onAdd={(id) => setMentionList((mentionList) => [...mentionList, id as string])}
              />
            </MentionsInput>

            {/* {isShowTags >= 0 && tagComponent} */}
          </div>
          <div>
            <button className="focus:outline-none" onClick={() => setShowGif(true)
}>
              GIF
            </button>
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
