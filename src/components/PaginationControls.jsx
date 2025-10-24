import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight, 
  faStepBackward, 
  faStepForward 
} from '@fortawesome/free-solid-svg-icons';

const PaginationControls = ({ 
  totalPages, 
  currentPage, 
  handlePageChange 
}) => {
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

export default PaginationControls;