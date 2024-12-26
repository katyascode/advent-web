import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTTkf_xVF3q724yuSGQOKMd5HUBpB0CoQ",
  authDomain: "advent-web.firebaseapp.com",
  projectId: "advent-web",
  storageBucket: "advent-web.firebasestorage.app",
  messagingSenderId: "453590949409",
  appId: "1:453590949409:web:3d15c050ea8cf056178d60",
  measurementId: "G-060TRKKY0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
