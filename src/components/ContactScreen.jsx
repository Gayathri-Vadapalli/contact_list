import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import contactData from './contact_list.json';
import './ContactScreen.css';
import './ContactScreen-dark.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSort, 
  faTh, 
  faList, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faCheckCircle,
  faTimesCircle,
  faFilter,
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faEllipsisV,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';

// Import new components
import AddContactModal from './AddContactModal';
import EditContactModal from './EditContactModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import ContactCard from './ContactCard';
import FilterPanel from './FilterPanel';
import ContactDetails from './ContactDetails';
import PaginationControls from './PaginationControls';
import BulkActionsBar from './BulkActionsBar';

const ContactScreen = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortField, setSortField] = useState('name'); // which field to sort by
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
  const [darkMode, setDarkMode] = useState(false);
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

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

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

    // Sort based on selected field and order
    const getFieldValue = (c, field) => {
      switch(field) {
        case 'name':
          return (c.name || '').toString().toLowerCase();
        case 'email':
          return (c.email || '').toString().toLowerCase();
        case 'tags':
          return ((c.tags && c.tags[0]) || '').toString().toLowerCase();
        case 'address':
          return (c.address || '').toString().toLowerCase();
        case 'relation':
          return (c.relation || '').toString().toLowerCase();
        default:
          return (c.name || '').toString().toLowerCase();
      }
    };

    filtered.sort((a, b) => {
      const va = getFieldValue(a, sortField);
      const vb = getFieldValue(b, sortField);
      if (va < vb) return sortOrder === 'asc' ? -1 : 1;
      if (va > vb) return sortOrder === 'asc' ? 1 : -1;
      return 0;
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

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(!darkMode);
    // Apply or remove dark mode class to body
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

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

  // Toggle sort field and order
  const toggleSort = useCallback((field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField]);

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

  return (
    <div className={`contact-screen ${darkMode ? 'dark-mode' : ''}`}>
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
              <FilterPanel 
                showFilter={showFilter}
                filterTag={filterTag}
                setFilterTag={setFilterTag}
                setShowFilter={setShowFilter}
                contacts={contacts}
              />
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
            
            {/* Dark Mode Toggle */}
            <button 
              className="theme-toggle"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={handleDarkModeToggle}
            >
              <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
            </button>
            
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
        <BulkActionsBar 
          selectMode={selectMode}
          selectedContacts={selectedContacts}
          contacts={contacts}
          openEditModal={openEditModal}
          handleBulkDelete={handleBulkDelete}
        />

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
                  <th
                    className={`contact-name-col sortable ${sortField === 'name' ? 'active-sort' : ''}`}
                    onClick={() => toggleSort('name')}
                    title="Sort by contact name"
                  >
                    CONTACT NAME <FontAwesomeIcon icon={faSort} />
                  </th>
                  <th
                    className={`contact-col sortable ${sortField === 'email' ? 'active-sort' : ''}`}
                    onClick={() => toggleSort('email')}
                    title="Sort by contact (email)"
                  >
                    CONTACT <FontAwesomeIcon icon={faSort} />
                  </th>
                  <th className="lead-source-col">
                    <span
                      className={`sortable ${sortField === 'tags' ? 'active-sort' : ''}`}
                      onClick={() => toggleSort('tags')}
                      title="Sort by tag"
                      style={{display: 'inline-flex', alignItems: 'center', gap: 6}}
                    >
                      TAGS <FontAwesomeIcon icon={faSort} />
                    </span>
                  </th>
                  <th className="company-col">
                    <span
                      className={`sortable ${sortField === 'address' ? 'active-sort' : ''}`}
                      onClick={() => toggleSort('address')}
                      title="Sort by address"
                      style={{display: 'inline-flex', alignItems: 'center', gap: 6}}
                    >
                      ADDRESS <FontAwesomeIcon icon={faSort} />
                    </span>
                  </th>
                  <th className="contact-owner-col">
                    <span
                      className={`sortable ${sortField === 'relation' ? 'active-sort' : ''}`}
                      onClick={() => toggleSort('relation')}
                      title="Sort by relation"
                      style={{display: 'inline-flex', alignItems: 'center', gap: 6}}
                    >
                      RELATION <FontAwesomeIcon icon={faSort} />
                    </span>
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
              <ContactCard 
                key={index} 
                contact={contact}
                viewMode={viewMode}
                selectMode={selectMode}
                selectedContacts={selectedContacts}
                activeDropdown={activeDropdown}
                handleContactSelect={handleContactSelect}
                setSelectedContact={setSelectedContact}
                setActiveDropdown={setActiveDropdown}
                openEditModal={openEditModal}
                openDeleteConfirm={openDeleteConfirm}
                getInitials={getInitials}
                getRandomColor={getRandomColor}
                getTagStyle={getTagStyle}
              />
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
        <PaginationControls 
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* Contact Details Panel */}
      {selectedContact && (
        <ContactDetails 
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          getInitials={getInitials}
          getRandomColor={getRandomColor}
          getTagStyle={getTagStyle}
          openDeleteConfirm={openDeleteConfirm}
        />
      )}
      
      {/* Modals */}
      <AddContactModal 
        showAddContact={showAddContact}
        setShowAddContact={setShowAddContact}
        newContact={newContact}
        setNewContact={setNewContact}
        handleAddContact={handleAddContact}
      />
      <EditContactModal 
        showEditContact={showEditContact}
        setShowEditContact={setShowEditContact}
        editContact={editContact}
        setEditContact={setEditContact}
        handleEditContact={handleEditContact}
      />
      <DeleteConfirmModal 
        showDeleteConfirm={showDeleteConfirm}
        deleteType={deleteType}
        selectedContacts={selectedContacts}
        contactToDelete={contactToDelete}
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ContactScreen;
