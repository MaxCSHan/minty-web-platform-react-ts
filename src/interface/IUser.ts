interface User {
    id:string;
    username: string;
    loginStatus: boolean;
    latest?: string;
    latestMessage?: string;
    avatar: string;
    intro:string;
    read:boolean;
  }

  export default User;