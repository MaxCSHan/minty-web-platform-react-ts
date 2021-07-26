
interface IUser {
    uid:string;
    username: string;
    email: string;
    fullName:string;
    loginStatus: boolean;
    avatar: string;
    intro?:string;
  }

  export default IUser;