import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const FilterPanel = ({ 
  showFilter, 
  filterTag, 
  setFilterTag, 
  setShowFilter, 
  contacts 
}) => {
  if (!showFilter) return null;

  const getAllTags = () => {
    const tagSet = new Set();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const availableTags = getAllTags();

  const handleClearAndClose = () => {
    setFilterTag('');
    setShowFilter(false);
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h4>Filter Contacts</h4>
        <button
          className="close-btn small"
          onClick={() => setShowFilter(false)}
          title="Close"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div className="filter-content">
        <div className="filter-group">
          <label>Filter by Tag:</label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-actions">
          <button
            className="action-btn secondary small"
            onClick={handleClearAndClose}
            title="Clear filter and close"
          >
            Clear Filter
          </button>
          <button
            className="action-btn primary small"
            onClick={handleApplyFilter}
            title="Apply current filter"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;