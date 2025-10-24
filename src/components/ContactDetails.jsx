import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faBirthdayCake, 
  faGlobe, 
  faUser, 
  faTags, 
  faComments, 
  faTrash 
} from '@fortawesome/free-solid-svg-icons';

const ContactDetails = ({ 
  selectedContact, 
  setSelectedContact, 
  getInitials, 
  getRandomColor, 
  getTagStyle, 
  openDeleteConfirm 
}) => {
  if (!selectedContact) return null;

  return (
    <div className="contact-details-panel">
      <div className="contact-header">
        <button
          className="close-btn"
          onClick={() => setSelectedContact(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="contact-avatar-large" style={{ backgroundColor: getRandomColor(selectedContact.name) }}>
          {getInitials(selectedContact.name)}
        </div>
        <h2>{selectedContact.name}</h2>
        <p className="relation-text">{selectedContact.relation}</p>
      </div>

      <div className="contact-info-section">
        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faPhone} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content">
            <span className="info-label">Phone</span>
            <span className="info-value">{selectedContact.phone}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content">
            <span className="info-label">Email</span>
            <span className="info-value">{selectedContact.email}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content">
            <span className="info-label">Address</span>
            <span className="info-value">{selectedContact.address}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faBirthdayCake} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content">
            <span className="info-label">Birthday</span>
            <span className="info-value">Not specified</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content">
            <span className="info-label">Website</span>
            <span className="info-value">Not specified</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content">
            <span className="info-label">Relation</span>
            <span className="info-value">{selectedContact.relation}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FontAwesomeIcon icon={faTags} />
          </div>
          <div className="info-separator"></div>
          <div className="info-content info-content-horizontal">
            <span className="info-label">Tags</span>
            <div className="tags-container">
              {selectedContact.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag-large"
                  style={getTagStyle(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="contact-actions">
        <button className="action-btn primary">
          <FontAwesomeIcon icon={faPhone} /> Call
        </button>
        <button className="action-btn secondary greyish">
          <FontAwesomeIcon icon={faComments} /> Message
        </button>
        <button className="action-btn secondary greyish">
          <FontAwesomeIcon icon={faEnvelope} /> Email
        </button>
        <button 
          className="action-btn tertiary delete-icon-only inline"
          onClick={() => {
            openDeleteConfirm(selectedContact, 'single');
          }}
          title="Delete contact"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default ContactDetails;