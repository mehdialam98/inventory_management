// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCghVYgmeEfepfWzr3BsX0F9IqmHxVI7bs",
  authDomain: "inventory-management-91910.firebaseapp.com",
  projectId: "inventory-management-91910",
  storageBucket: "inventory-management-91910.appspot.com",
  messagingSenderId: "42982708236",
  appId: "1:42982708236:web:698a38bd4cbcdeeab14a29",
  measurementId: "G-DKQRB8MX1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}