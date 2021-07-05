import Message from "../../../../interface/IMessage";
import { useEffect, useState } from "react";
import IReaction from "../../../../interface/IReaction";
import IEmoji from "../../../../interface/IEmoji";

const emojiList = [
  {"emoji": "❤️", "name": "red heart", "shortname": ":heart:", "unicode": "2764", "html": "&#10084;", "category": "Smileys & Emotion (emotion)", "order": "1286"},
  {"emoji": "😂", "name": "face with tears of joy", "shortname": ":joy:", "unicode": "1f602", "html": "&#128514;", "category": "Smileys & Emotion (face-smiling)", "order": "3"},
  {"emoji": "😢", "name": "crying face", "shortname": ":cry:", "unicode": "1f622", "html": "&#128546;", "category": "Smileys & Emotion (face-concerned)", "order": "54"},
  {"emoji": "😮", "name": "face with open mouth", "shortname": ":open_mouth:", "unicode": "1f62e", "html": "&#128558;", "category": "Smileys & Emotion (face-concerned)", "order": "29"},
  {"emoji": "🔥", "name": "fire", "shortname": ":fire:", "unicode": "1f525", "html": "&#128293;", "category": "Travel & Places (sky & weather)", "order": "1753"},
  {"emoji": "👍", "name": "thumbs up", "shortname": ":thumbsup:", "unicode": "1f44d", "html": "&#128077;", "category": "People & Body (hand-fingers-closed)", "order": "1176"},
];

type chatBlockProps = {
  message: Message;
  index: number;
  isForward: boolean;
  avatar?: string;
  onReply: (id: number, to:string, message: string) => void;
  jumpTo: (id:number) => void
};

const Chatblock = ({
  message,
  index,
  isForward,
  avatar,
  onReply,
  jumpTo
}: chatBlockProps) => {
  const [isHover, setIsHover] = useState(false);
  const [isHoverReaction, setIsHoverReaction] = useState(false);
  const [onClikReaction, setOnClikReaction] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<IReaction>();

  const [messageData, setMessageData] = useState(message);

  useEffect(() => {
    setMessageData(message);
  },[message])

  useEffect(() => {
    const filter = messageData.reaction.filter(ele => ele.from!=="You" )
    if(filter[0]) setSelectedReaction(filter[0]);
  },[])

  const dateController = (ele: Message) => {
    const mesDate = new Date(ele.date);
    // if(mesDate.getUTCDate()!==dateChecker?.getUTCDate()){
    //   setDateChecker(mesDate);
    //   return [mesDate].map(ele => `${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit' })}`)
    // }
    // return "";
    return ele.timeHint
      ? [mesDate].map(
          (ele) =>
            `${ele.toLocaleDateString()}  ${ele.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
        )
      : "";
  };

    // useEffect(()=>{
    //   if(!isHover) setOnClikReaction(false)
    // },[isHover])

  const onCheckReply = () =>
  {
    jumpTo(messageData.reply!.id);
  }

  const reduceDuplicateEmoji = 
  (accumulator:string[],currentValue:IReaction) =>{
   return accumulator.includes(currentValue.emoji.emoji)?accumulator:[...accumulator,currentValue.emoji.emoji];
  }

  const setEmoji = (emojiToSet:IEmoji) =>{
    // console.log(messageData.reaction)
    // console.log(`Id ${messageData.id}: set emoji ${emojiToSet}`)
    const filter = messageData.reaction.filter(ele => ele.from!=="You" || ele.emoji != emojiToSet)
    if(filter.length === messageData.reaction.length)
    {    const newReaction =[...messageData.reaction.filter(ele => ele.from!=="You"),{from:"You",emoji:emojiToSet}]
    setMessageData({...messageData,reaction:newReaction})}
    else{
      setMessageData({...messageData,reaction:filter})
    }

  }
  

  const block = (
    <div className={`${messageData?.reply! && messageData?.reply?.id>0?"mt-14":"mt-2.5"}`}>
      {/* date */}
      <div className={`text-center text-xs text-gray-600 ${messageData.timeHint?"my-3":""}`}>
        {dateController(messageData)}
      </div>

      <div
        className={`flex w-full ${isForward ? "flex-row-reverse" : "flex-row"}`}
        id={`message_${messageData.id}`}
        key={`message_${messageData.id}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={`relative  flex items-center  ${messageData.reply?"mt-12":"my-1"}  ${isForward ? "flex-row-reverse" : "flex-row"}`}
        >
          {!isForward && (
            <img
              className="h-10 w-10 border rounded-full"
              alt=""
              src={avatar!}
            />
          )}
          {messageData.heart?
          <div className={`flex flex-col mx-2 text-8xl text-red-500  ${isForward?"items-end":""}`}>
            <i className="fas fa-heart"></i>
          </div>:
          <div className={`flex flex-col  ${isForward?"items-end":""} `}>
            {messageData.reply && (
              <div className={`absolute -top-14 right-2 max-w-xs  flex flex-col  ${isForward?"items-end":""}`} 
              onClick={()=>onCheckReply()}
              >
                <div className="text-sm  whitespace-nowrap">You replied to <span className="font-semibold">{messageData.reply.to}</span></div>
                <div className="bg-gray-200 rounded-3xl px-4 py-3 text-xs max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {messageData.reply.message}
                </div>
              </div>
            )}
            <div className={`z-10 border rounded-3xl bg-white mx-2 flex ${isForward?"flex-row-reverse" :""}  `}>
              <div className="relative px-4 py-3 max-w-xs flex flex-wrap break-all  items-center justify-around ">
                {messageData.message}
                {messageData?.reaction?.length>0 && 
                <div className="absolute z-20 -bottom-4 right-4 text-xl bg-white border  rounded-full h-8 px-0.5 flex items-center justify-center cursor-default"
                onMouseEnter={() => setIsHoverReaction(true)}
                onMouseLeave={() => setIsHoverReaction(false)}
                >
                   { messageData?.reaction!.reduce(reduceDuplicateEmoji,[] as string[]).map(ele => <div className="mx-0.5 flex pt-0.5 items-center justify-center">{ele}</div>)}
                   <div className={`absolute z-30 bottom-8 flex-col items-end px-2 py-1 bg-white shadow-xl transition ease-in-out ${isHoverReaction?"opacity-100 visible":"opacity-0 invisible"}`}>
                   { messageData?.reaction!.map(ele => <div className="mx-0.5 whitespace-nowrap">{ele.emoji.emoji} <span className=" text-xs">{ele.from}</span></div>)}
                   </div>
                   </div>}
              </div>
            </div>
          </div>}
          {(isHover || onClikReaction) && (
            <div
              className={`relative mx-2 w-16 flex justify-between text-2xl text-gray-400 ${
                isForward ? "flex-row-reverse" : ""
              }`}
            >
              {onClikReaction && <div className={`${isForward ? "-right-8" : "-left-12"} absolute -top-14  z-50  w-64 h-12 shadow-lg rounded-full bg-white flex items-center justify-around px-2`}>
                  {emojiList.map(ele => <span className="text-3xl cursor-pointer" onMouseDownCapture={()=>setEmoji(ele)} >{ele.emoji}</span>)}
                </div>}
              <button className="appearance-none focus:outline-none hover:text-gray-500"
              onClick={()=>setOnClikReaction(!onClikReaction)}
              onBlur={()=>setOnClikReaction(false)}
              >
                <i className="far fa-smile"></i>
              </button>
              <div
                className="hover:text-gray-500"
                onClick={() =>
                  onReply( messageData.id,messageData.username, messageData.message)
                }
              >
                <i className="fas fa-reply"></i>
              </div>
            </div>
          )}          
        </div>
      </div>
    </div>
  );

  return block;
};

export default Chatblock;
