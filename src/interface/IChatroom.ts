import Message from "./IMessage"
interface IChatroom {
    id:string;
    title:string;
    roomPhoto:string;
    members:any[];
    latestMessage:string;
    latestActiveDate:number;
    messages:Message[];
    read:boolean;
    loginStatus:boolean;
    group:boolean;
    createdDate:string;
  }

  export default IChatroom;