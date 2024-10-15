/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAihjm94opoP-p8a-TmLi44AfK2z6CCHSM",
  authDomain: "mylegislations-and-policies.firebaseapp.com",
  projectId: "mylegislations-and-policies",
  storageBucket: "mylegislations-and-policies.appspot.com",
  messagingSenderId: "633854784630",
  appId: "1:633854784630:web:8ac5d6f0d7090965209b57",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default db;
