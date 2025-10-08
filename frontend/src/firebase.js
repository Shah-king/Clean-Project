// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMjXYOOTcwbjmxL3_-qHgSdaizfZyq00I",
  authDomain: "projectclean-2db01.firebaseapp.com",
  projectId: "projectclean-2db01",
  storageBucket: "projectclean-2db01.firebasestorage.app",
  messagingSenderId: "515656995079",
  appId: "1:515656995079:web:ff7c03497d7213146a75a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;