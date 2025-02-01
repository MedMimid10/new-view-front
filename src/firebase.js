// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnV0QyUmw7_8xzFSjsWFCLLSNbpFU9vUE",
  authDomain: "new-view-630a9.firebaseapp.com",
  projectId: "new-view-630a9",
  storageBucket: "new-view-630a9.firebasestorage.app",
  messagingSenderId: "335065910222",
  appId: "1:335065910222:web:90c7f3755d21729d73f99f",
  measurementId: "G-Y8M7SR0XPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);