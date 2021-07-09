import firebase, { usersRef, usersPublicRef } from '../setup/setupFirebase'
import User from '../interface/IUser'
import { useHistory } from 'react-router-dom'

const loginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()

  const result = await firebase.auth().signInWithPopup(provider)
  const userInfo = result.user
  //   console.log(result.user)
  const userData: User = {
    uid: userInfo?.uid!,
    username: userInfo?.displayName!,
    email: userInfo?.email!,
    fullName: userInfo?.displayName!,
    loginStatus: true,
    avatar: userInfo?.photoURL!
  }
  // usersRef
  // .once('value', (snapshot) => {
  // const data = snapshot.val();
  //   Object.keys(data).forEach(ele => {
  //     usersPublicRef.child(ele).set(data[ele])
  //   })
  // })

  usersPublicRef
    .orderByChild('/email')
    .equalTo(userData?.email!)
    .once('value', (snapshot) => {
      console.log(snapshot.exists())
      if (!snapshot.exists()) {
        usersPublicRef.child(`/${userInfo?.uid!}`).set(userData)
      }
    })

  sessionStorage.setItem('user', JSON.stringify(userData))

  //   if (result.credential) {
  //     /** @type {firebase.auth.OAuthCredential} */
  //     var credential = result.credential;

  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     var token = credential.accessToken;
  //     // ...
  //   }
  //   // The signed-in user info.
  //   var user = result.user;

  // .catch((error) => {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   // The email of the user's account used.
  //   var email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   var credential = error.credential;
  //   // ...
  // });
}

const isLoggedIn = () => {
  const user = JSON.parse(sessionStorage.getItem('user')!)
  //   console.log(user)
  return user !== null
}

const logout = async () => {
  await firebase
    .auth()
    .signOut()
    .then(() => sessionStorage.removeItem('user'))
}

const firbaseAuth = firebase.auth()
const loginUser = () => {
  const user = JSON.parse(sessionStorage.getItem('user')!) as User
  return user
}

export { loginWithGoogle, isLoggedIn, loginUser, logout, firbaseAuth }
