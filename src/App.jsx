import React, { useState, useMemo, useEffect } from 'react';
import initialStudentsData from './data/students.json';
import { subscribeToCustomStudents, addStudentToFirebase, removeStudentFromFirebase } from './services/studentService';
import { useAttendance } from './store/useAttendance';
import { SESSIONS } from './config/constants';
import { getTodayDateString } from './utils/dateUtils';

import AttendanceHeader from './components/AttendanceHeader';
import DateNavigator from './components/DateNavigator';
import SessionSelector from './components/SessionSelector';
import SearchStudent from './components/SearchStudent';
import RoomFilter from './components/RoomFilter';
import RoomSection from './components/RoomSection';
import Toast from './components/Toast';
import PrintPreview from './components/PrintPreview';
import PrintRegister from './components/PrintRegister';
import AddStudentModal from './components/AddStudentModal';
import DeleteStudentModal from './components/DeleteStudentModal';

import './index.css';

function App() {
  const { 
    attendance, 
    toastMsg, 
    undoData, 
    getStudentStatus, 
    markAttendance, 
    markAllPresent, 
    undoBulkAction 
  } = useAttendance();

  const [students, setStudents] = useState(initialStudentsData);
  
  useEffect(() => {
    const unsubscribe = subscribeToCustomStudents((updatedStudents) => {
      setStudents(updatedStudents);
    });
    return () => unsubscribe();
  }, []);
  
  const addStudent = async (name, rollNumber) => {
    const newId = `student_${Date.now()}`;
    let maxSNo = students.reduce((max, s) => (s.sNo && s.sNo > max ? s.sNo : max), 0);
    // Ensure newly added students start from 434 if maxSNo is below 433
    maxSNo = Math.max(433, maxSNo);
    
    const newStudent = {
      id: newId,
      sNo: maxSNo + 1,
      name,
      rollNumber: rollNumber || '',
      room: '10405'
    };
    // Optimistic update
    setStudents(prev => [...prev, newStudent]);
    // Save to Firebase
    await addStudentToFirebase(newStudent);
  };

  const deleteStudent = async (studentId) => {
    // Optimistic update
    setStudents(prev => prev.filter(s => s.id !== studentId));
    // Save to Firebase
    await removeStudentFromFirebase(studentId);
  };
  
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedSession, setSelectedSession] = useState(SESSIONS[0].id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState(null);
  
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showDeleteStudent, setShowDeleteStudent] = useState(false);
  const [printDate, setPrintDate] = useState(selectedDate);

  // Keep print date in sync if preview isn't open
  useEffect(() => {
    if (!showPrintPreview) {
      setPrintDate(selectedDate);
    }
  }, [selectedDate, showPrintPreview]);

  // Group and filter logic
  const { rooms, filteredStudents } = useMemo(() => {
    let filtered = students;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => {
        const roll = (s.rollNumber || s.admnNo || s.id).toLowerCase();
        return s.name.toLowerCase().includes(q) || roll.includes(q);
      });
    }

    if (selectedRoomFilter) {
      filtered = filtered.filter(s => s.room === selectedRoomFilter);
    }

    const grouped = {};
    filtered.forEach(student => {
      if (!grouped[student.room]) {
        grouped[student.room] = [];
      }
      grouped[student.room].push(student);
    });

    // Determine rooms from the actual data so we aren't hardcoding 10101 if it changes later
    const availableRoomIds = Object.keys(grouped).sort();
    
    const processedRooms = availableRoomIds
      .map(roomId => {
        const studentsInRoom = grouped[roomId] || [];
        const range = studentsInRoom.length > 0 
            ? `${studentsInRoom[0].sNo}-${studentsInRoom[studentsInRoom.length - 1].sNo}` 
            : '';
        return {
          id: roomId,
          range: range,
          students: studentsInRoom
        };
      })
      .filter(room => room.students.length > 0);

    return { rooms: processedRooms, filteredStudents: filtered };
  }, [searchQuery, selectedRoomFilter, students]);

  const curriedGetStudentStatus = (studentId) => {
    return getStudentStatus(selectedDate, selectedSession, studentId);
  };

  const curriedMarkAttendance = (studentId, status) => {
    markAttendance(selectedDate, selectedSession, studentId, status);
  };

  const curriedMarkAllPresent = (studentsInRoom) => {
    markAllPresent(selectedDate, selectedSession, studentsInRoom);
  };

  const executePrint = () => {
    setShowPrintPreview(false);
    window.print();
  };

  const handleAddStudent = (name, rollNumber) => {
    addStudent(name, rollNumber);
  };

  return (
    <div className="app-container">
      <div className="no-print">
        <AttendanceHeader onPrintClick={() => setShowPrintPreview(true)} />
        
        <DateNavigator 
          selectedDateId={selectedDate} 
          onDateChange={setSelectedDate} 
        />
        
        <SessionSelector 
          selectedDateId={selectedDate} 
          selectedSessionId={selectedSession} 
          onSessionChange={setSelectedSession} 
        />
        
        <div className="controls-container">
          <SearchStudent searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <RoomFilter 
            rooms={rooms.map(r => ({id: r.id}))} 
            selectedRoom={selectedRoomFilter} 
            onRoomChange={setSelectedRoomFilter} 
          />
          <button className="btn-add-student" onClick={() => setShowAddStudent(true)}>
            ➕ Add Student
          </button>
          <button className="btn-add-student" style={{ color: '#dc2626' }} onClick={() => setShowDeleteStudent(true)}>
            🗑️ Delete Student
          </button>
        </div>

        <main className="main-content">
          {rooms.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? `No student found for "${searchQuery}".` : 'No students found.'}
            </div>
          ) : (
            rooms.map((room, index) => (
              <RoomSection
                key={room.id}
                room={room}
                students={room.students}
                getStudentStatus={curriedGetStudentStatus}
                onMarkAttendance={curriedMarkAttendance}
                onMarkAllPresent={curriedMarkAllPresent}
                defaultExpanded={index === 0}
              />
            ))
          )}
        </main>
        
        <Toast message={toastMsg} undoAction={undoData ? undoBulkAction : null} />

        {showPrintPreview && (
          <PrintPreview 
            selectedPrintDate={printDate}
            onDateChange={setPrintDate}
            onCancel={() => setShowPrintPreview(false)} 
            onPrint={executePrint} 
          />
        )}

        {showAddStudent && (
          <AddStudentModal 
            onClose={() => setShowAddStudent(false)}
            onAdd={handleAddStudent}
          />
        )}

        {showDeleteStudent && (
          <DeleteStudentModal 
            students={students}
            onClose={() => setShowDeleteStudent(false)}
            onDelete={deleteStudent}
          />
        )}
      </div>

      <PrintRegister 
        printDate={printDate}
        rooms={rooms.length > 0 ? rooms : []} 
        students={students} 
        getStudentStatus={getStudentStatus} 
      />
    </div>
  );
}

export default App;
