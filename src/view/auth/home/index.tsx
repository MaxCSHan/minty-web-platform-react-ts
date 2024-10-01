import { useEffect, useState } from 'react'
import { getPhotoRandoms } from 'services/unsplashService'
import Post from '../../../component/Post/index'

const Home = () => {
  const [photos, setPhotos] = useState<any[]>()

  useEffect(() => {
    getPhotoRandoms(15).subscribe((observer) => {
      const data = observer as any
      setPhotos(data)
    })
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col transition duration-100 ease-in-out pt-14">
      {/* <Searchbar></Searchbar> */}
      <div className=" flex-grow flex flex-col overflow-y-scroll items-center transition duration-100 ease-in-out sm:bg-gray-100 bg-opacity-80">
        {photos?.map((photo, index) => (
          <Post
            isGrid={false}
            imgUrl={photo.urls.regular}
            description={photo.description}
            title={photo.description}
            userName={photo.user.name}
          ></Post>
        ))}
      </div>
    </div>
  )
}

export default Home
