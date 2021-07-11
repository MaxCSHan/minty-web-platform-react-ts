import Message from "./IMessage"
import StringMap from "./StringMap";
import IMember from "./IMember"
interface IChatroom {
    id:string;
    title?:string;
    roomPhoto?:string;
    members:string[];
    memberInfos:StringMap<IMember>;
    latestMessage:string;
    latestMessageId:string;
    latestActiveDate:number;
    messages:string;
    read?:StringMap<string>;
    isTyping?:StringMap<boolean>;
    loginStatus:boolean;
    group:boolean;
    createdDate:number;
    intro?:string;

  }

  export default IChatroom;