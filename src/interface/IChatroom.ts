import Message from "./IMessage"
interface Chatroom {
    title:string;
    roomPhoto:string;
    members:string[];
    latestMessage:string;
    lastActiveDate:Date;
    messages:Message[];
    read:boolean;
  }

  export default Chatroom;