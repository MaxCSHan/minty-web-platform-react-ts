import IReplyMessage from "./IReplyMessage"
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
  }

  export default Message;