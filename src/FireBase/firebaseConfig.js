import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBZDFrAARgCTXF_L5KFqD_EOQm_5nF_uTg',
  authDomain: 'smsark-alaqary.firebaseapp.com',
  projectId: 'smsark-alaqary',
  storageBucket: 'smsark-alaqary.firebasestorage.app',
  messagingSenderId: '165621685338',
  appId: '1:165621685338:web:295441459d4d5443e9cc63',
  measurementId: 'G-0ZMCMWXZ1X',
};



const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

