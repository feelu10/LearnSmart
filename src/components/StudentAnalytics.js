import React, { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar';
import './StudentAnalytics.css';
import avatarIcon from '../assets/avatars.png';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import { AppContext } from '../AppContext'; // ⬅️ import context

const itemsPerPage = 10;

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const { data, setData } = useContext(AppContext);

  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 🟢 Use preloaded students if available
  useEffect(() => {
    if (data.students && data.students.length > 0) {
      const formatted = data.students.map((s, index) => ({
        id: s.custom_id || s.id || `#UNDEF-${index}`,
        name: s.email,
        username: s.username || 'Not Available yet',
        avatar: s.avatar || avatarIcon,
        address: '-',
        date: s.created_at
          ? new Date(s.created_at).toLocaleDateString()
          : '',
        status: 'Active',
        statusColor: '#A1E3CB',
        statusTextColor: '#4AA785',
        class: 'General'
      }));
      setStudentData(formatted);
      setLoading(false);
      return;
    }

    // 🟡 Fallback: fetch if not in context
    const fetchStudents = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/students`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const dataRes = await response.json();
        if (response.ok) {
          const studentsArr = dataRes.students || dataRes;
          const formatted = studentsArr.map((s, index) => ({
            id: s.custom_id || s.id || `#UNDEF-${index}`,
            name: s.email,
            username: s.username || 'Not Available yet',
            avatar: s.avatar || avatarIcon,
            address: '-',
            date: s.created_at
              ? new Date(s.created_at).toLocaleDateString()
              : '',
            status: 'Active',
            statusColor: '#A1E3CB',
            statusTextColor: '#4AA785',
            class: 'General'
          }));
          setStudentData(formatted);

          // Store to context for app-wide access
          setData((prev) => ({ ...prev, students: studentsArr }));
        }
      } catch {}
      setLoading(false);
    };

    fetchStudents();
  }, [data.students, setData]);

  // Search then paginate
  const filteredStudents = studentData.filter(student =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  // Get current page data
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const goToPage = (p) => {
    if (p < 1 || p > pageCount) return;
    setCurrentPage(p);
  };

  const handleStudentClick = (studentId) => {
    navigate(`/student-analytics/${studentId}`);
  };

  return (
    <div className="analytics-layout">
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
        </div>
      )}
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
              <div className="toolbar-group">{/* ... Toolbar buttons ... */}</div>
              <div className="search-field">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(28, 28, 28, 0.2)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
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
                  {paginatedStudents.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#aaa' }}>
                        No students found.
                      </td>
                    </tr>
                  )}
                  {paginatedStudents.map((student, index) => (
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
              <button
                className="pagination-button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1C1C1C">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: pageCount }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-button${currentPage === idx + 1 ? ' active' : ''}`}
                  onClick={() => goToPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount}
              >
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
