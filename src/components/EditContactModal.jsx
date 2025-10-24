import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

const EditContactModal = ({ 
  showEditContact, 
  setShowEditContact, 
  editContact, 
  setEditContact, 
  handleEditContact 
}) => {
  if (!showEditContact) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowEditContact(false)}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Contact</h3>
          <button
            className="close-btn"
            onClick={() => setShowEditContact(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={editContact.name}
              onChange={(e) => setEditContact(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={editContact.phone}
              onChange={(e) => setEditContact(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editContact.email}
              onChange={(e) => setEditContact(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={editContact.address}
              onChange={(e) => setEditContact(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Relation</label>
            <select
              value={editContact.relation}
              onChange={(e) => setEditContact(prev => ({ ...prev, relation: e.target.value }))}
            >
              <option value="">Select relation</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            className="action-btn secondary"
            onClick={() => setShowEditContact(false)}
          >
            Cancel
          </button>
          <button
            className="action-btn primary"
            onClick={handleEditContact}
            disabled={!editContact.name || !editContact.phone}
          >
            <FontAwesomeIcon icon={faEdit} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;