// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // for authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOgT4lU4nUb7f8iHUY7fe7rsTRLF8f4oY",
  authDomain: "fb-rest-race.firebaseapp.com",
  databaseURL: "https://fb-rest-race-default-rtdb.firebaseio.com",
  projectId: "fb-rest-race",
  storageBucket: "fb-rest-race.appspot.com",
  messagingSenderId: "950177214357",
  appId: "1:950177214357:web:58ed1a1856a23f808f109c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
