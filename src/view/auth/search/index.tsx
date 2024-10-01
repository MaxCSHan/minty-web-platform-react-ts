import { useEffect, useState } from 'react'
import Searchbar from '../../../component/Searchbar/index'
import Post from '../../../component/Post/index'
import { getPhotoSearch } from 'services/unsplashService'
import { useLocation } from 'react-router-dom'

const posts = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15]

const Search = () => {
  const location = useLocation()
  const keyword = new URLSearchParams(location.search).get('keyword')

  const [grid, setGrid] = useState(false)

  const onGridSwitch = (isGrid: boolean) => {
    setGrid(isGrid)
  }
  const [photos, setPhotos] = useState<any[]>()

  useEffect(() => {
    getPhotoSearch({ count: 5, query: keyword || '' }).subscribe((observer) => {
      const data = observer as any
      setPhotos(data.results)
    })
  }, [keyword])

  return (
    <div className="h-screen w-screen transition duration-100 ease-in-out pt-14">
      <Searchbar onGridSwitch={onGridSwitch}></Searchbar>
      <div className="pt-16 w-screen h-full">
        <div
          className={` w-full  ${
            grid ? 'flex flex-col  md:grid md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5' : 'flex flex-col'
          }  justify-center items-center transition duration-100 ease-in-out sm:bg-gray-100 bg-opacity-80`}
        >
          {photos?.map((photo, index) => (
            <Post
              isGrid={grid}
              imgUrl={photo.urls.regular}
              description={photo.description}
              title={photo.description}
              userName={photo.user.name}
            ></Post>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search
