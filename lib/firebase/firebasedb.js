// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJYxwku2ln_qzf2K9zapcTg3seiQfbuxE",
    authDomain: "meleti-d10d7.firebaseapp.com",
    projectId: "meleti-d10d7",
    storageBucket: "meleti-d10d7.firebasestorage.app",
    messagingSenderId: "860670034991",
    appId: "1:860670034991:web:5c993c957d3adcab69f2da",
    measurementId: "G-TJGTRDDCJ8",
};

// github oAuth
const githubProvider = new GithubAuthProvider();

// Initialize Firebase
const firebasedb = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebasedb);

const auth = getAuth();

export { firebasedb, db, githubProvider, auth };
