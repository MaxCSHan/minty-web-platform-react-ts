importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 firebase.initializeApp(JSON.parse(process.env.REACT_APP_FIREBASE))

 const messaging = firebase.messaging();
 messaging.getToken({vapidKey:process.env.REACT_APP_CLOUDMESSAGETOKEN}).then((currentToken) => {
    if (currentToken) {
        console.log(currentToken)
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
  });
  

