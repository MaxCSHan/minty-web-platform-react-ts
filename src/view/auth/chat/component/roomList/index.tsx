import IChatroom from 'interface/IChatroom'
import ListBlock from '../ListBlock'

type RoomListType = {
  roomList?: IChatroom[]
  selectedRoom?: string
  onRoomSelected: (roomid: string) => void
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

const Placeholder = () => <div className="flex justify-center items-center flex-1 h-full">Search and start the chat!</div>

const RoomList = ({ roomList, selectedRoom, onRoomSelected }: RoomListType) => {
  const mapRoomList =
    roomList && roomList.length > 0 ? (
      roomList?.map((ele, index) => (
        <ListBlock
          key={`list_block_${index}`}
          roomObject={ele}
          roomId={ele.id}
          selectedRoomId={selectedRoom!}
          onRoomSelected={onRoomSelected}
        ></ListBlock>
      ))
    ) : (
      <Placeholder />
    )

  return <div className="z-20 bg-white h-full flex flex-col">{mapRoomList ? mapRoomList : loadingListComponent}</div>
}

export default RoomList
