interface ReplyMessage {
    id:string;
    uid:string;
    from: string;
    to:string;
    toId:string;
    message: string;
    image?:string;
  }

  export default ReplyMessage;