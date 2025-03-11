import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC3vRkCTAMIubTZjiE23Gwyty5I4mS70O4",
    authDomain: "payminds-3ee23.firebaseapp.com",
    projectId: "payminds-3ee23",
    storageBucket: "payminds-3ee23.firebasestorage.app",
    messagingSenderId: "646979332984",
    appId: "1:646979332984:web:6f45758b0b8702bae6368d",
    measurementId: "G-YFL7RS3MJC"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
