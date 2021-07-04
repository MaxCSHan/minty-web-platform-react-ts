import Message from "./IMessage"
interface IChatroom {
    id:string;
    title:string;
    roomPhoto:string;
    members:any[];
    latestMessage:string;
    lastActiveDate:Date;
    messages:Message[];
    read:boolean;
    loginStatus:boolean;
    group:boolean;
    createdDate:string;
  }

  export default IChatroom;