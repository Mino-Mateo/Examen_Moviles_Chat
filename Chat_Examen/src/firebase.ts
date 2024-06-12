import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseurl: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementid: import.meta.env.VITE_MEASUREMENTID,
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore que vas a usar
export const db = getFirestore(firebaseApp);
