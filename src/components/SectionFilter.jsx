import React from 'react';

const SectionFilter = ({ sections, selectedSection, onSectionChange }) => {
  return (
    <div className="section-filter-container">
      <select 
        className="section-filter-select"
        value={selectedSection || 'ALL'}
        onChange={(e) => onSectionChange(e.target.value === 'ALL' ? null : e.target.value)}
      >
        <option value="ALL">ALL SECTIONS</option>
        {sections.map(section => (
          <option key={section.id} value={section.id}>SECTION {section.id}</option>
        ))}
      </select>
    </div>
  );
};

export default SectionFilter;
