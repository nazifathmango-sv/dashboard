import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNx1ZYkKDmHB8Ok8_77PxgSEgnmD4a_9I",
  authDomain: "sunbeachhotel-3f51b.firebaseapp.com",
  projectId: "sunbeachhotel-3f51b",
  storageBucket: "sunbeachhotel-3f51b.firebasestorage.app",
  messagingSenderId: "709682936331",
  appId: "1:709682936331:web:2e6d3207210274313ca50e",
  measurementId: "G-JVYE5VBVWJ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
