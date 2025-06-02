import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './ViewAnalyticsCourse.css';
import avatarIcon from '../assets/avatar.png';
import { useParams, useNavigate } from 'react-router-dom';

const ViewAnalyticsCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  
  const handleTabClick = (tab) => {
    if (tab === 'details') {
      navigate(`/course/${id}`);
    } else if (tab === 'manage') {
      navigate(`/course/${id}/students`);
    }
  };
  
  return (
    <div className="analytics-layout">
      <Sidebar />
      <div className="analytics-main">
        <div className="header">
          <div className="user-info">
            <img src={avatarIcon} alt="User Avatar" className="avatar" />
            <span className="user-name-bold">John Doe</span>
            <span className="user-role">Instructor</span>
          </div>
          <div className="icons">
            <span className="icon-svg">
              {/* Bell SVG */}
              <svg width="24" height="24" fill="none" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 16v-5a6 6 0 10-12 0v5l-1.5 2h15z"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </span>
            <span className="icon-svg">
              {/* User SVG */}
              <svg width="24" height="24" fill="none" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            </span>
          </div>
        </div>
        
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
              className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => handleTabClick('manage')}
            >
              Manage Students
            </button>
            <button 
              className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              View Analytics
            </button>
          </div>
          <div className="analytics-period-selector">
            <select className="period-select">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
        
        <div className="analytics-dashboard">
          <div className="analytics-stats-row">
            <div className="stat-card">
              <div className="stat-icon students-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M5 21v-2a7 7 0 0114 0v2"/>
                </svg>
              </div>
              <div className="stat-content">
                <h2 className="stat-value">1,674,767</h2>
                <p className="stat-label">Students</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon tasks-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="9" y1="9" x2="15" y2="9"/>
                  <line x1="9" y1="14" x2="15" y2="14"/>
                  <line x1="9" y1="19" x2="15" y2="19"/>
                </svg>
              </div>
              <div className="stat-content">
                <h2 className="stat-value">3</h2>
                <p className="stat-label">Pending tasks</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon total-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <div className="stat-content">
                <h2 className="stat-value">1234</h2>
                <p className="stat-label">Total no</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon material-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="stat-content">
                <h2 className="stat-value">56</h2>
                <p className="stat-label">Course Material</p>
              </div>
            </div>
          </div>
          
          <div className="analytics-sections">
            <div className="analytics-section activity-section">
              <div className="section-header">
                <h3>Recent Activity</h3>
                <div className="section-dropdown">
                  Today <span className="dropdown-arrow">▼</span>
                </div>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon comment-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="#f44336" strokeWidth="2" fill="none">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p><strong>Kevin</strong> comments on your lecture</p>
                    <span className="activity-time">Just now</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon rating-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2196f3" strokeWidth="2" fill="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p><strong>John</strong> give a 5 star rating on your course "2021 ui/ux design with figma"</p>
                    <span className="activity-time">5 mins ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon assessment-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ff9800" strokeWidth="2" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p><strong>Joshua</strong> submitted an assessment task.</p>
                    <span className="activity-time">6 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analytics-section chart-section">
              <div className="section-header">
                <h3>Class Overview</h3>
                <div className="section-dropdown">
                  Today <span className="dropdown-arrow">▼</span>
                </div>
              </div>
              <div className="chart-container">
                <div className="bar-chart">
                  <div className="chart-grid">
                    <div className="chart-grid-line"></div>
                    <div className="chart-grid-line"></div>
                    <div className="chart-grid-line"></div>
                    <div className="chart-grid-line"></div>
                  </div>
                  <div className="chart-bars">
                    <div className="chart-bar" style={{ height: '40%' }}></div>
                    <div className="chart-bar" style={{ height: '85%' }}></div>
                    <div className="chart-bar" style={{ height: '30%' }}></div>
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                    <div className="chart-bar" style={{ height: '45%' }}></div>
                    <div className="chart-bar" style={{ height: '30%' }}></div>
                    <div className="chart-bar" style={{ height: '55%' }}></div>
                    <div className="chart-bar" style={{ height: '45%' }}></div>
                    <div className="chart-bar" style={{ height: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnalyticsCourse; 