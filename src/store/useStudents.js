import { useState, useEffect } from 'react';
import { subscribeToStudents, addStudentToFirebase, removeStudentFromFirebase } from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStudents((data) => {
      setStudents(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addStudent = async (name, rollNumber) => {
    // Generate an ID (like a UUID or timestamp based to be safe)
    const newId = `student_${Date.now()}`;
    
    // Calculate new S.NO
    const maxSNo = students.reduce((max, s) => (s.sNo && s.sNo > max ? s.sNo : max), 0);
    const newSNo = maxSNo + 1;

    const newStudent = {
      id: newId,
      sNo: newSNo,
      name: name,
      rollNumber: rollNumber || '', // Optional
      room: '10201' // Hardcoded based on new requirement
    };

    // Optimistic update
    setStudents(prev => [...prev, newStudent]);

    // Save to Firebase
    const success = await addStudentToFirebase(newStudent);
    if (!success) {
      // Revert if failed
      setStudents(prev => prev.filter(s => s.id !== newId));
      return { success: false, message: 'Failed to add student.' };
    }
    return { success: true, message: 'Student added successfully.' };
  };

  const deleteStudent = async (studentId) => {
    // Optimistic delete
    const previousStudents = [...students];
    setStudents(prev => prev.filter(s => s.id !== studentId));

    const success = await removeStudentFromFirebase(studentId);
    if (!success) {
      // Revert
      setStudents(previousStudents);
      return { success: false, message: 'Failed to delete student.' };
    }
    return { success: true, message: 'Student removed.' };
  };

  return {
    students,
    isLoading,
    addStudent,
    deleteStudent
  };
};
