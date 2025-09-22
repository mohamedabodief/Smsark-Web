// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBZDFrAARgCTXF_L5KFqD_EOQm_5nF_uTg",
  authDomain: "smsark-alaqary.firebaseapp.com",
  projectId: "smsark-alaqary",
  messagingSenderId: "165621685338",
  appId: "1:165621685338:web:295441459d4d5443e9cc63"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: '/logo192.png'
  });
});
