// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvHHr2iImJ_p0pvQiy1c27R2ipYUHCzM0",
  authDomain: "artsprint327.firebaseapp.com",
  projectId: "artsprint327",
  storageBucket: "artsprint327.firebasestorage.app",
  messagingSenderId: "384872533279",
  appId: "1:384872533279:web:b40c81ea583bba8bbc342a",
  measurementId: "G-MFSJ14KMYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

export { storage };