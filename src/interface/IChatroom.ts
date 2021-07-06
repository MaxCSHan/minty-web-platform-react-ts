import Message from "./IMessage"
import StringMap from "./StringMap";
import IMember from "./IMember"
interface IChatroom {
    id:string;
    title:string;
    roomPhoto:string;
    members:StringMap<IMember>;
    latestMessage:string;
    latestActiveDate:number;
    messages:Message[];
    read:boolean;
    loginStatus:boolean;
    group:boolean;
    createdDate:string;
    intro?:string;

  }

  export default IChatroom;