import firebase, { usersRef } from '../setup/setupFirebase'
import User from '../interface/IUser'

const loginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()

  const result = await firebase.auth().signInWithPopup(provider)
  const userInfo = result.user
  console.log(result.user)
  const userData:User = {
    uid: userInfo?.uid!,
    username: userInfo?.displayName!,
    email: userInfo?.email!,
    fullName: userInfo?.displayName!,
    loginStatus: true,
    avatar: userInfo?.photoURL!
  };
  usersRef
    .orderByChild('username')
    .equalTo(result?.user?.email!)
    .once('value', (snapshot) => {
      if (!snapshot.exists()) {
          console.log("create new")
        usersRef.child(userInfo?.uid!).set(userData)
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
