import firebase from 'firebase/app'
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";

// Add the Firebase realtime database to the project
import "firebase/database";

import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 firebase.initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE!))
 
 const databaseRef = firebase.database().ref();
 const chatRef = databaseRef.child("chat")
 const usersRef = databaseRef.child("users")
 const usersPublicRef = databaseRef.child("users/public")
 const usersPrivateRef = databaseRef.child("users/private")

 const firestoreDB = firebase.firestore();
 const userDB = firestoreDB.collection("users");
 const chatroomDB = firestoreDB.collection("chatrooms");
 const messageDB = firestoreDB.collection("messages");


export {chatRef,usersRef,usersPublicRef,usersPrivateRef,firestoreDB,userDB,chatroomDB,messageDB}
export default firebase;
