import { useState } from "react";

const Post = () => {
  const [state, setState] = useState({ loaded: false });
  const [bookmarked, setBookmarked] = useState({ save: false });
  const [bookmarkShown, setBookmarkShown] = useState(false);

  //
  const title = "La belle Famme";
  const userName = "Max";

  const loaded = () => {
    setInterval(() => setState({ loaded: true }), 2000);
  };
  loaded();
  return (
    <div
      className={`${
        state.loaded ? "" : "animate-pulse"
      } w-full sm:w-120 md:w-140 lg:w-160 xl:w-auto h-full sm:h-140 md:h-full  xl:h-full my-3`}
    >
      <div className="h-full flex flex-col items-center justify-evenly p-1">
        <div
          className="w-full h-72 sm:h-full bg-blue-400 rounded  relative"
          onMouseEnter={() => setBookmarkShown(true)}
          onMouseLeave={() => setBookmarkShown(false)}
        >
          {state.loaded ? (
            <img
              src="https://www.creative-tim.com/learning-lab/tailwind-starter-kit/img/team-2-800x800.jpg"
              alt="..."
              className=" object-cover w-full h-full align-middle border-none"
              onLoad={() => setState({ loaded: true })}
            />
          ) : (
            <div className="h-72 sm:h-96 w-full bg-gray-200"></div>
          )}

          {
            <div
              className={`absolute top-2 right-4 w-10 h-10 rounded-full bg-gray-100 bg-opacity-50 flex items-center justify-center ${
                bookmarkShown ? "opacity-100" : "opacity-0"
              } transition-all duration-100 ease-in-out`}
              onClick={() => setBookmarked({ save: !bookmarked.save })}
            >
              {bookmarked.save ? (
                <i className={`fas fa-bookmark text-2xl text-primary `}></i>
              ) : (
                <i className={`far fa-bookmark text-2xl  text-primary`}></i>
              )}
            </div>
          }
        </div>
        {state.loaded ? (
          <div className="bg-white h-20 p-4 w-full">
            <div className={`h-4 font-semibold w-5/6`}>{title}</div>
            <div className={`h-4 w-5/6`}>{userName}</div>
          </div>
        ) : (
          <div className="animate-pulse bg-white h-20 p-4 w-full">
            <div className={`h-4 w-60 sm:w-88 md:w-140 bg-gray-200 rounded my-1`}></div>
            <div className={`h-4 w-14 sm:w-32 md:w-88 bg-gray-200 rounded my-2`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;