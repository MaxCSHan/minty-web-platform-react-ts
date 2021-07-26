import { useState } from 'react'

const Post = () => {
  const [state, setState] = useState({ loaded: false })
  const [bookmarked, setBookmarked] = useState({ save: false })
  const [bookmarkShown, setBookmarkShown] = useState(false)

  //
  const title = 'La belle Famme'
  const userName = 'Max'


  return (
    <div className={`${state.loaded ? '' : 'animate-pulse'} max-w-5xl  h-full sm:h-140 md:h-full  xl:h-full my-3`}>
      <div className="h-full flex flex-col items-center justify-evenly p-1">
        <div
          className={`w-full h-72 sm:h-full bg-blue-400 rounded  relative ${bookmarkShown?"shadow-inner":"shadow-none"}`}
          onMouseEnter={() => setBookmarkShown(true)}
          onMouseLeave={() => setBookmarkShown(false)}
        >
          <div className={`absolute  inset-0 bg-gray-700 transition-all duration-300 ease-in-out ${bookmarkShown?" bg-opacity-10 visible":" bg-opacity-0 invisible"}`}></div>
          {
            <img
              src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
              alt="..."
              className=" object-cover w-full h-full align-middle border-none"
              onLoad={() => setState({ loaded: true })}
            />
         }

          {state.loaded && (
            <div
              className={`absolute top-2 right-4 w-36 h-10 rounded-full flex items-center justify-center ${
                bookmarkShown ? 'opacity-100' : 'opacity-0'
              } transition-all duration-100 ease-in-out`}
              onClick={() => setBookmarked({ save: !bookmarked.save })}
            >
              <div className="flex">
              {bookmarked.save ? 
                  <div className="cursor-pointer shadow-md w-14 py-1 bg-red-400   rounded-xl flex justify-center items-center text-white mr-2">
                    <div>
                      <i className=" fas fa-heart"></i>
                    </div>
                  </div>:<div className="cursor-pointer shadow-md w-14 py-1 bg-gray-200 bg-opacity-80 hover:bg-opacity-100  rounded-xl flex justify-center items-center text-gray-600 hover:text-gray-700 mr-2">
                    <div>
                      <i className=" fas fa-heart"></i>
                    </div>
                  </div>}
                  {/* <div className="cursor-pointer shadow-md w-14 py-1 bg-gray-200 bg-opacity-80 hover:bg-opacity-100   rounded-xl flex justify-center items-center text-gray-600 hover:text-gray-700">
                    <div>+</div>
                  </div> */}
                </div>
            </div>
          )}
        </div>
        {state.loaded ? (
          <div className="bg-white h-20 p-4 w-full">
            <div className={`h-4 font-semibold w-5/6 cursor-pointer`}>{title}</div>
            <div className={`h-4 w-5/6 cursor-pointer`}>{userName}</div>
          </div>
        ) : (
          <div className="animate-pulse bg-white h-20 p-4 w-full">
            <div className={`h-4 w-60 sm:w-88 md:w-140 bg-gray-200 rounded my-1`}></div>
            <div className={`h-4 w-14 sm:w-32 md:w-88 bg-gray-200 rounded my-2`}></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post
