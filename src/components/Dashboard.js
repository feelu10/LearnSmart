import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import './Dashboard.css';
import avatarIcon from '../assets/avatars.png';
import PageHeader from './PageHeader';

const Dashboard = () => {
  const { data } = useContext(AppContext);
  const [activityItems, setActivityItems] = useState([]);
  const [classEngagementData, setClassEngagementData] = useState([]);

  useEffect(() => {
    if (data?.activityLogs?.length > 0) {
      setActivityItems(
        data.activityLogs.map(log => ({
          icon: log.action === 'enroll_student' ? 'user' : 'document',
          title: log.action === 'enroll_student' ? 'Student Enrolled' : 'Join Request',
          description: log.details,
          timeAgo: formatTimeAgo(log.timestamp),
          avatar: `${process.env.REACT_APP_API_URL}${log.avatar || '/static/img/avatar-default.png'}`
        }))
      );
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/api/activity-logs`)
        .then(res => res.json())
        .then(data => {
          const logs = (data.logs || []).map(log => ({
            icon: log.action === 'enroll_student' ? 'user' : 'document',
            title: log.action === 'enroll_student' ? 'Student Enrolled' : 'Join Request',
            description: log.details,
            timeAgo: formatTimeAgo(log.timestamp),
            avatar: `${process.env.REACT_APP_API_URL}${log.avatar || '/static/img/avatar-default.png'}`
          }));
          setActivityItems(logs);
        })
        .catch(err => console.error('Failed to load activity logs:', err));
    }
  }, [data]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/course-engagement`)
      .then(res => res.json())
      .then(data => {
        const engagement = (data.engagement || []).map(item => ({
          name: item.title || 'Untitled Course',
          registered: `${item.total_students} Registered`,
          percentage: item.percentage || '0%'
        }));
        setClassEngagementData(engagement);
      })
      .catch(err => console.error('Failed to load class engagement:', err));
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    return `${Math.floor(diff / 86400)} day(s) ago`;
  };

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const nextMonthDays = [1, 2, 3, 4];

  const tasks = [
    { id: '07', title: 'Meeting with the VC', description: 'Meeting link//www.zoom.com', status: 'Due soon', time: '10 A.M - 11A.M' },
    { id: '11', title: 'Meeting with the J..', description: 'Meeting link//www.zoom.com', status: 'Upcoming', time: '10 A.M - 11A.M' },
    { id: '12', title: 'Class B middle sess..', description: 'Review the post test', status: 'Upcoming', time: '10 A.M - 11A.M' },
    { id: '30', title: 'Send class feedbac..', description: 'Send via feedback form', status: 'Upcoming', time: '10 A.M - 11A.M' }
  ];

  return (
    <div className="dashboard">
      <PageHeader
        username={localStorage.getItem('user_email')}
        role={localStorage.getItem('user_role') || 'User'}
        avatar={localStorage.getItem('user_avatar') || avatarIcon}
      />

      <h1 className="welcome-message">Welcome back, Prof. John Doe</h1>

      <div className="dashboard-layout">
        <div className="dashboard-left">
          <div className="student-activity-card">
            <div className="card-header">
              <h2>Student Activity</h2>
              <button className="more-btn">⋮</button>
            </div>
            <div className="activity-list">
              {activityItems.map((item, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-icon">
                    <img
                      src={item.avatar}
                      alt="avatar"
                      className="activity-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/static/img/avatar-default.png';
                      }}
                    />
                  </div>
                  <div className="activity-content">
                    <h3 className="activity-title">{item.title}</h3>
                    <p className="activity-description">{item.description}</p>
                  </div>
                  <div className="activity-time">{item.timeAgo}</div>
                </div>
              ))}
              {activityItems.length === 0 && <p>No recent activity found.</p>}
            </div>
          </div>

          <div className="bottom-row">
            <div className="quiz-progress-card">
              <div className="card-header">
                <h2>Quiz Progress Summary</h2>
                <div className="progress-controls">
                  <button className="nav-button">‹</button>
                  <span>Aug 2025</span>
                  <button className="nav-button">›</button>
                  <div className="avg-point-indicator">
                    <span className="avg-indicator"></span>
                    <span>Avg no.</span>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <div className="chart-y-axis">
                  {[60, 50, 40, 30, 20, 10].map((val, idx) => (
                    <div className="y-axis-label" key={idx}>{val}%</div>
                  ))}
                </div>
                <div className="chart-content">
                  <div className="grid-lines">
                    {[...Array(6)].map((_, index) => (
                      <div className="grid-line" key={index}></div>
                    ))}
                  </div>
                  <div className="chart-bars">
                    {classEngagementData.map((item, index) => (
                      <div className="bar-container" key={index}>
                        <div className="bar" style={{ height: item.percentage }}></div>
                        <div className="bar-label">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="engagement-card">
              <h3>Class Engagement</h3>
              <div className="engagement-items">
                {classEngagementData.map((item, index) => (
                  <div className="engagement-item" key={index}>
                    <div className="class-info">
                      <h4>{item.name}</h4>
                      <p>{item.registered}</p>
                    </div>
                    <div
                      className="progress-circle"
                      style={{ '--percent': parseInt(item.percentage.replace('%', '')) }}
                    >
                      <span className="percent-text">{item.percentage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="upcoming-activities-card">
            <div className="calendar-header">
              <h2>August</h2>
              <div className="calendar-controls">
                <button className="calendar-nav">‹</button>
                <button className="calendar-nav">›</button>
              </div>
            </div>

            <div className="weekday-row">
              {weekdays.map((day, index) => <div key={index}>{day}</div>)}
            </div>

            <div className="days-grid">
              {days.map((day, index) => (
                <div key={index} className={`calendar-day ${day === 6 ? 'highlighted-day' : ''}`}>{day}</div>
              ))}
              {nextMonthDays.map((day, index) => (
                <div key={`next-${index}`} className="calendar-day next-month">{day}</div>
              ))}
            </div>

            <div className="tasks-section">
              <div className="tasks-header">
                <h3>Upcoming Tasks</h3>
                <a href="#" className="see-all-link">See all</a>
              </div>
              <div className="task-items">
                {tasks.map((task, index) => (
                  <div className="task-item" key={index}>
                    <div className={`date-box ${['07', '11', '12', '30'].includes(task.id) ? 'date-box-highlight' : ''}`}>
                      {task.id}
                    </div>
                    <div className="task-details">
                      <h4>{task.title}</h4>
                      <div className="task-meta">
                        <span className="task-link">{task.description}</span>
                        <span className={`task-status ${task.status === 'Due soon' ? 'due-soon' : 'upcoming'}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="task-time">
                      <span className="time-indicator"></span>
                      <span>{task.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
