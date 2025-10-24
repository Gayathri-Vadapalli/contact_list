import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ContactCard = ({ 
  contact, 
  viewMode, 
  selectMode, 
  selectedContacts, 
  activeDropdown, 
  handleContactSelect, 
  setSelectedContact, 
  setActiveDropdown, 
  openEditModal, 
  openDeleteConfirm, 
  getInitials, 
  getRandomColor, 
  getTagStyle 
}) => {
  const isSelected = selectedContacts.has(contact.id);
  const isDropdownActive = activeDropdown === contact.id;
  
  const handleCardClick = (e) => {
    if (selectMode) {
      e.stopPropagation();
      handleContactSelect(contact, !isSelected);
    } else {
      setSelectedContact(contact);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    handleContactSelect(contact, !isSelected);
  };

  const handleDotsClick = (e) => {
    e.stopPropagation();
    setActiveDropdown(isDropdownActive ? null : contact.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setActiveDropdown(null);
    openEditModal(contact);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setActiveDropdown(null);
    openDeleteConfirm(contact, 'single');
  };

  return (
    <div
      className={`contact-card ${viewMode} ${selectMode ? 'select-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      {selectMode && (
        <div className="contact-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxClick}
            onClick={handleCheckboxClick}
          />
        </div>
      )}
      
      {!selectMode && (
        <div className="contact-menu">
          <button 
            className="contact-menu-btn"
            onClick={handleDotsClick}
            title="More options"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
          {isDropdownActive && (
            <div className="contact-menu-dropdown">
              <button 
                className="contact-menu-item"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
              <button 
                className="contact-menu-item delete"
                onClick={handleDeleteClick}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="contact-avatar" style={{ backgroundColor: getRandomColor(contact.name) }}>
        {getInitials(contact.name)}
      </div>
      <div className="contact-info">
        <div className="contact-main-info">
          <div className="contact-left">
            <h3 className="contact-name">{contact.name}</h3>
            <p className="contact-phone">{contact.phone}</p>
          </div>
          {viewMode === 'list' && (
            <div className="contact-right">
              <p className="contact-relation">{contact.relation}</p>
              <p className="contact-email">{contact.email}</p>
            </div>
          )}
        </div>
        {viewMode === 'grid' && (
          <>
            <p className="contact-relation">{contact.relation}</p>
            <div className="contact-tags">
              {contact.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag"
                  style={getTagStyle(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactCard;