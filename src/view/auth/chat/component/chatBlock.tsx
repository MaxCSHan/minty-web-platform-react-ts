import Message from "../../../../interface/IMessage";
import { useState } from "react";
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

  const onCheckReply = () =>
  {
    jumpTo(message.reply!.id);
  }

  const block = (
    <div className={`${message?.reply! && message?.reply?.id>0?"mt-12":"mt-4"}`}>
      {/* date */}
      <div className="text-center text-xs text-gray-600 mb-4">
        {dateController(message)}
      </div>

      <div
        className={`flex w-full ${isForward ? "flex-row-reverse" : "flex-row"}`}
        id={`message_${message.id}`}
        key={`message_${message.id}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={`relative  flex items-center my-2   ${isForward ? "flex-row-reverse" : "flex-row"}`}
        >
          {!isForward && (
            <img
              className="h-10 w-10 border rounded-full"
              alt=""
              src={avatar!}
            />
          )}
          {message.heart?
          <div className={`flex flex-col mx-2 text-8xl text-red-500  ${isForward?"items-end":""}`}>
            <i className="fas fa-heart"></i>
          </div>:
          <div className={`flex flex-col  ${isForward?"items-end":""}`}>
            {message.reply && (
              <div className={`absolute -top-14 max-w-xs  flex flex-col  ${isForward?"items-end":""}`} 
              onClick={()=>onCheckReply()}
              >
                <div className="text-sm  whitespace-nowrap">You replied to <span className="font-semibold">{message.reply.to}</span></div>
                <div className="bg-gray-200 rounded-3xl px-4 py-4 text-xs max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {message.reply.message}
                </div>
              </div>
            )}
            <div className={`z-10 border rounded-3xl bg-white mx-2 flex ${isForward?"flex-row-reverse" :""}  `}>
              <div className="px-4 py-3 max-w-xs flex flex-wrap break-all  items-center justify-around ">
                {message.message}
              </div>
            </div>
          </div>}
          {isHover && (
            <div
              className={` mx-2 w-16 flex justify-between text-2xl text-gray-400 ${
                isForward ? "flex-row-reverse" : ""
              }`}
            >
              <div className="hover:text-gray-500">
                <i className="far fa-smile"></i>
              </div>
              <div
                className="hover:text-gray-500"
                onClick={() =>
                  onReply( message.id,message.username, message.message)
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
