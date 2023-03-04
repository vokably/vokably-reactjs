// Modular Firebase v.9 Initialization.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "@firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBJ7MsjCvRAZgV5qN6nbUbN7vkYlFR9ciE",
    authDomain: "vokably.firebaseapp.com",
    projectId: "vokably",
    storageBucket: "vokably.appspot.com",
    messagingSenderId: "1077632517203",
    appId: "1:1077632517203:web:f25101cd1818ff70edb2a6",
    measurementId: "G-6G9H3XW6NV"
  };

function initFirebase() {
    if (typeof window !== undefined) {
        initializeApp(firebaseConfig);
        console.log("Firebase has been init successfully");
    }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realDB = getDatabase(app);

export { initFirebase, db, realDB };