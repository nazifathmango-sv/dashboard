// Import standard de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ÉTAPE INDISPENSABLE : Importer Firestore (base de données) et Authentication !
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Vos clés de configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNx1ZYkKDmHB8Ok8_77PxgSEgnmD4a_9I",
  authDomain: "sunbeachhotel-3f51b.firebaseapp.com",
  projectId: "sunbeachhotel-3f51b",
  storageBucket: "sunbeachhotel-3f51b.firebasestorage.app",
  messagingSenderId: "709682936331",
  appId: "1:709682936331:web:2e6d3207210274313ca50e",
  measurementId: "G-JVYE5VBVWJ"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ÉTAPE INDISPENSABLE : Créer et EXPORTER la base de données et l'authentification pour Vue.js
export const db = getFirestore(app);
export const auth = getAuth(app);
