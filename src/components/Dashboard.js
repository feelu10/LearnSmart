// Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import './Dashboard.css';
import avatarIcon from '../assets/avatars.png';
import PageHeader from './PageHeader';

const Dashboard = () => {
  const { data } = useContext(AppContext);
  const [activityItems, setActivityItems] = useState([]);
  const [classEngagementData, setClassEngagementData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`);
        const data = await res.json();
        setTasks(data || []);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);


  useEffect(() => {
    if (data?.activityLogs?.length > 0) {
      setActivityItems(
        data.activityLogs.map(log => ({
          icon: log.action === 'enroll_student' ? 'user' : 'document',
          title: log.action === 'enroll_student' ? 'Student Enrolled' : 'Join Request',
          description: log.details,
          timeAgo: formatTimeAgo(log.timestamp),
          avatar: `${process.env.REACT_APP_API_URL}${log.avatar || '/static/img/avatar-default.png'}`,
          courseId: log.course_id || null
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
            avatar: `${process.env.REACT_APP_API_URL}${log.avatar || '/static/img/avatar-default.png'}`,
            courseId: log.course_id || null
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
          courseId: item._id || item.course_id,
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivityItems = activityItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activityItems.length / itemsPerPage);

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const nextMonthDays = [1, 2, 3, 4];

  return (
    <div className="dashboard">
      <PageHeader
        username={localStorage.getItem('user_email')}
        role={localStorage.getItem('user_role') || 'User'}
        avatar={localStorage.getItem('user_avatar') || avatarIcon}
      />

      <div className="dashboard-layout">
        <div className="dashboard-left">
          <div className="student-activity-card">
            <div className="card-header">
              <h2>Student Activity</h2>
              <button className="more-btn">⋮</button>
            </div>
            <div className="activity-list">
              {currentActivityItems.map((item, index) => {
                const content = (
                  <div className="activity-item">
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
                      <p className="activity-course text-sm text-blue-600 italic underline">
                        View course activity
                      </p>
                    </div>
                    <div className="activity-time">{item.timeAgo}</div>
                  </div>
                );

                return (
                  <a
                    key={index}
                    href={item.courseId ? `/course/${item.courseId}/students` : '#'}
                    className={`activity-link-wrapper block transition duration-150 ease-in-out ${
                      item.courseId ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!item.courseId) e.preventDefault();
                    }}
                  >
                    {content}
                  </a>
                );
              })}
              {activityItems.length === 0 && <p>No recent activity found.</p>}
            </div>
            {totalPages > 1 && (
              <div className="pagination-controls flex justify-end mt-4 pr-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-button mx-1 px-3 py-1 rounded ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
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
                  <a href={`/course/${item.courseId}`} key={index} className="engagement-item-link">
                    <div className="engagement-item">
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
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Calendar + Tasks */}
        <div className="dashboard-right">
          <div className="upcoming-activities-card">
            <div className="calendar-header">
              <h2>This Month</h2>
              <div className="calendar-controls">
                <button className="calendar-nav">‹</button>
                <button className="calendar-nav">›</button>
              </div>
            </div>

            <div className="weekday-row">
              {weekdays.map((day, index) => <div key={index}>{day}</div>)}
            </div>

            <div className="days-grid">
              {days.map((day, index) => {
                const today = new Date();
                const currentDate = today.getDate();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();

                const taskCount = tasks.filter(task => {
                  const taskDate = new Date(task.date);
                  return (
                    taskDate.getDate() === day &&
                    taskDate.getMonth() === currentMonth &&
                    taskDate.getFullYear() === currentYear
                  );
                }).length;

                let bgColor = 'bg-white';
                if (taskCount >= 3) bgColor = 'bg-red-400 text-white';
                else if (taskCount === 2) bgColor = 'bg-yellow-300';
                else if (taskCount === 1) bgColor = 'bg-green-300';
                else bgColor = 'bg-gray-100';

                const isToday = day === currentDate;

                return (
                  <div
                    key={index}
                    className={`calendar-day rounded-full w-8 h-8 flex items-center justify-center font-bold transition 
                      ${bgColor} 
                      ${isToday ? 'highlighted-day' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
              {nextMonthDays.map((day, index) => (
                <div key={`next-${index}`} className="calendar-day next-month">{day}</div>
              ))}
            </div>

            <div className="tasks-section">
              <div className="tasks-header">
                <h3>Upcoming Tasks</h3>
                <a href="/task-calendar" className="see-all-link text-blue-600 hover:underline">See all</a>
              </div>
             <div className="task-items">
              {[...tasks]
                .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
                .slice(0, 5)
                .map((task, index) => {
                  const durationNum = parseFloat(task.duration || 0);
                  const hours = Math.floor(durationNum);
                  const minutes = Math.round((durationNum - hours) * 60);
                  const formattedDuration =
                    hours > 0 && minutes > 0
                      ? `${hours} hr ${minutes} min`
                      : hours > 0
                      ? `${hours} hr${hours > 1 ? 's' : ''}`
                      : `${minutes} min`;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg shadow-sm mb-3 transition hover:bg-blue-100"
                    >
                      {/* Date Circle */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-blue-200 text-blue-800 font-bold">
                        {new Date(task.date).getDate()}
                      </div>

                      {/* Task Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-0.5">{task.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                          <span className="italic underline text-blue-600">
                            {task.description || 'No description'}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                            {task.time}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                            {formattedDuration}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {tasks.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">No upcoming tasks.</p>
              )}
            </div>
              <a
                href="/task-calendar"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                + Create Task
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
