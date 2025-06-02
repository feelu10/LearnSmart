import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './ManageStudentCourse.css';
import avatarIcon from '../assets/avatar.png';
import { useParams, useNavigate } from 'react-router-dom';

// Sample student data
const studentsData = [
  { id: '#CMP001', name: 'Natali Craig', address: 'Meadow Lane Oakland', date: 'Just now', status: 'In Progress', class: 'Landing Page' },
  { id: '#CMP002', name: 'Kate Morrison', address: 'Larry San Francisco', date: 'A minute ago', status: 'Complete', class: 'CRM Admin pages' },
  { id: '#CMP003', name: 'Drew Cano', address: 'Bagwell Avenue Ocala', date: '1 hour ago', status: 'Pending', class: 'Client Project' },
  { id: '#CMP004', name: 'Orlando Diggs', address: 'Washburn Baton Rouge', date: 'Yesterday', status: 'Approved', class: 'Admin Dashboard' },
  { id: '#CMP005', name: 'Andi Lane', address: 'Nest Lane Olivette', date: 'Feb 2, 2025', status: 'Rejected', class: 'App Landing Page' },
  { id: '#CMP001', name: 'Natali Craig', address: 'Meadow Lane Oakland', date: 'Just now', status: 'In Progress', class: 'Landing Page' },
  { id: '#CMP002', name: 'Kate Morrison', address: 'Larry San Francisco', date: 'A minute ago', status: 'Complete', class: 'CRM Admin pages' },
  { id: '#CMP003', name: 'Drew Cano', address: 'Bagwell Avenue Ocala', date: '1 hour ago', status: 'Pending', class: 'Client Project' },
  { id: '#CMP004', name: 'Orlando Diggs', address: 'Washburn Baton Rouge', date: 'Yesterday', status: 'Approved', class: 'Admin Dashboard' },
  { id: '#CMP005', name: 'Andi Lane', address: 'Nest Lane Olivette', date: 'Feb 2, 2025', status: 'Rejected', class: 'App Landing Page' },
];

const ManageStudentCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manage');
  
  const handleTabClick = (tab) => {
    if (tab === 'details') {
      navigate(`/course/${id}`);
    } else if (tab === 'analytics') {
      navigate(`/course/${id}/analytics`);
    }
  };
  
  return (
    <div className="manage-students-layout">
      <Sidebar />
      <div className="manage-students-main">
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
          <div className="table-controls">
            <button className="add-button">
              <span>+</span>
            </button>
            <button className="filter-button">
              <span>≡</span>
            </button>
            <button className="sort-button">
              <span>↕</span>
            </button>
            <div className="search-container">
              <input type="text" placeholder="Search..." className="search-input" />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>
        
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Address</th>
                <th>Date</th>
                <th>Status</th>
                <th>Class Enrolled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student, index) => (
                <tr key={index}>
                  <td className="student-id">{student.id}</td>
                  <td className="student-name">
                    <div className="student-avatar-name">
                      <div className="table-avatar"></div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>{student.address}</td>
                  <td>
                    <div className="date-cell">
                      <span className="calendar-icon">📅</span>
                      <span>{student.date}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${student.status.toLowerCase().replace(' ', '-')}`}>
                      {student.status === 'In Progress' ? '• ' : student.status === 'Complete' ? '✓ ' : 
                       student.status === 'Pending' ? '• ' : student.status === 'Approved' ? '★ ' : '• '}
                      {student.status}
                    </span>
                  </td>
                  <td>{student.class}</td>
                  <td>
                    <button className="action-button">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button className="pagination-button prev">←</button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">4</button>
          <button className="pagination-button">5</button>
          <button className="pagination-button next">→</button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentCourse; 