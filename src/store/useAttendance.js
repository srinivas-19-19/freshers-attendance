import { useState, useEffect, useCallback } from 'react';
import { 
  subscribeToAttendance, 
  saveAttendance, 
  saveBulkAttendance, 
  restoreBulkAttendance 
} from '../services/attendanceService';
import { STATUSES } from '../config/constants';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  
  // Undo state
  const [undoData, setUndoData] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAttendance((data) => {
      setAttendance(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getStudentStatus = useCallback((dateId, sessionId, studentId) => {
    return attendance?.[dateId]?.[sessionId]?.[studentId] || STATUSES.NOT_MARKED;
  }, [attendance]);

  const markAttendance = async (dateId, sessionId, studentId, status) => {
    // Optimistic UI update
    const previousStatus = getStudentStatus(dateId, sessionId, studentId);
    
    setAttendance(prev => {
      const newData = { ...prev };
      if (!newData[dateId]) newData[dateId] = {};
      if (!newData[dateId][sessionId]) newData[dateId][sessionId] = {};
      newData[dateId][sessionId][studentId] = status;
      return newData;
    });

    const success = await saveAttendance(dateId, sessionId, studentId, status);
    if (success) {
      showToast('Saved');
    } else {
      showToast('Failed to save');
      // Revert optimistic update
      setAttendance(prev => {
        const newData = { ...prev };
        newData[dateId][sessionId][studentId] = previousStatus;
        return newData;
      });
    }
  };

  const markAllPresent = async (dateId, sessionId, studentsInRoom) => {
    const previousStates = {};
    const studentIds = studentsInRoom.map(s => s.id);
    
    studentIds.forEach(id => {
      previousStates[id] = getStudentStatus(dateId, sessionId, id);
    });

    // Optimistic UI update
    setAttendance(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone for safety
      if (!newData[dateId]) newData[dateId] = {};
      if (!newData[dateId][sessionId]) newData[dateId][sessionId] = {};
      
      studentIds.forEach(id => {
        newData[dateId][sessionId][id] = STATUSES.PRESENT;
      });
      return newData;
    });

    const success = await saveBulkAttendance(dateId, sessionId, studentIds, STATUSES.PRESENT);
    
    if (success) {
      showToast('Room marked present');
      // Enable undo for 10 seconds
      const actionTimestamp = Date.now();
      setUndoData({ dateId, sessionId, previousStates, timestamp: actionTimestamp });
      setTimeout(() => {
        setUndoData(prev => prev && prev.timestamp === actionTimestamp ? null : prev);
      }, 10000);
    } else {
      showToast('Failed to mark room');
      // We would want to revert here ideally by re-fetching or reverting local state
    }
  };

  const undoBulkAction = async () => {
    if (!undoData) return;
    const { dateId, sessionId, previousStates } = undoData;
    
    // Optimistic restore
    setAttendance(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      Object.keys(previousStates).forEach(id => {
         newData[dateId][sessionId][id] = previousStates[id];
      });
      return newData;
    });

    const success = await restoreBulkAttendance(dateId, sessionId, previousStates);
    if (success) {
      showToast('Action undone');
    } else {
      showToast('Failed to undo');
    }
    setUndoData(null);
  };

  return {
    attendance,
    loading,
    toastMsg,
    undoData,
    getStudentStatus,
    markAttendance,
    markAllPresent,
    undoBulkAction,
  };
};
