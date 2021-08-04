import IUser from '../interface/IUser';
import {get} from '../utilities/giphyApiHelper';


const getGIFs = () => get<any>(`/gifs/trending`);
export {getGIFs};