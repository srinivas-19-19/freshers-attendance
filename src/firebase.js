import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBJ1vjN" + "P6Jh7B-K2eDnLxPJ9ecSMFR0-og",
  authDomain: "freshers-attendance.firebaseapp.com",
  databaseURL: "https://freshers-attendance-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "freshers-attendance",
  storageBucket: "freshers-attendance.firebasestorage.app",
  messagingSenderId: "706051823093",
  appId: "1:706051823093:web:00f6569a51b7ff58e5bcbc",
  measurementId: "G-TP1N9PPYRW"
};

let app, database;
try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// Helper functions for easy real-time syncing
export const syncData = (callback) => {
  if (!database) return;
  const dbRef = ref(database, '/');
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || { attendance: {}, metaData: {} });
  });
};

export const updateAttendance = (attendanceData) => {
  if (!database) return;
  set(ref(database, 'attendance'), attendanceData);
};

export const updateMetaData = (metaData) => {
  if (!database) return;
  set(ref(database, 'metaData'), metaData);
};

export { database, app };
