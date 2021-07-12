import { Link } from 'react-router-dom'
import StringMap from '../../../../interface/StringMap'
import IMember from '../../../../interface/IMember'
import { useEffect, useState } from 'react'
import IChatroom from '../../../../interface/IChatroom'
import { loginUser } from '../../../../services/authService'
import { userDB } from '../../../../setup/setupFirebase'
import User from '../../../../interface/IUser'

type groupProfileProps = {
  roomObject : IChatroom
  roomId: string
  selectedRoomId: string
  onRoomSelected:(roomid:string)=>void
}

const ListBlock = ({ roomObject,roomId, selectedRoomId ,onRoomSelected}: groupProfileProps) => {
  const [room, setRoom] = useState<IChatroom>()
  const [theOtherUser,setTheOtherUser] =useState("");
  const [loginStatus,setLoginStatus] =useState(false);


  useEffect(() => {
    setRoom(roomObject)
    setTheOtherUser(roomObject?.members!.filter((ele) => ele !== loginUser().uid)[0]!);
  }, [roomObject])

  useEffect(() => {
    if(theOtherUser){
      userDB.doc(theOtherUser).onSnapshot((doc)=>{
      const data = doc.data() as User
      setLoginStatus(data.loginStatus)})
    }
    
  }, [theOtherUser])

  const DMTitle = () => {
    return room!.memberInfos[theOtherUser!].username;
  }

  const DMProfile = () => {
    return <img className="h-16 w-16 rounded-full object-cover" alt="" src={room!.memberInfos[theOtherUser!].avatar} />
  }

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
  const dateController = (dateNumber: number) => {
    const mesDate = new Date(dateNumber)
    const curr = new Date()
    return curr.getDate() === mesDate.getDate()
      ? mesDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : mesDate.toLocaleDateString()
  }
  const loading = (
    <div className="w-full animate-pulse px-4 h-20 flex items-center">
      <div className=" h-16 w-16 rounded-full bg-gray-200"></div>
      <div className="ml-2 h-14 w-5/6 flex flex-col justify-around">
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
        <div className=" h-4 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  )
  return room ? (
    <Link key={`chatroom_link_${roomId}`} to={`/chat/room/${roomId}`}>
      <div
      onClick={()=>onRoomSelected(roomId)}
        className={`w-full  px-4 h-20 flex items-center ${
          roomId === selectedRoomId ? 'bg-gray-100 hover:bg-gray-100 ' : 'bg-white hover:bg-gray-50 '
        }`}
        key={`chatroom_${roomId}`}
      >
        <div className="relative h-16 w-16 rounded-full ">
          {room.roomPhoto ? (
            <img className="h-16 w-16 rounded-full object-cover" alt="" src={room.roomPhoto} />
          ) : room!.group ? (
            groupProfile(room!.memberInfos)
          ) : (
            DMProfile()
          )}
          {loginStatus && <div className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>}
        </div>
        <div className="ml-2 flex flex-col">
          <div>{room!.group? room!.title: DMTitle()}</div>
          <div
            className={` md:w-64 flex justify-between ${
              (room!.read ? room!.read[loginUser().uid] : '') !== room!.latestMessageId || false ? 'font-semibold' : ''
            }`}
          >
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis md:w-48">{room!.latestMessage!.slice(0, 20)} </div>
            <div className="text-sm mx-1 flex items-center">•</div>
            <div className="text-xs whitespace-nowrap flex items-center">{dateController(room!.latestActiveDate)}</div>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    loading
  )
}

export default ListBlock
