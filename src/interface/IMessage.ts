import IReplyMessage from "./IReplyMessage"
import IReaction from "./IReaction"
/**
 username:string;
 message:string;
 date:number;
 timeHint:boolean;
 */
interface Message {
    username:string;
    message:string;
    date:number;
    timeHint:boolean;
    reply?:IReplyMessage;
    id:number;
    heart?:boolean;
    reaction:IReaction[]
  }

  export default Message;