import {get} from '../utilities/giphyApiHelper';


const getTrendyGIFs = () => get<any>(`/gifs/trending`);
const getSearchGIFs = (query:string) => get<any>(`/gifs/search`,{q:query});


export {getTrendyGIFs,getSearchGIFs};