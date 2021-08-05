import Message from '../interface/IMessage';
import IUser from '../interface/IUser';
import IChatroom from '../interface/IChatroom';
import {get} from '../utilities/apiHelper';


const getUsers = () => get<IUser>(`/users`);

const getMessages = (id:string) => get<Message>(`/Chatroom/${id}/messages`);

const getChatrooms = () => get<IChatroom>(`/Chatroom`);


export {getUsers,getMessages,getChatrooms};