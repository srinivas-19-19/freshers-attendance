import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Helper functions for easy real-time syncing
export const syncData = (callback) => {
  const dbRef = ref(database, '/');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || { attendance: {}, metaData: {} });
  });
};

export const updateAttendance = (attendanceData) => {
  set(ref(database, 'attendance'), attendanceData);
};

export const updateMetaData = (metaData) => {
  set(ref(database, 'metaData'), metaData);
};
