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
  apiKey: "AIzaSyAfgNyCtt0j6m_Yqb_aWy7AR6e3IFWvxao",
  authDomain: "masfofa-b2835.firebaseapp.com",
  projectId: "masfofa-b2835",
  storageBucket: "masfofa-b2835.appspot.com",
  messagingSenderId: "687917925034",
  appId: "1:687917925034:web:2f614fb6a3a5b9ccc406d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default db;
