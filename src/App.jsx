import React, { useState, useEffect, useMemo } from 'react';
import studentsData from './data/students.json';
import Dashboard from './components/Dashboard';
import StudentRow from './components/StudentRow';
import './index.css';

function App() {
  const [attendance, setAttendance] = useState({});
  const [metaData, setMetaData] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || '/api/attendance';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (data.attendance) setAttendance(data.attendance);
        if (data.metaData) setMetaData(data.metaData);
      })
      .catch(err => console.error("Could not load data from server", err));
  }, []);

  const saveToServer = (newAttendance, newMeta) => {
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ attendance: newAttendance, metaData: newMeta }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error("Could not save to server", err));
  };

  const handleAttendanceChange = (studentId, status) => {
    const newAttendance = { ...attendance, [studentId]: status };
    if (status === null) {
      delete newAttendance[studentId];
    }
    setAttendance(newAttendance);
    saveToServer(newAttendance, metaData);
  };

  const handleMetaChange = (roomId, field, value) => {
    const newMeta = {
      ...metaData,
      [roomId]: {
        ...(metaData[roomId] || {}),
        [field]: value
      }
    };
    setMetaData(newMeta);
    saveToServer(attendance, newMeta);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals
  const totalStudents = studentsData.length;
  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  // Group students by room
  const rooms = useMemo(() => {
    const grouped = {};
    studentsData.forEach(student => {
      if (!grouped[student.room]) {
        grouped[student.room] = [];
      }
      grouped[student.room].push(student);
    });
    // Ensure the order matches room allotments 10101 -> 10201
    const orderedRooms = ['10101', '10102', '10103', '10104', '10105', '10106', '10201'];
    
    return orderedRooms.map(room => ({
      id: room,
      students: grouped[room] || []
    })).filter(room => room.students.length > 0);
  }, []);

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const getRoomLabel = (room) => {
    if (room === '10101') return 'Room 10101 (CSE 1-60)';
    if (room === '10102') return 'Room 10102 (CSE 61-120)';
    if (room === '10103') return 'Room 10103 (CSE 121-180)';
    if (room === '10104') return 'Room 10104 (CSE 181-240)';
    if (room === '10105') return 'Room 10105 (CSE 241-300)';
    if (room === '10106') return 'Room 10106 (CSE 301-360)';
    if (room === '10201') return 'Room 10201 (CSE 361-433)';
    return `Room ${room}`;
  };

  const getRoomStats = (roomStudents) => {
    const total = roomStudents.length;
    const present = roomStudents.filter(s => attendance[s.id] === 'present').length;
    const absent = roomStudents.filter(s => attendance[s.id] === 'absent').length;
    return { total, present, absent };
  };

  const activeRoomData = rooms.find(r => r.id === activeRoom);

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="title">Student Attendance</h1>
        <button className="print-btn" onClick={handlePrint}>Print Hard Copy</button>
      </div>

      <Dashboard 
        total={totalStudents} 
        present={presentCount} 
        absent={absentCount} 
      />

      <div className="tabs-container">
        {rooms.map(room => {
          const stats = getRoomStats(room.students);
          const isActive = activeRoom === room.id;
          
          return (
            <button 
              key={room.id}
              className={`room-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveRoom(isActive ? null : room.id)}
            >
              <div className="tab-label">{getRoomLabel(room.id)}</div>
              <div className="room-stats">
                <span className="stat-badge total">Total: {stats.total}</span>
                <span className="stat-badge present">P: {stats.present}</span>
                <span className="stat-badge absent">A: {stats.absent}</span>
              </div>
            </button>
          );
        })}
      </div>

      {activeRoomData && (
        <div className="active-room-content">
          <div className="meta-inputs">
            <input 
              type="text" 
              placeholder="Assigned Faculty 1 (e.g. Dr.R Vijayalakshmi)" 
              value={metaData[activeRoom]?.faculty1 || ''} 
              onChange={e => handleMetaChange(activeRoom, 'faculty1', e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Assigned Faculty 2" 
              value={metaData[activeRoom]?.faculty2 || ''} 
              onChange={e => handleMetaChange(activeRoom, 'faculty2', e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Assigned Volunteer 1" 
              value={metaData[activeRoom]?.volunteer1 || ''} 
              onChange={e => handleMetaChange(activeRoom, 'volunteer1', e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Assigned Volunteer 2" 
              value={metaData[activeRoom]?.volunteer2 || ''} 
              onChange={e => handleMetaChange(activeRoom, 'volunteer2', e.target.value)}
            />
          </div>
          <table className="student-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Admn No</th>
                <th>Name of the Student</th>
                <th>Mobile Number</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {activeRoomData.students.map(student => (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  status={attendance[student.id]}
                  onChange={handleAttendanceChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hidden container that only shows during printing */}
      <div className="print-only">
        {rooms.map(room => {
          const chunks = chunkArray(room.students, 30);
          return chunks.map((chunk, index) => (
            <div key={`${room.id}-page-${index}`} className="print-page">
              <div className="print-pdf-header">
                <h2 className="pdf-title">SRI VENKATESWARA COLLEGE OF ENGINEERING :: TIRUPATI</h2>
                <h3 className="pdf-subtitle">
                  {chunk[0]?.branch} – A.Y. 2026–27 | Student Orientation / Volunteer & Faculty Signature Sheet
                </h3>
                <div className="pdf-room-label">Allotment: {getRoomLabel(room.id)} (Page {index + 1} of {chunks.length})</div>
              </div>
              <table className="student-table pdf-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Admn No</th>
                    <th>Name of the Student</th>
                    <th>Gender</th>
                    <th>Cert.</th>
                    <th>Student Mobile</th>
                    <th>Parent Mobile</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.map(student => {
                    const status = attendance[student.id];
                    const statusText = status === 'present' ? 'Present' : (status === 'absent' ? 'Absent' : '');
                    return (
                      <tr key={student.id}>
                        <td>{student.sNo}</td>
                        <td>{student.admnNo || ''}</td>
                        <td className="text-left">{student.name}</td>
                        <td>{student.gender}</td>
                        <td>{student.cert}</td>
                        <td>{student.studentMobile}</td>
                        <td>{student.parentMobile}</td>
                        <td className="attendance-cell">{statusText}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table className="pdf-footer-table">
                <tbody>
                  <tr>
                    <td>
                      Assigned Faculty 1: <strong>{metaData[room.id]?.faculty1 || '__________________________'}</strong><br/><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2: <strong>{metaData[room.id]?.faculty2 || '__________________________'}</strong>
                    </td>
                    <td>
                      Assigned Volunteer: 1. <strong>{metaData[room.id]?.volunteer1 || '__________________________'}</strong><br/><br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. <strong>{metaData[room.id]?.volunteer2 || '__________________________'}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Faculty Signature: __________________________</td>
                    <td>Volunteer Signature: __________________________</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ));
        })}
      </div>
    </div>
  );
}

export default App;
