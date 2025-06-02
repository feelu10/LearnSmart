import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './TopicCourse.css';
import avatarIcon from '../assets/avatar.png';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const TopicCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  
  const handleTabClick = (tab) => {
    if (tab === 'manage') {
      navigate(`/course/${id}/students`);
    } else if (tab === 'analytics') {
      navigate(`/course/${id}/analytics`);
    } else {
      setActiveTab(tab);
    }
  };
  
  return (
    <div className="topiccourse-layout">
      <Sidebar />
      <div className="topiccourse-main">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />

        <div className="course-header-section">
          <h1 className="course-title">Course</h1>
        </div>
        
        <div className="course-tabs">
          <div className="tab-group">
            <button 
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => handleTabClick('details')}
            >
              Details
            </button>
            <button 
              className="tab-button"
              onClick={() => handleTabClick('manage')}
            >
              Manage Students
            </button>
            <button 
              className="tab-button"
              onClick={() => handleTabClick('analytics')}
            >
              View Analytics
            </button>
          </div>
          <button className="add-content-btn">Add content</button>
        </div>
        
        <div className="course-content-area">
          {/* Empty content sections as shown in the image */}
          <div className="content-section"></div>
          <div className="content-section"></div>
          <div className="content-section"></div>
        </div>
      </div>
    </div>
  );
};

export default TopicCourse; 