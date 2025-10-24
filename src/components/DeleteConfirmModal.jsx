import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const DeleteConfirmModal = ({ 
  showDeleteConfirm, 
  deleteType, 
  selectedContacts, 
  contactToDelete, 
  cancelDelete, 
  confirmDelete 
}) => {
  if (!showDeleteConfirm) return null;

  const getDeleteMessage = () => {
    if (deleteType === 'bulk') {
      return `Are you sure you want to delete ${selectedContacts.size} contact${selectedContacts.size !== 1 ? 's' : ''}?`;
    } else if (contactToDelete) {
      return `Are you sure you want to delete ${contactToDelete.name}?`;
    }
    return 'Are you sure you want to delete this contact?';
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cancelDelete()}>
      <div className="modal-content delete-confirm-modal">
        <div className="modal-header">
          <h3>Delete Contact{deleteType === 'bulk' && selectedContacts.size > 1 ? 's' : ''}</h3>
          <button
            className="close-btn"
            onClick={cancelDelete}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="delete-confirm-content">
            <p className="delete-message">{getDeleteMessage()}</p>
            <p className="delete-warning">This action cannot be undone.</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            className="action-btn secondary"
            onClick={cancelDelete}
          >
            Cancel
          </button>
          <button
            className="action-btn danger"
            onClick={confirmDelete}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;