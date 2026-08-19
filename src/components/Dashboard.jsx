import React from 'react';

const Dashboard = ({ total, present, absent }) => {
  return (
    <div className="dashboard">
      <div className="dash-card">
        <div className="dash-title">Total Students</div>
        <div className="dash-value val-total">{total}</div>
      </div>
      <div className="dash-card">
        <div className="dash-title">Presenties</div>
        <div className="dash-value val-present">{present}</div>
      </div>
      <div className="dash-card">
        <div className="dash-title">Absenties</div>
        <div className="dash-value val-absent">{absent}</div>
      </div>
    </div>
  );
};

export default Dashboard;
