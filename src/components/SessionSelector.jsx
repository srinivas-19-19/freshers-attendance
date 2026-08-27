import React from 'react';
import { SESSIONS } from '../config/constants';


const SessionSelector = ({ selectedDateId, selectedSessionId, onSessionChange }) => {
  return (
    <div className="session-header">
      <div className="session-tabs">
        {SESSIONS.map(session => {
          const isActive = session.id === selectedSessionId;
          return (
            <button
              key={session.id}
              className={`session-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSessionChange(session.id)}
            >
              <div className="session-label">
                {session.id === 'forenoon' ? '☀ ' : ''}{session.label}
              </div>
              {isActive && <div className="session-time">{session.time}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SessionSelector;
