import { database } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import initialStudents from '../data/students.json';

export const subscribeToCustomStudents = (callback) => {
  if (!database) {
    callback(initialStudents);
    return () => {};
  }
  
  const dbRef = ref(database, 'customStudents');
  const unsubscribe = onValue(dbRef, (snapshot) => {
    let finalStudents = [...initialStudents];
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      const addedObj = data.added || {};
      const addedStudents = Object.values(addedObj);
      
      const deletedObj = data.deleted || {};
      const deletedIds = Object.keys(deletedObj);
      
      // Combine base with added
      finalStudents = [...finalStudents, ...addedStudents];
      
      // Filter out deleted
      finalStudents = finalStudents.filter(s => !deletedIds.includes(s.id));
    }
    
    // Sort by S.No to maintain order
    finalStudents.sort((a, b) => (a.sNo || 0) - (b.sNo || 0));
    
    callback(finalStudents);
  });
  
  return unsubscribe;
};

export const addStudentToFirebase = async (studentData) => {
  if (!database) return false;
  try {
    await set(ref(database, `customStudents/added/${studentData.id}`), studentData);
    return true;
  } catch (error) {
    console.error("Failed to add student:", error);
    return false;
  }
};

export const removeStudentFromFirebase = async (studentId) => {
  if (!database) return false;
  try {
    // Mark as deleted in 'deleted' node to cover base students
    await set(ref(database, `customStudents/deleted/${studentId}`), true);
    
    // Also try to remove from 'added' node to save space for newly added students
    await set(ref(database, `customStudents/added/${studentId}`), null);
    
    return true;
  } catch (error) {
    console.error("Failed to remove student:", error);
    return false;
  }
};
