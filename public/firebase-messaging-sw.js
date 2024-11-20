importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBlXbQWKKW3Dhw4zyLgpkfPMsxThgpe8iI',
  authDomain: 'projectnauhenyo-8a674.firebaseapp.com',
  projectId: 'projectnauhenyo-8a674',
  storageBucket: 'projectnauhenyo-8a674.appspot.com',
  messagingSenderId: '340792540214',
  appId: '1:340792540214:web:d9672947ef0c0bd1aaac97',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
