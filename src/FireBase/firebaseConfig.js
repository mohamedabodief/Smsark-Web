// // src/firebaseConfig.js

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, Timestamp } from 'firebase/firestore';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { getStorage } from "firebase/storage";
// const storage = getStorage(app);
// export { storage };

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// // ✅ تهيئة التطبيق
// export const app = initializeApp(firebaseConfig);

// // ✅ خدمات Firebase
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const timestamp = Timestamp;

// // ✅ FCM (Firebase Cloud Messaging)
// export const messaging = getMessaging(app);
// export { getToken, onMessage };

// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

// ✅ config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
console.log('🔥 Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY);

// ✅ initialize app
export const app = initializeApp(firebaseConfig);

// ✅ initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const timestamp = Timestamp;
export const messaging = getMessaging(app);
export const storage = getStorage(app);
export { getToken, onMessage };
