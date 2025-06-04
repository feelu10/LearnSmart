import React from 'react';
import './Sidebar.css';
import learnsmartLogo from '../assets/learnsmart-logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('user_role');

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={learnsmartLogo} alt="LearnSmart Logo" className="logo" />
        <h1 className="logo-text">LearnSmart</h1>
      </div>

      <nav className="sidebar-nav">
        {role === 'admin' ? (
          <>
            {/* ✅ Admin Dashboard */}
            <div
              className={`nav-item${location.pathname === '/admin/dashboard' ? ' active' : ''}`}
              onClick={() => navigate('/admin/dashboard')}
            >
              <div className="icon">
                🧭
              </div>
              <span>Dashboard</span>
            </div>

            {/* ✅ User Management */}
            <div
              className={`nav-item${location.pathname === '/admin/users' ? ' active' : ''}`}
              onClick={() => navigate('/admin/users')}
            >
              <div className="icon">
                👥
              </div>
              <span>User Management</span>
            </div>

            {/* ✅ Course Management */}
            {/* <div
              className={`nav-item${location.pathname === '/admin/courses' ? ' active' : ''}`}
              onClick={() => navigate('/admin/courses')}
            >
              <div className="icon">
                📚
              </div>
              <span>Courses</span>
            </div> */}
          </>
        ) : (
          <>
            {/* 🧑‍🏫 Instructor/Student Menu */}
            <div
              className={`nav-item${location.pathname === '/dashboard' ? ' active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <div className="icon book-icon">📘</div>
              <span>Dashboard</span>
            </div>

            <div
              className={`nav-item${location.pathname === '/mycourse' ? ' active' : ''}`}
              onClick={() => navigate('/mycourse')}
            >
              <div className="icon courses-icon">📖</div>
              <span>My Courses</span>
            </div>

            <div
              className={`nav-item${location.pathname === '/quiz-builder' ? ' active' : ''}`}
              onClick={() => navigate('/quiz-builder')}
            >
              <div className="icon quiz-icon">📝</div>
              <span>Quiz Builder</span>
            </div>

            <div
              className={`nav-item${location.pathname.startsWith('/student-analytics') ? ' active' : ''}`}
              onClick={() => {
                const customId = localStorage.getItem('user_id');
                if (role === 'instructor') {
                  navigate('/student-analytics');
                } else {
                  navigate(`/student-analytics/${customId}`);
                }
              }}
            >
              <div className="icon analytics-icon">📊</div>
              <span>{role === 'instructor' ? 'Student Analytics' : 'My Analytics'}</span>
            </div>

            <div
              className={`nav-item${location.pathname === '/settings' ? ' active' : ''}`}
              onClick={() => navigate('/settings')}
            >
              <div className="icon settings-icon">⚙️</div>
              <span>Settings</span>
            </div>
          </>
        )}

        {/* ✅ Logout (Always Visible) */}
        <div
          className="nav-item logout"
          onClick={() => {
            localStorage.clear();
            navigate('/web/login');
          }}
        >
          <div className="icon settings-icon">🚪</div>
          <span>Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
