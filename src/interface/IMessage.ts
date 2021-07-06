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
    id:string;
    uid:string;
    heart?:boolean;
    reaction:IReaction[]
  }

  export default Message;