import React from 'react';

const Toast = ({ message, undoAction }) => {
  if (!message && !undoAction) return null;

  return (
    <div className={`toast-container ${message || undoAction ? 'visible' : ''}`}>
      <div className="toast">
        <span className="toast-message">{message || 'Action completed'}</span>
        {undoAction && (
          <button className="btn-undo" onClick={undoAction}>
            UNDO
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
