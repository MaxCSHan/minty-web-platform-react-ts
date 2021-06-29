import { Observable } from 'rxjs';
import Message from '../interface/IMessage';
import User from '../interface/IUser';
import {get} from '../utilities/apiHelper';

const getUsers = () => get<User>('https://60d9c7045f7bf10017547741.mockapi.io/api/v1/users');

const getMessages = () => get<Message>('https://60d9c7045f7bf10017547741.mockapi.io/api/v1/messages');


export {getUsers,getMessages};