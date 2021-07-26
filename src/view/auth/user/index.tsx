import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import IUser from '../../../interface/IUser'
import { loginUser, logout } from '../../../services/authService'
import { userDB } from '../../../setup/setupFirebase'

const User = () => {
  const history = useHistory();
  const { userId } = useParams<Record<string, string | undefined>>()
  const [userInfo, setUserInfo] = useState<IUser>()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    userDB
      .where('username', '==', userId)
      .get()
      .then((snapshot) => 
      {
        if(snapshot.empty)  history.push({pathname: "/userNotFound"});
        else {
          setUserInfo(snapshot.docs[0].data() as IUser)
          setLoaded(true)
      }
        })
  }, [userId,history])
  return (
    <div className="h-screen flex flex-col items-center transition duration-100 ease-in-out pt-14">
      <div className={`relative w-screen h-48 bg-gray-100 flex flex-col sm:flex-row items-center justify-center bg-cover ${loaded?"":"animate-pulse"}`}>
        {loaded && <img alt="banner" src={userInfo?.avatar} className="absolute w-full h-full object-cover z-0"></img>}
        <div className={`h-32 w-32 z-10  rounded-full bg-gray-200   flex items-center justify-center  `}>
        <img
          className={`h-32 w-32 object-cover  rounded-full border border-gray-50 bg-gray-50  ${loaded?"":"animate-pulse"}`}
          alt=""
          src={userInfo?.avatar }
        />
        </div>
       
      </div>
      <div className="text-3xl font-semibold my-5 flex items-center ">
        {userInfo?.fullName || <div className="bg-gray-200 w-64 h-8 my-1 rounded-lg animate-pulse"></div>}
        {userInfo?.uid === loginUser()?.uid && (
          <span className="ml-2 text-sm ">
            <i className="fas fa-user-edit"></i>
          </span>
        )}
      </div>
      <div className="w-full flex items-center px-4 justify-around">
        <div>Works | 320</div>
        <div>Likes | 320</div>
        <div>Followers | 320</div>
      </div>

      {userInfo?.uid === loginUser()?.uid && (
        <div>
          <Link to="/auth">
            <div className="h-8 flex items-center bg-primary text-white font-semibold cursor-pointer rounded-full px-4" onClick={() => logout()}>
              Logout
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

export default User
