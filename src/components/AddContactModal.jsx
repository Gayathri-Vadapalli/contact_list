import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

const AddContactModal = ({ 
  showAddContact, 
  setShowAddContact, 
  newContact, 
  setNewContact, 
  handleAddContact 
}) => {
  if (!showAddContact) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddContact(false)}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Contact</h3>
          <button
            className="close-btn"
            onClick={() => setShowAddContact(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={newContact.address}
              onChange={(e) => setNewContact(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label>Relation</label>
            <select
              value={newContact.relation}
              onChange={(e) => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
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
            onClick={() => setShowAddContact(false)}
          >
            Cancel
          </button>
          <button
            className="action-btn primary"
            onClick={handleAddContact}
            disabled={!newContact.name || !newContact.phone}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;