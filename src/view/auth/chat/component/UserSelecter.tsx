import { useEffect, useRef, useState } from 'react'
import User from '../../../../interface/IUser'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { userDB } from '../../../../setup/setupFirebase'
import { loginUser } from '../../../../services/authService'

type UserSelecterProps = {
  selectedUser: User[]
  setSelectedUser: (value: User[]) => void
  description?: string
}

const UserSelecter = ({ selectedUser, setSelectedUser ,description}: UserSelecterProps) => {
  const [inputValue, setInputValue] = useState('')
  const [reccomendList, setReccomendList] = useState<User[]>()
  const [selectedUserId, setSelectedUserId] = useState<string[]>([])
  const [searchUserResult, setSearchUserResult] = useState<User[]>()

  const inputRef = useRef<HTMLInputElement>(null)

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
        .then((docs) => {
          const arr: User[] = []
          docs.forEach((doc) => arr.push(doc.data() as User))
          return arr
        })
    })
  )
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') setInputValue('')
    else {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue.length === 0) {
      setSelectedUser(selectedUser.slice(0, selectedUser.length - 1))
    }
  }

  useEffect(() => {
    userDB
      .limit(10)
      .get()
      .then((doc) => {
        const arr: User[] = []
        doc.forEach((ele) => arr.push(ele.data() as User))
        console.log(arr)
        setReccomendList(arr.filter((user) => user.uid !== loginUser().uid))
      })
  }, [])
  useEffect(() => {
    const subscription = suggestList$.subscribe((ele) => {
      setSearchUserResult(ele)
    })
    return () => {
      subscription.unsubscribe()
    }
  })
  useEffect(() => keyword$.next(inputValue), [inputValue])

  const radioBtnUserList = (newUser: User) => {
    if (!selectedUserId.includes(newUser.uid)) addToUserlist(newUser)
    else removeFromUserList(newUser)
  }

  const addToUserlist = (user: User) => {
    setSelectedUserId([...selectedUserId!, user.uid])
    setSelectedUser([...selectedUser!, user])
  }

  const removeFromUserList = (user: User) => {
    const newList = selectedUser.filter((item) => item.uid !== user.uid)
    setSelectedUserId(newList.map((ele) => ele.uid))
    setSelectedUser(newList)
  }

  return (
    <div className="flex flex-col flex-grow px-6">
      {description && <div className="mt-3">{description}</div>}
      <div className="flex flex-col ">
        <div className={`mb-3 flex h-14  items-center  scrollbar-hide  overflow-x-scroll transition-all duration-300 ease-in-out my-3`}>
          {selectedUser?.map((user, index) => (
            <div className="flex flex-shrink-0  items-center justify-center mx-1  border rounded-full px-3 py-1">
              <img className="h-8 w-8 rounded-full mr-1" alt="" src={user.avatar}></img>
              <div className="text-sm cursor-default">{user.username}</div>
              <div
                className="ml-2 flex items-center justify-center bg-gray-100 hover:bg-gray-300 h-4 w-4 rounded-full cursor-pointer"
                onClick={() => removeFromUserList(user)}
              >
                <i className="fas fa-times text-xs text-gray-700"></i>
              </div>
            </div>
          ))}
          <div>
            <input
              className="outline-none pl-2 min-w-max w-full"
              placeholder="Search a user"
              onChange={(e) => handleSearchInput(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              ref={inputRef}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {inputValue.replace(/\s/g, '').length !== 0 &&
          searchUserResult?.map((user) => (
            <div className="flex items-center justify-between mx-3 my-1" onClick={() => radioBtnUserList(user)}>
              <div className="flex items-center">
                <img className="h-10 w-10 rounded-full mr-3" alt="" src={user.avatar}></img>
                <div>{user.username}</div>
              </div>

              <div className={`w-6 h-6 border-2 rounded-full cursor-pointer ${selectedUserId.includes(user.uid) ? 'bg-green-400' : ''}`}></div>
            </div>
          ))}
        <div className="font-semibold mb-2">Suggested</div>
        {reccomendList?.map((user) => (
          <div className="flex items-center justify-between mx-3 my-1" onClick={() => radioBtnUserList(user)}>
            <div className="flex items-center">
              <img className="h-10 w-10 rounded-full mr-3" alt="" src={user.avatar}></img>
              <div>{user.username}</div>
            </div>
            <div className={`w-6 h-6 border-2 rounded-full cursor-pointer ${selectedUserId.includes(user.uid) ? 'bg-green-400' : ''}`}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserSelecter
