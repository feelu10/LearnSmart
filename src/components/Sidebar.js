import React from 'react';
import './Sidebar.css';
import learnsmartLogo from '../assets/learnsmart-logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={learnsmartLogo} alt="LearnSmart Logo" className="logo" />
        <h1 className="logo-text">LearnSmart</h1>
      </div>
      
      <nav className="sidebar-nav">
        <div className={`nav-item${location.pathname === '/dashboard' ? ' active' : ''}`} onClick={() => navigate('/dashboard')}>
          <div className="icon book-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.6667 12.8217V5.44839C25.6667 4.04839 24.5233 3.01006 23.135 3.12672H23.065C20.615 3.33672 16.8933 4.58506 14.8167 5.89172L14.6183 6.02006C14.28 6.23006 13.72 6.23006 13.3817 6.02006L13.09 5.84506C11.0133 4.55006 7.30333 3.31339 4.85333 3.11506C3.465 2.99839 2.33333 4.04839 2.33333 5.43672V19.5301C2.33333 20.6501 3.24333 21.7001 4.36333 21.8401L4.70167 21.8867C7.23333 22.2251 11.1417 23.5084 13.3817 24.7334L13.4283 24.7567C13.7433 24.9317 14.245 24.9317 14.5483 24.7567C16.7883 23.5201 20.7083 22.2251 23.2517 21.8867L23.6367 21.8401C24.7567 21.7001 25.6667 20.6501 25.6667 19.5301V17.5234" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 6.40503V23.905" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.04167 9.90503H6.41667" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.91667 13.405H6.41667" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Dashboard</span>
        </div>

        
        <div className={`nav-item${location.pathname === '/mycourse' ? ' active' : ''}`} onClick={() => navigate('/mycourse') }>
          <div className="icon courses-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.66667 22.75C4.66667 21.9765 4.97396 21.2346 5.52094 20.6876C6.06792 20.1407 6.80979 19.8334 7.58333 19.8334H23.3333M4.66667 22.75C4.66667 23.5236 4.97396 24.2655 5.52094 24.8124C6.06792 25.3594 6.80979 25.6667 7.58333 25.6667H23.3333V2.33337H7.58333C6.80979 2.33337 6.06792 2.64066 5.52094 3.18765C4.97396 3.73463 4.66667 4.47649 4.66667 5.25004V22.75Z"
                stroke="#373A3D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>My Courses</span>
        </div>
        
        <div className={`nav-item${location.pathname === '/quiz-builder' ? ' active' : ''}`} onClick={() => navigate('/quiz-builder') }>
          <div className="icon quiz-icon">
          <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 18.6637L19.8888 19.9417C19.2994 20.6193 18.5002 21 17.6668 21C16.8335 21 16.0342 20.6193 15.4449 19.9417C14.8547 19.2655 14.0555 18.8857 13.2224 18.8857C12.3893 18.8857 11.5902 19.2655 11 19.9417M1 21H2.86061C3.40414 21 3.67591 21 3.93166 20.9354C4.15841 20.8782 4.37517 20.7838 4.574 20.6557C4.79826 20.5112 4.99043 20.3092 5.37477 19.9051L19.3334 5.23019C20.2539 4.26247 20.2539 2.6935 19.3334 1.72578C18.4129 0.758071 16.9205 0.758072 16 1.72578L2.0414 16.4007C1.65706 16.8048 1.46489 17.0068 1.32747 17.2426C1.20563 17.4516 1.11584 17.6795 1.0614 17.9179C1 18.1868 1 18.4725 1 19.0439V21Z"
                stroke="#373A3D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Quiz Builder</span>
        </div>
        
        <div
          className={`nav-item${location.pathname.startsWith('/student-analytics') ? ' active' : ''}`}
          onClick={() => {
            const role = localStorage.getItem('user_role');
            const customId = localStorage.getItem('user_id');
            if (role === 'instructor') {
              navigate('/student-analytics');
            } else {
              navigate(`/student-analytics/${customId}`);
            }
          }}
        >
          <div className="icon analytics-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.41651 2.05263H6.04991C4.28227 2.05263 3.39846 2.05263 2.72331 2.39682C2.12943 2.69958 1.6466 3.18268 1.344 3.77687C1 4.45238 1 5.33668 1 7.10526V15.9474C1 17.716 1 18.6002 1.344 19.2758C1.6466 19.87 2.12943 20.3531 2.72331 20.6558C3.39846 21 4.28227 21 6.04991 21H14.8872C16.6549 21 17.5387 21 18.2138 20.6558C18.8077 20.3531 19.2905 19.87 19.5931 19.2758C19.9371 18.6002 19.9371 17.716 19.9371 15.9474V12.5789M10.4686 7.31579H14.6768V11.5263M14.1508 2.57895V1M18.2952 3.69543L19.4111 2.57895M19.4219 7.84211H21M1 12.9443C1.68588 13.0503 2.38859 13.1053 3.10413 13.1053C7.71886 13.1053 11.7998 10.8185 14.2767 7.31579" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>
            {localStorage.getItem('user_role') === 'instructor' ? 'Student Analytics' : 'My Analytics'}
          </span>
        </div>

        <div className={`nav-item${location.pathname === '/settings' ? ' active' : ''}`} onClick={() => navigate('/settings') }>
          <div className="icon settings-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="2" stroke="#373A3D" strokeWidth="2"/>
              <path d="M14 8.5C16.5 3.5 21.5 8.5 19 12" stroke="#373A3D" strokeWidth="2"/>
              <path d="M8.5 14C3.5 11.5 8.5 6.5 12 9" stroke="#373A3D" strokeWidth="2"/>
            </svg>
          </div>
          <span>Settings</span>
        </div>
        <div className="nav-item logout" onClick={() => {
          localStorage.clear();
          navigate('/web/login');
        }}>
          <div className="icon settings-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M16 17L21 12L16 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 