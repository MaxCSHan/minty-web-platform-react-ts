import firebase from "../setup/setupFirebase";

const loginWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
        console.log(result.user);
        sessionStorage.setItem('user', JSON.stringify(result.user));

    //   if (result.credential) {
    //     /** @type {firebase.auth.OAuthCredential} */
    //     var credential = result.credential;

    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     var token = credential.accessToken;
    //     // ...
    //   }
    //   // The signed-in user info.
    //   var user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
};

const isLoggedIn = () => {
    const user = JSON.parse(sessionStorage.getItem('user')!);
    return user !== null;
  }
  const loginUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user')!);
    return user;
  }


export { loginWithGoogle,isLoggedIn,loginUser };
