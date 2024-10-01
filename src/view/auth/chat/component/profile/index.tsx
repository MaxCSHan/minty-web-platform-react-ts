import IMember from 'interface/IMember'
import IUser from 'interface/IUser'
import StringMap from 'interface/StringMap'

type DMProfileProps = {
  memberRef: StringMap<IMember>
  uid: string
}
const DMProfile = ({ memberRef, uid }: DMProfileProps) => {
  return <img className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover" alt="" src={memberRef[uid]?.avatar} />
}

type GroupProfileProps = {
  memberRef: StringMap<IMember>
}
const GroupProfile = ({ memberRef }: GroupProfileProps) => {
  const imgArr = Object.values(memberRef)
    .slice(0, 2)
    .map((ele) => ele.avatar)

  return (
    <div className="h-8 w-8 sm:h-12 sm:w-12 flex flex-col justify-center">
      <img className="object-cover h-6 w-6 sm:h-8 sm:w-8 ml-4 sm:ml-6 rounded-full" alt="" src={imgArr[0]} />
      <img className="object-cover h-6 w-6 sm:h-8 sm:w-8 -mt-4 border-2 border-white rounded-full" alt="" src={imgArr[1]} />
    </div>
  )
}

type RoomProfileProps = {
  loaded: boolean
  isRoomExist: boolean
  isGroup: boolean
  memberRef: StringMap<IMember>
  newUser: IUser
}
const RoomProfile = ({ loaded, isRoomExist, isGroup, memberRef, newUser }: RoomProfileProps) => {
  if (!loaded) return <div className="h-8 w-8 sm:h-12 sm:w-12 flex flex-col justify-center bg-gray-200 rounded-full"></div>
  if (!isRoomExist) return <img className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover bg-gray-100" alt="" src={newUser?.avatar} />
  return isGroup ? <GroupProfile memberRef={memberRef} /> : <DMProfile memberRef={memberRef} uid={newUser?.uid} />
}

export { RoomProfile, GroupProfile, DMProfile }
