import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './StudentAnalytics.css';
import avatarIcon from '../assets/avatars.png';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStudentClick = (studentId) => {
    navigate(`/student-analytics/${studentId}`);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students`);
        const data = await response.json();
        if (response.ok) {
          const formatted = data.students.map((s, index) => ({
            id: s.custom_id || `#UNDEF-${index}`,
            name: s.email,
            username: s.username || 'Not Available yet',
            avatar: s.avatar || avatarIcon,
            address: '-',
            date: new Date(s.created_at).toLocaleDateString(),
            status: 'Active',
            statusColor: '#A1E3CB',
            statusTextColor: '#4AA785',
            class: 'General'
          }));
          setStudentData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = studentData.filter(student =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="analytics-layout">
      <Sidebar />
      <div className="analytics-main">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />

        <div className="analytics-container">
          <div className="data-table-container">
            <div className="data-table-toolbar">
              <div className="toolbar-group">
                <button className="toolbar-button">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button className="toolbar-button">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414v6.586a1 1 0 01-1.414.707l-4-2A1 1 0 018 19v-5.586l-6.293-6.293A1 1 0 011 6.414V4a1 1 0 011-1h1z" />
                  </svg>
                </button>
                <button className="toolbar-button">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
              <div className="search-field">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(28, 28, 28, 0.2)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Class Enrolled</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={index}
                      onClick={() => handleStudentClick(student.id.replace('#', ''))}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{student.id}</td>
                      <td>
                        <div className="student-info">
                          <img src={student.avatar} alt={student.username} className="student-avatar" />
                          <span>{student.username}</span>
                        </div>
                      </td>
                      <td>{student.name}</td>
                      <td>
                        <div className="date-info">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{student.date}</span>
                        </div>
                      </td>
                      <td>
                        <div className="status-badge" style={{ color: student.statusTextColor }}>
                          <span className="status-dot" style={{ backgroundColor: student.statusColor }}></span>
                          <span>{student.status}</span>
                        </div>
                      </td>
                      <td>{student.class}</td>
                      <td>
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentClick(student.id.replace('#', ''));
                          }}
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button className="pagination-button">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="pagination-button active">1</button>
              <button className="pagination-button">2</button>
              <button className="pagination-button">3</button>
              <button className="pagination-button">4</button>
              <button className="pagination-button">5</button>
              <button className="pagination-button">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
