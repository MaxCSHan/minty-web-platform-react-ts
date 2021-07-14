import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators'
import { chatroomDB, userDB } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'
import IChatroom from '../../../../interface/IChatroom'
import IMember from '../../../../interface/IMember'
import StringMap from '../../../../interface/StringMap'
import User from '../../../../interface/IUser'
import ListBlock from './ListBlock'

type ChatlistProps = {
  myUsername: string
}

const Chatlist = ({ myUsername }: ChatlistProps) => {
  /**
   * RWD Check: If entered a room then hide.
   */
  const location = useLocation()
  const locationChecker = () => location.pathname === '/chat/inbox'
  //
  const loginUid = loginUser().uid

  const [inputValue, setInputValue] = useState('')
  const [searching, setSearching] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string>()
  const [searchUserResult, setSearchUserResult] = useState<User[]>()
  const [recommendUserResult, setRecommendResult] = useState<User[]>()
  const [roomList, setRoomList] = useState<IChatroom[]>([])

  const keyword$ = new Subject<string>()
  const suggestList$ = keyword$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((ele) => {
      if (ele.replace(/\s/g, '').length === 0) return [[]]
      return userDB
        .where('username', '>=', ele)
        .where('username', '<=', ele + '\uf8ff')
        .get()
        .then((docs) => docs.docs.map(doc => doc.data() as User))
        })
      )
  useEffect(() => {
    const subscription = suggestList$.subscribe((ele) => {
      setSearchUserResult(ele)
    })
    return () => {
      subscription.unsubscribe()
    }
  })
  useEffect(() => keyword$.next(inputValue), [inputValue])

  useEffect(() => {
    const listener = chatroomDB
      .where(`members`, 'array-contains', loginUid)
      .orderBy('latestActiveDate', 'desc')
      .onSnapshot((querySnapshot) => {
        var dataRoomList: IChatroom[] = []
        querySnapshot.forEach((doc) => {
          // console.log("chat room",doc.data())
          dataRoomList.push(doc.data() as IChatroom)
        })
        setRoomList(dataRoomList)
      })
    userDB
      .limit(10)
      .get()
      .then((doc) => {
        const arr: User[] = []
        doc.forEach((ele) => arr.push(ele.data() as User))
        // console.log(arr)
        setRecommendResult(arr)
      })
    return () => {
      listener()
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputValue('')
    else {
      setInputValue(value)
    }
  }

  const searchUser = () => {
    userDB
      .limit(10)
      .get()
      .then((doc) => {
        const arr: User[] = []
        doc.forEach((ele) => arr.push(ele.data() as User))
        // console.log(arr)
        setSearchUserResult(arr)
      })
  }

  const searchResult = () => {
    // const res = userList.filter((ele) =>
    //   ele.username.toLocaleLowerCase().includes(inputValue)
    // );
    const res = searchUserResult?.filter((ele) => ele.username.includes(inputValue)) || []
    return res
  }

  const onRoomSelected = (roomid: string) => {
    setSearching(false)
    setSelectedRoom(roomid)
  }

  //Components

  const groupProfile = (members: StringMap<IMember>) => {
    const imgArr = Object.values(members)
      .slice(0, 2)
      .map((ele) => ele.avatar)

    return (
      <div className="h-16 w-16 flex flex-col justify-center">
        <img className="object-cover h-10 w-10 ml-6 rounded-full" alt="" src={imgArr[0]} />
        <img className="object-cover h-11 w-11 -mt-4 border-2 border-white rounded-full" alt="" src={imgArr[1]} />
      </div>
    )
  }

  const loadingListComponent = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ele, index) => (
    <div className="w-full animate-pulse px-4 h-20 flex items-center" key={`chatroomLoad_${index}`}>
      <div className=" h-16 w-16 rounded-full bg-gray-200"></div>
      <div className="ml-2 h-14 w-5/6 flex flex-col justify-around">
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  ))

  const resultComponent = (userArr: User[] = []) =>
    userArr.map((ele, index) => (
      <Link key={`search_result_${index}`} to={`/chat/room/${[loginUser().uid, ele.uid].sort().join('')}`} onClick={() => setSearching(false)}>
        <div className="flex items-center  px-3 py-1 cursor-pointer">
          <img className="h-10 w-10 rounded-full object-cover" alt="" src={ele.avatar} />
          <div className="ml-4">{ele.username}</div>
        </div>
      </Link>
    ))

  const mapRoomList = roomList.map((ele, index) => (
    <ListBlock roomObject={ele} roomId={ele.id} selectedRoomId={selectedRoom!} onRoomSelected={onRoomSelected}></ListBlock>
  ))

  const roomListComponent = <div className="z-20 bg-white">{mapRoomList}</div>

  const searchComponent = (
    <div
      className={`transition-all duration-200  ease-in-out flex ${
        searching || inputValue.length > 0 ? 'opacity-100 visible  max-h-140 h-full' : 'opacity-0 invisible h-0/100'
      }`}
    >
      {inputValue.length !== 0 ? (
        <div className="flex flex-col flex-grow mt-4">
          {searchUserResult ? (
            resultComponent(searchUserResult)
          ) : (
            <div className="w-full flex justify-center">
              <div className="animate-spin relative border-4 border-gray-500 rounded-full w-8 h-8">
                <div className="absolute bg-white w-4 h-4 -top-1 -left-1"></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <div className="h-14 flex items-center  pl-8 font-semibold ">Suggested</div>
          {resultComponent(recommendUserResult)}
        </div>
      )}
    </div>
  )

  return (
    <div className={`w-screen sm:max-w-xs md:max-w-none md:w-96 sm:flex  ${locationChecker() ? '' : 'hidden'}`}>
      <div className="w-full bg-white border  flex flex-col items-center">
        <div className="flex flex-col w-full">
          <div className="relative h-16 flex items-center justify-center font-semibold text-lg border-b">
            {myUsername}
            <div className="absolute right-10 h-10 w-10 flex items-center justify-center cursor-pointer rounded-full  hover:bg-gray-50">
              <Link to={'/chat/inbox/new'}>
                <i className="fas fa-paper-plane"></i>
              </Link>
            </div>
          </div>
          <div className="h-12 flex items-center px-4">
            <input
              className="w-full appearance-none outline-none"
              placeholder="Search"
              value={inputValue}
              onFocus={() => setSearching(true)}
              onChange={(e) => handleInput(e)}
            ></input>
            {searching && (
              <div
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearching(false)
                  setInputValue('')
                }}
              >
                <i className="fas fa-times"></i>
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex-grow flex-shrink border-t overflow-y-scroll">
          {/* {loadingListComponent} */}
          {searchComponent}
          {roomListComponent}
        </div>
      </div>
    </div>
  )
}

export default Chatlist
