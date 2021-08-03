import IReplyMessage from "./IReplyMessage"
import IReaction from "./IReaction"
import IMember from "./IMember"
import StringMap from "./StringMap";
/**
 username:string;
 message:string;
 date:number;
 timeHint:boolean;
 */
interface Message {
    id:string;
    username:string;
    uid:string;
    message:string;
    date:number;
    timeHint:boolean;
    reply?:IReplyMessage;
    heart?:boolean;
    reaction:IReaction[]
    create?:boolean;
    notification?:string;
    image?:string;
    mention?:string[];
  }

  export default Message;