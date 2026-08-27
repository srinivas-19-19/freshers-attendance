import { database } from '../firebase';
import { ref, onValue, set, update, get } from 'firebase/database';

// Firebase schema: /attendance/{dateId}/{sessionId}/{studentId} = status

export const subscribeToAttendance = (callback) => {
  if (!database) {
    console.error("Firebase database is not initialized.");
    return () => {};
  }
  const dbRef = ref(database, 'attendance');
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });
  return unsubscribe;
};

export const saveAttendance = async (dateId, sessionId, studentId, status) => {
  if (!database) return false;
  try {
    if (status === 'not_marked') {
      // Removing the key if it's not marked is cleaner
      await set(ref(database, `attendance/${dateId}/${sessionId}/${studentId}`), null);
    } else {
      await set(ref(database, `attendance/${dateId}/${sessionId}/${studentId}`), status);
    }
    return true;
  } catch (error) {
    console.error("Failed to save attendance:", error);
    return false;
  }
};

export const saveBulkAttendance = async (dateId, sessionId, studentIds, status) => {
  if (!database) return false;
  try {
    const updates = {};
    studentIds.forEach(id => {
      updates[`attendance/${dateId}/${sessionId}/${id}`] = status === 'not_marked' ? null : status;
    });
    // Perform a multi-path update
    await update(ref(database), updates);
    return true;
  } catch (error) {
    console.error("Failed to save bulk attendance:", error);
    return false;
  }
};

// Undo logic typically reverts to exactly what the previous state was
export const restoreBulkAttendance = async (dateId, sessionId, previousStates) => {
  if (!database) return false;
  try {
    const updates = {};
    // previousStates is an object: { [studentId]: previousStatus }
    Object.keys(previousStates).forEach(id => {
      const status = previousStates[id];
      updates[`attendance/${dateId}/${sessionId}/${id}`] = (status === 'not_marked' || !status) ? null : status;
    });
    await update(ref(database), updates);
    return true;
  } catch (error) {
    console.error("Failed to restore bulk attendance:", error);
    return false;
  }
};

export const resetAttendance = async () => {
  if (!database) return false;
  try {
    await set(ref(database, 'attendance'), null);
    return true;
  } catch (error) {
    console.error("Failed to reset attendance:", error);
    return false;
  }
};
