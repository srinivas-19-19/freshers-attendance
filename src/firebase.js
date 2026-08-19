import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBJ1vjNP6Jh7B-K2eDnLxPJ9ecSMFR0-og",
  authDomain: "freshers-attendance.firebaseapp.com",
  projectId: "freshers-attendance",
  storageBucket: "freshers-attendance.firebasestorage.app",
  messagingSenderId: "706051823093",
  appId: "1:706051823093:web:00f6569a51b7ff58e5bcbc",
  measurementId: "G-TP1N9PPYRW"
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
