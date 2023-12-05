// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrFr313-a0sgrc0TIHMydk_5nsU4pTmmY",
  authDomain: "rev-up-1db24.firebaseapp.com",
  projectId: "rev-up-1db24",
  storageBucket: "rev-up-1db24.appspot.com",
  messagingSenderId: "763855326390",
  appId: "1:763855326390:web:ee82a41b56387662df2a17",
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
