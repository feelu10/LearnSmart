import React from 'react';
import avatarFallback from '../assets/avatars.png';

const PageHeader = () => {
  const storedAvatar = localStorage.getItem('user_avatar');
  const storedEmail = localStorage.getItem('user_email');
  const storedId = localStorage.getItem('user_id'); // LS-00000001 (for students)
  const storedRole = localStorage.getItem('user_role'); // 'student' or 'instructor'

  const avatar = storedAvatar && storedAvatar !== '""'
    ? storedAvatar
    : avatarFallback;

  const displayText = storedRole === 'instructor'
    ? 'Instructor'
    : storedId || 'ID not assigned';

  return (
    <div className="header">
      <div className="user-info">
        <img src={avatar} alt="User Avatar" className="avatar" />
        <span className="user-name-bold">{storedEmail || 'Please create username'}</span>
        <span className="user-role">{displayText}</span>
      </div>
      <div className="icons">
        <span className="icon-svg">
          <svg width="24" height="24" fill="none" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M18 16v-5a6 6 0 10-12 0v5l-1.5 2h15z" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </span>
        <span className="icon-svg">
          <svg width="24" height="24" fill="none" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default PageHeader;
