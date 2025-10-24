import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const BulkActionsBar = ({ 
  selectMode, 
  selectedContacts, 
  contacts, 
  openEditModal, 
  handleBulkDelete 
}) => {
  if (!selectMode || selectedContacts.size === 0) return null;

  return (
    <div className="bulk-actions-bar">
      <div className="bulk-actions-left">
        <span className="selected-count">
          {selectedContacts.size} contact{selectedContacts.size !== 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="bulk-actions-right">
        <div className="bulk-action-edit-container">
          {selectedContacts.size === 1 ? (
            <button 
              className="bulk-action-btn edit"
              title="Edit contact"
              onClick={() => {
                const contactId = Array.from(selectedContacts)[0];
                const contact = contacts.find(c => c.id === contactId);
                if (contact) {
                  openEditModal(contact);
                }
              }}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          ) : (
            <div className="bulk-action-placeholder"></div>
          )}
        </div>
        <button 
          className="bulk-action-btn delete"
          onClick={handleBulkDelete}
          title="Delete contacts"
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;