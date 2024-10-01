import Message from 'interface/IMessage'
import { useState } from 'react'

type ImageBlockProps = {
  message: Message
  setShowImage: (imgUrl: string) => void
  onClikReaction: boolean
}
const ImageBlock = ({ message, setShowImage, onClikReaction }: ImageBlockProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!message.image) return null
  return (
    <div className="rounded-3xl overflow-hidden">
      <img
        className={` bg-gray-200 cursor-pointer  select-none ${!imageLoaded && 'h-36 w-40 animate-pulse'} ${
          message.message.length > 0 && 'rounded-2xl'
        }`}
        onClick={() => {
          if (!onClikReaction) setShowImage(message.image!)
        }}
        onLoad={() => setImageLoaded(true)}
        alt=""
        src={message.image}
      ></img>
    </div>
  )
}

export default ImageBlock
