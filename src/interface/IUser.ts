interface User {
    uid:string;
    username: string;
    email: string;
    fullName:string;
    loginStatus: boolean;
    avatar: string;
    intro?:string;
  }

  export default User;