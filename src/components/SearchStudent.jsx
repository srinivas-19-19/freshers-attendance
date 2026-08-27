import React from 'react';

const SearchStudent = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search by name or roll number..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchStudent;
