import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

let app;
let db;

export function useFirebase() {
  if (!app) {
    const firebaseConfig = {
      // Your Firebase configuration
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_FIREBASE_APP_ID,
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }

  return { app, db };
}