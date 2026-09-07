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
import SectionFilter from './components/SectionFilter';
import SectionGroup from './components/SectionGroup';
import Toast from './components/Toast';
import PrintPreview from './components/PrintPreview';
import PrintRegister from './components/PrintRegister';
import AddStudentModal from './components/AddStudentModal';
import DeleteStudentModal from './components/DeleteStudentModal';
import BackToTop from './components/BackToTop';

import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const { 
    attendance, 
    toastMsg, 
    undoData, 
    getStudentStatus, 
    markAttendance, 
    markAllPresent,
    clearAllAttendance,
    undoBulkAction 
  } = useAttendance();

  const [students, setStudents] = useState(initialStudentsData);
  
  useEffect(() => {
    const unsubscribe = subscribeToCustomStudents((updatedStudents) => {
      setStudents(updatedStudents);
    });
    return () => unsubscribe();
  }, []);
  
  const addStudent = async (name, rollNumber, section) => {
    const newId = `student_${Date.now()}`;
    let maxSNo = students.reduce((max, s) => (s.sNo && s.sNo > max ? s.sNo : max), 0);
    
    const newStudent = {
      id: newId,
      sNo: maxSNo + 1,
      name,
      rollNumber: rollNumber || '',
      section: section,
      room: {'A':'10101','B':'10102','C':'10103','D':'10104','E':'10105','F':'10106','G':'10108'}[section]
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
  const [selectedSectionFilter, setSelectedSectionFilter] = useState(null);
  
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
  const { sections, filteredStudents } = useMemo(() => {
    let filtered = students;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => {
        const roll = (s.rollNumber || s.admnNo || s.id).toLowerCase();
        return s.name.toLowerCase().includes(q) || roll.includes(q);
      });
    }

    if (selectedSectionFilter) {
      filtered = filtered.filter(s => s.section === selectedSectionFilter);
    }

    const grouped = {};
    filtered.forEach(student => {
      if (!grouped[student.section]) {
        grouped[student.section] = [];
      }
      grouped[student.section].push(student);
    });

    // Determine rooms from the actual data so we aren't hardcoding 10101 if it changes later
    const availableSectionIds = Object.keys(grouped).sort();
    
    const processedSections = availableSectionIds
      .map(sectionId => {
        const studentsInSection = grouped[sectionId] || [];
        const range = studentsInSection.length > 0 
            ? `${studentsInSection[0].sNo}-${studentsInSection[studentsInSection.length - 1].sNo}` 
            : '';
        return {
          id: sectionId,
          room: studentsInSection.length > 0 ? studentsInSection[0].room : '',
          range: range,
          students: studentsInSection
        };
      })
      .filter(section => section.students.length > 0);

    return { sections: processedSections, filteredStudents: filtered };
  }, [searchQuery, selectedSectionFilter, students]);

  const curriedGetStudentStatus = (studentId) => {
    return getStudentStatus(selectedDate, selectedSession, studentId);
  };

  const curriedMarkAttendance = (studentId, status) => {
    markAttendance(selectedDate, selectedSession, studentId, status);
  };

  const curriedMarkAllPresent = (studentsInSection) => {
    markAllPresent(selectedDate, selectedSession, studentsInSection);
  };

  const curriedClearAllAttendance = (studentsInSection) => {
    clearAllAttendance(selectedDate, selectedSession, studentsInSection);
  };

  const executePrint = () => {
    setShowPrintPreview(false);
    window.print();
  };

  const handleAddStudent = (name, rollNumber, section) => {
    addStudent(name, rollNumber, section);
  };

  return (
    <div className="app-container">
      <div className="no-print">
        <AttendanceHeader 
          onPrintClick={() => setShowPrintPreview(true)} 
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
        
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
          <SectionFilter 
            sections={sections.map(s => ({id: s.id}))} 
            selectedSection={selectedSectionFilter} 
            onSectionChange={setSelectedSectionFilter} 
          />
          <button className="btn-add-student" onClick={() => setShowAddStudent(true)}>
            ➕ Add Student
          </button>
          <button className="btn-add-student" style={{ color: '#dc2626' }} onClick={() => setShowDeleteStudent(true)}>
            🗑️ Delete Student
          </button>
        </div>

        <main className="main-content">
          {sections.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? `No student found for "${searchQuery}".` : 'No students found.'}
            </div>
          ) : (
            sections.map((section, index) => (
              <SectionGroup
                key={section.id}
                section={section}
                students={section.students}
                getStudentStatus={curriedGetStudentStatus}
                onMarkAttendance={curriedMarkAttendance}
                onMarkAllPresent={curriedMarkAllPresent}
                onClearAll={curriedClearAllAttendance}
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
        sections={sections.length > 0 ? sections : []} 
        students={students} 
        getStudentStatus={getStudentStatus} 
      />
      
      <BackToTop />
    </div>
  );
}

export default App;
