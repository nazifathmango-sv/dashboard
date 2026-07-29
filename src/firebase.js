import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXoviAfr9_MvxOkFnpnbpvjJ5M9-IeCbw",
  authDomain: "dashboard-cfe41.firebaseapp.com",
  projectId: "dashboard-cfe41",
  storageBucket: "dashboard-cfe41.firebasestorage.app",
  messagingSenderId: "902495251628",
  appId: "1:902495251628:web:47fe8bf3459dd1f621c309",
  measurementId: "G-GVQGM6B8YV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Instance secondaire, utilisée uniquement pour créer de nouveaux comptes
// (Authentication) sans déconnecter l'administrateur actuellement connecté.
const secondaryApp = initializeApp(firebaseConfig, "secondary");
export const secondaryAuth = getAuth(secondaryApp);
