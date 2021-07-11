import firebase, { usersRef, chatRef,usersPublicRef, userDB ,chatroomDB,messageDB} from '../setup/setupFirebase'
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

  // chatRef.child("/chatrooms")
  // .once('value', (snapshot) => {
  //   const data = snapshot.val();
  //     Object.keys(data).forEach(ele => {
  //       const arr =Object.keys(data[ele].members);
  //       console.log(arr);
  //       console.log(ele,{...data[ele],members:arr,memberInfos:data[ele].members})
  //       chatroomDB
  //       .doc(ele)
  //       .set({...data[ele],memberInfos:data[ele].members,members:Object.keys(data[ele].members)})
  //   }) 
  // }); 

  // chatroomDB
  //     .doc("-Mdtq1ZeBs48gjlT4ZdQ")
  //     .collection("messages")
  //     .onSnapshot((querySnapshot) => {
  //       querySnapshot.forEach( mes => {
  //         console.log(mes.data())
  //         chatroomDB
  //         .doc("-Mdtq1YgZ08zGZtk6Ejy")
  //         .collection("messages")
  //         .doc(mes.data().id)
  //         .set(mes.data())
  //       })
  //     }); 
  
  // chatRef.child("/chatrooms")
  // .once('value', (snapshot) => {
  //   const data = snapshot.val();
  //   Object.keys(data).forEach(ele => {
  //     chatroomDB
  //     .doc(ele)
  //     .set(data[ele])
  //   })
  // })


  // chatRef.child("/Messages")
  // .once('value', (snapshot) => {
  // const data = snapshot.val();
  // console.log(data)

  //   Object.keys(data).forEach(ele => {
  //     // console.log(ele,data[ele])
  //     Object.keys(data[ele]).forEach(mesID => {
  //       chatroomDB
  //     .doc(ele)
  //     .collection("messages")
  //     .doc(mesID)
  //     .set(data[ele][mesID])
  //     .then(() => {
  //       console.log('Document written with ID: ', mesID)
  //     })
  //     .catch((error) => {
  //       console.error('Error adding document: ', error)
  //     })
  //   })
  //     })
  // })

  // usersPublicRef
  //   .orderByChild('/email')
  //   .equalTo(userData?.email!)
  //   .once('value', (snapshot) => {
  //     console.log(snapshot.exists())
  //     if (!snapshot.exists()) {
  //       usersPublicRef.child(`/${userInfo?.uid!}`).set(userData)
  //     }
  //   })

  userDB
    .doc(userInfo?.uid!)
    .set(userData)
    .then(() => {
      console.log('Document written with ID: ', userInfo?.uid!)
    })
    .catch((error) => {
      console.error('Error adding document: ', error)
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
