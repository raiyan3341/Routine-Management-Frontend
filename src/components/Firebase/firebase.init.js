// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgw-zofG6voM-QMmW-mFsf7DPvgbTzFK4",
  authDomain: "routine-management-d81cb.firebaseapp.com",
  projectId: "routine-management-d81cb",
  storageBucket: "routine-management-d81cb.firebasestorage.app",
  messagingSenderId: "163524649816",
  appId: "1:163524649816:web:d8c1ee5a8a5b8fa2317b2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

