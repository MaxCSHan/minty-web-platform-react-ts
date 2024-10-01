import { get } from '../utilities/unsplashApiHelper'

const getPhotoRandoms = (count = 1) => get<any>(`/photos/random`, { count })
const getPhotoSearch = ({ count = 1, query = '' }) => get<any>(`/search/photos`, { query })

export { getPhotoRandoms, getPhotoSearch }
