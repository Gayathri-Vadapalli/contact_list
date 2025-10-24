import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import contactData from './contact_list.json';
import './ContactScreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faTh, 
  faList, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faBirthdayCake, 
  faUser, 
  faTimes,
  faCalendarAlt,
  faComments,
  faSms,
  faTags,
  faHome,
  faBuilding,
  faHeart,
  faUserFriends,
  faBriefcase,
  faGamepad,
  faCode,
  faFootballBall,
  faUsers,
  faPlus,
  faEdit,
  faTrash,
  faStar,
  faBookmark,
  faFilter,
  faDownload,
  faUpload,
  faCog,
  faShareAlt,
  faPrint,
  faEye,
  faEyeSlash,
  faInfo,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
  faUserMinus,
  faUserEdit,
  faUserCheck,
  faAddressCard,
  faIdBadge,
  faGlobe,
  faLink,
  faCopy,
  faCheck,
  faExternalLinkAlt,
  faChevronLeft,
  faChevronRight,
  faStepBackward,
  faStepForward,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const ContactScreen = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [showAddContact, setShowAddContact] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('single'); // 'single' or 'bulk'
  const [showFilter, setShowFilter] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [contacts, setContacts] = useState(() => {
    // Add IDs to contacts if they don't have them
    return contactData.contacts.map((contact, index) => ({
      ...contact,
      id: contact.id || `contact-${index}`
    }));
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    relation: '',
    tags: []
  });
  const [editContact, setEditContact] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    relation: '',
    tags: []
  });

  const filterRef = useRef(null);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTag]);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
      // Close contact menu dropdown when clicking outside
      if (activeDropdown && !event.target.closest('.contact-menu')) {
        setActiveDropdown(null);
      }
    };

    if (showFilter || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFilter, activeDropdown]);

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.phone.includes(searchTerm) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterTag === '' || contact.tags.includes(filterTag);
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    return filtered;
  }, [contacts, searchTerm, sortOrder, filterTag]);

  // Get paginated contacts for display
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedContacts.slice(startIndex, endIndex);
  }, [filteredAndSortedContacts, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedContacts.length / itemsPerPage);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRandomColor = (name) => {
    const colors = ['#7C3AED', '#A78BFA', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getTagColor = (tag) => {
    const tagColors = {
      'Family': '#10B981',
      'Friends': '#7C3AED',
      'Job': '#F59E0B',
      'Sports': '#06B6D4',
      'Gaming': '#EC4899',
      'Developers': '#8B5CF6',
      'Designers': '#A78BFA'
    };
    return tagColors[tag] || '#CBD5E1';
  };

  const getTagStyle = (tag) => {
    const baseColor = getTagColor(tag);
    return {
      backgroundColor: `${baseColor}20`, // Add 20% opacity
      color: baseColor
    };
  };

  // Handler functions
  const handleAddContact = useCallback(() => {
    if (newContact.name && newContact.phone) {
      const contactWithId = {
        ...newContact,
        id: `contact-${Date.now()}` // Use timestamp for unique ID
      };
      setContacts([...contacts, contactWithId]);
      setNewContact({
        name: '',
        phone: '',
        email: '',
        address: '',
        relation: '',
        tags: []
      });
      setShowAddContact(false);
    }
  }, [newContact, contacts]);

  const handleEditContact = useCallback(() => {
    if (editContact.name && editContact.phone) {
      const updatedContacts = contacts.map(contact => 
        contact.id === editContact.id ? editContact : contact
      );
      setContacts(updatedContacts);
      
      // Update selectedContact if it's the one being edited
      if (selectedContact && selectedContact.id === editContact.id) {
        setSelectedContact(editContact);
      }
      
      setEditContact({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        relation: '',
        tags: []
      });
      setShowEditContact(false);
    }
  }, [editContact, contacts, selectedContact]);

  const openEditModal = useCallback((contact) => {
    setEditContact({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      relation: contact.relation,
      tags: contact.tags
    });
    setShowEditContact(true);
  }, []);

  const openDeleteConfirm = useCallback((contact, type = 'single') => {
    setContactToDelete(contact);
    setDeleteType(type);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteType === 'single' && contactToDelete) {
      setContacts(contacts.filter(contact => contact !== contactToDelete));
      if (selectedContact === contactToDelete) {
        setSelectedContact(null);
      }
    } else if (deleteType === 'bulk') {
      setContacts(contacts.filter(contact => !selectedContacts.has(contact.id)));
      setSelectedContacts(new Set());
      if (selectedContact && selectedContacts.has(selectedContact.id)) {
        setSelectedContact(null);
      }
    }
    setShowDeleteConfirm(false);
    setContactToDelete(null);
    setDeleteType('single');
  }, [deleteType, contactToDelete, contacts, selectedContact, selectedContacts]);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setContactToDelete(null);
    setDeleteType('single');
  }, []);

  const handleNameChange = useCallback((e) => {
    setNewContact(prev => ({
      ...prev,
      name: e.target.value
    }));
  }, []);

  const handlePhoneChange = useCallback((e) => {
    setNewContact(prev => ({
      ...prev,
      phone: e.target.value
    }));
  }, []);

  const handleEmailChange = useCallback((e) => {
    setNewContact(prev => ({
      ...prev,
      email: e.target.value
    }));
  }, []);

  const handleAddressChange = useCallback((e) => {
    setNewContact(prev => ({
      ...prev,
      address: e.target.value
    }));
  }, []);

  const handleRelationChange = useCallback((e) => {
    setNewContact(prev => ({
      ...prev,
      relation: e.target.value
    }));
  }, []);

  const handleEditNameChange = useCallback((e) => {
    setEditContact(prev => ({
      ...prev,
      name: e.target.value
    }));
  }, []);

  const handleEditPhoneChange = useCallback((e) => {
    setEditContact(prev => ({
      ...prev,
      phone: e.target.value
    }));
  }, []);

  const handleEditEmailChange = useCallback((e) => {
    setEditContact(prev => ({
      ...prev,
      email: e.target.value
    }));
  }, []);

  const handleEditAddressChange = useCallback((e) => {
    setEditContact(prev => ({
      ...prev,
      address: e.target.value
    }));
  }, []);

  const handleEditRelationChange = useCallback((e) => {
    setEditContact(prev => ({
      ...prev,
      relation: e.target.value
    }));
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSelectModeToggle = useCallback(() => {
    setSelectMode(!selectMode);
    setSelectedContacts(new Set());
  }, [selectMode]);

  const handleContactSelect = useCallback((contact, isSelected) => {
    const newSelectedContacts = new Set(selectedContacts);
    if (isSelected) {
      newSelectedContacts.add(contact.id);
    } else {
      newSelectedContacts.delete(contact.id);
    }
    setSelectedContacts(newSelectedContacts);
  }, [selectedContacts]);

  const handleSelectAll = useCallback(() => {
    if (selectedContacts.size === paginatedContacts.length) {
      // Deselect all
      setSelectedContacts(new Set());
    } else {
      // Select all visible contacts
      const allContactIds = new Set(paginatedContacts.map(contact => contact.id));
      setSelectedContacts(allContactIds);
    }
  }, [selectedContacts.size, paginatedContacts]);

  const handleBulkDelete = useCallback(() => {
    openDeleteConfirm(null, 'bulk');
  }, [openDeleteConfirm]);

  const handleBulkFavorite = useCallback(() => {
    // Add favorite logic here
    alert(`Added ${selectedContacts.size} contact(s) to favorites`);
  }, [selectedContacts.size]);

  const handleBulkShare = useCallback(() => {
    // Add share logic here
    alert(`Sharing ${selectedContacts.size} contact(s)`);
  }, [selectedContacts.size]);

  const getContactTimestamp = (contact, index) => {
    const timestamps = [
      'Added recently',
      'Added 2 days ago',
      'Added 1 week ago',
      'Added 2 weeks ago',
      'Added 1 month ago',
      'Added 3 months ago',
      'Added 6 months ago',
      'Added 1 year ago'
    ];
    
    // Use contact name and index to determine timestamp
    const timestampIndex = (contact.name.charCodeAt(0) + index) % timestamps.length;
    return timestamps[timestampIndex];
  };

  const getAllTags = () => {
    const tagSet = new Set();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const ContactCard = ({ contact }) => {
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

  const AddContactModal = () => {
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
                onChange={handleNameChange}
                placeholder="Enter full name"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={newContact.phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newContact.email}
                onChange={handleEmailChange}
                placeholder="Enter email address"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={newContact.address}
                onChange={handleAddressChange}
                placeholder="Enter address"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Relation</label>
              <select
                value={newContact.relation}
                onChange={handleRelationChange}
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

  const EditContactModal = () => {
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
                onChange={handleEditNameChange}
                placeholder="Enter full name"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={editContact.phone}
                onChange={handleEditPhoneChange}
                placeholder="Enter phone number"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editContact.email}
                onChange={handleEditEmailChange}
                placeholder="Enter email address"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={editContact.address}
                onChange={handleEditAddressChange}
                placeholder="Enter address"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Relation</label>
              <select
                value={editContact.relation}
                onChange={handleEditRelationChange}
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

  const DeleteConfirmModal = () => {
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
  const FilterPanel = () => {
    if (!showFilter) return null;

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

  const ContactDetails = () => {
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

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const maxVisible = 5;
      const halfVisible = Math.floor(maxVisible / 2);
      
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="pagination-controls">
        <button 
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          title="First page"
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        
        <button 
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="pagination-pages">
          {visiblePages[0] > 1 && (
            <>
              <button 
                className="pagination-btn page-number"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {visiblePages[0] > 2 && <span className="pagination-ellipsis">...</span>}
            </>
          )}
          
          {visiblePages.map(page => (
            <button
              key={page}
              className={`pagination-btn page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
              <button 
                className="pagination-btn page-number"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button 
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        
        <button 
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Last page"
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>
      </div>
    );
  };

  const BulkActionsBar = () => {
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

  return (
    <div className="contact-screen">
      <div className={`main-content ${selectedContact ? 'with-panel' : ''}`}>
        {/* Header */}
        <div className="contact-header-bar">
          <div className="header-left">
            <h1>{filteredAndSortedContacts.length} contacts</h1>
          </div>
          
          <div className="header-controls">
            {/* Select Mode Toggle */}
            <button 
              className={`control-btn ${selectMode ? 'active' : ''}`}
              title={selectMode ? "Exit select mode" : "Select contacts"}
              onClick={handleSelectModeToggle}
            >
              <FontAwesomeIcon icon={selectMode ? faTimes : faCheckCircle} />
              {selectMode ? 'Cancel' : 'Select'}
            </button>
            
            {/* Select All Button - only visible in select mode */}
            {selectMode && (
              <button 
                className="control-btn"
                title={selectedContacts.size === paginatedContacts.length ? "Deselect all" : "Select all"}
                onClick={handleSelectAll}
              >
                <FontAwesomeIcon icon={selectedContacts.size === paginatedContacts.length ? faTimesCircle : faCheckCircle} />
                {selectedContacts.size === paginatedContacts.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
            
            {/* Additional Controls */}
            <div className="filter-container" ref={filterRef}>
              <button 
                className={`control-btn ${showFilter ? 'active' : ''}`}
                title="Filter"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
              <FilterPanel />
            </div>
            
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FontAwesomeIcon icon={faTh} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            
            <button 
              className="control-btn primary" 
              title="Create Contact"
              onClick={() => setShowAddContact(true)}
            >
              Create contact <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}

        {/* Bulk Actions Bar */}
        <BulkActionsBar />

        {/* Search and Controls Bar */}
        <div className="controls-bar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search contact"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="results-info">
            <span>Showing</span>
            <select 
              className="results-dropdown"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>of {filteredAndSortedContacts.length} results</span>
            {filteredAndSortedContacts.length > 0 && (
              <span className="page-info">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </div>
        </div>

        {/* Table Header */}
        {viewMode === 'list' ? (
          <div className="table-container">
            <table className="contacts-table">
              <thead>
                <tr>
                  {selectMode && (
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedContacts.size === paginatedContacts.length && paginatedContacts.length > 0}
                        onChange={handleSelectAll}
                        title={selectedContacts.size === paginatedContacts.length ? "Deselect all" : "Select all"}
                      />
                    </th>
                  )}
                  <th className="contact-name-col">
                    CONTACT NAME <FontAwesomeIcon icon={faSort} />
                  </th>
                  <th className="contact-col">
                    CONTACT <FontAwesomeIcon icon={faSort} />
                  </th>
                  <th className="lead-source-col">
                    TAGS <FontAwesomeIcon icon={faSort} />
                  </th>
                  <th className="company-col">
                    ADDRESS <FontAwesomeIcon icon={faSort} />
                  </th>
                  <th className="contact-owner-col">
                    RELATION <FontAwesomeIcon icon={faSort} />
                  </th>
                  {!selectMode && (
                    <th className="actions-col">
                      ACTIONS
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact, index) => {
                  const isSelected = selectedContacts.has(contact.id);
                  
                  const handleRowClick = (e) => {
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

                  return (
                    <tr 
                      key={index} 
                      onClick={handleRowClick}
                      className={`${selectMode ? 'select-mode' : ''} ${isSelected ? 'selected' : ''}`}
                    >
                      {selectMode && (
                        <td className="checkbox-col">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={handleCheckboxClick}
                            onClick={handleCheckboxClick}
                          />
                        </td>
                      )}
                      <td className="contact-name-col">
                        <div className="contact-name-cell">
                          <div className="contact-avatar-small" style={{ backgroundColor: getRandomColor(contact.name) }}>
                            {getInitials(contact.name)}
                          </div>
                          <div className="contact-name-info">
                            <div className="name">{contact.name}</div>
                            <div className="timestamp">{getContactTimestamp(contact, index)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="contact-col">
                        <div className="contact-details">
                          <div className="contact-email">
                            <FontAwesomeIcon icon={faEnvelope} /> {contact.email}
                          </div>
                          <div className="contact-phone">
                            <FontAwesomeIcon icon={faPhone} /> {contact.phone}
                          </div>
                        </div>
                      </td>
                      <td className="lead-source-col">
                        <span 
                          className="lead-source-badge"
                          style={getTagStyle(contact.tags[0])}
                        >
                          {contact.tags[0] || 'General'}
                        </span>
                      </td>
                      <td className="company-col">
                        <div className="company-info">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="company-icon" />
                          <span>{contact.address.length > 30 ? contact.address.substring(0, 30) + '...' : contact.address}</span>
                        </div>
                      </td>
                      <td className="contact-owner-col">
                        <div className="owner-info">
                          <div className="owner-avatar">{contact.relation.charAt(0).toUpperCase()}</div>
                          <span>{contact.relation}</span>
                        </div>
                      </td>
                      {!selectMode && (
                        <td className="actions-col">
                          <div className="contact-menu">
                            <button 
                              className="contact-menu-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === contact.id ? null : contact.id);
                              }}
                              title="More options"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                            {activeDropdown === contact.id && (
                              <div className="contact-menu-dropdown">
                                <button 
                                  className="contact-menu-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(null);
                                    openEditModal(contact);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  Edit
                                </button>
                                <button 
                                  className="contact-menu-item delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(null);
                                    openDeleteConfirm(contact, 'single');
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className={`contacts-container ${viewMode}`}>
            {paginatedContacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
        )}

        {paginatedContacts.length === 0 && filteredAndSortedContacts.length > 0 && (
          <div className="no-contacts">
            <p>No contacts on this page. Try going to page 1.</p>
          </div>
        )}

        {filteredAndSortedContacts.length === 0 && (
          <div className="no-contacts">
            <p>No contacts found matching your search.</p>
          </div>
        )}

        {/* Pagination Controls */}
        <PaginationControls />
      </div>

      {/* Contact Details Panel */}
      {selectedContact && <ContactDetails />}
      
      {/* Modals */}
      <AddContactModal />
      <EditContactModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default ContactScreen;
