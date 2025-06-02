import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import './MyCourse.css';
import avatarIcon from '../assets/avatar.png';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const courses = Array(8).fill({
  title: 'Course Topic',
  image: '', // Placeholder for image
});

// New course topics for the dropdown
const newCourseTopics = [
  { id: 1, title: 'New Course Topic', color: '#b35959', author: 'Prashant Kumar Singh' },
  { id: 2, title: 'New Course Topic', color: '#5970b3', author: 'Prashant Kumar Singh' },
  { id: 3, title: 'New Course Topic', color: '#59b380', author: 'Prashant Kumar Singh' },
];

const MyCourse = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="mycourse-layout">
      <Sidebar />
      <div className="mycourse-main">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />
        
        <div className="mycourse-controls">
          <div className="add-course-container" ref={dropdownRef}>
            <button className="add-course-btn" onClick={toggleDropdown}>Add a new course</button>
            
            {dropdownOpen && (
              <div className="new-course-dropdown">
                <div className="search-bar">
                  <div className="search-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search New Course Topic" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="search-button">Search</button>
                </div>
                
                <div className="new-course-topics">
                  {newCourseTopics.map((topic) => (
                    <div className="topic-card" key={topic.id}>
                      <div className="topic-image" style={{ backgroundColor: topic.color }}>
                      </div>
                      <div className="topic-content">
                        <div className="topic-label">TOPIC</div>
                        <div className="topic-title">{topic.title}</div>
                        <div className="topic-author">
                          <img src={avatarIcon} alt="Author" className="topic-author-avatar" />
                          <span>{topic.author}</span>
                        </div>
                      </div>
                      <div className="topic-actions">
                        <button className="topic-action-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </button>
                        <button className="topic-action-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="filters">
            <div className="filter sort-filter">
              <div className="filter-content">
                <span>Sort by</span>
              </div>
              <span className="filter-arrow">▼</span>
            </div>
          </div>
        </div>
        
        <div className="course-grid">
          {courses.map((course, idx) => (
            <div className="course-card" key={idx} onClick={() => handleCourseClick(idx + 1)}>
              <div className={`course-image-placeholder ${idx % 2 === 0 ? 'light' : 'dark'}`}>
                <button className="favorite-btn" onClick={(e) => e.stopPropagation()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </button>
              </div>
              <div className="course-info">
                <span className="course-topic">TOPIC</span>
                <div className="course-details">
                  <div className="course-text">Course<br/>Topic</div>
                  <button className="course-menu" onClick={(e) => e.stopPropagation()}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="4" cy="12" r="2"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                      <circle cx="20" cy="12" r="2"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourse; 