import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { initializeApp, firestore } from "firebase";
// import { admin } from "firebase-admin";
// var admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: "AIzaSyDfC9MnGx0gPT6MtyhTmk2Ajw9yZCdntx0",
  authDomain: "fir-crud-cdf93.firebaseapp.com",
  projectId: "fir-crud-cdf93",
  storageBucket: "fir-crud-cdf93.appspot.com",
  messagingSenderId: "658211824700",
  appId: "1:658211824700:web:1c269e765405c43a9a0f39",
};
// init firebase app
initializeApp(firebaseConfig);

//init services
export const db = getFirestore();
