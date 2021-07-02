import { Observable } from 'rxjs';
import Message from '../interface/IMessage';
import User from '../interface/IUser';
import Chatroom from '../interface/IChatroom';
import {get} from '../utilities/apiHelper';

const api= "https://60d9c7045f7bf10017547741.mockapi.io/api/v1/"

const getUsers = () => get<User>(`${api}users`);

const getMessages = () => get<Message>(`${api}messages`);

const getChatrooms = () => get<Chatroom>(`${api}Chatroom`);


export {getUsers,getMessages,getChatrooms};