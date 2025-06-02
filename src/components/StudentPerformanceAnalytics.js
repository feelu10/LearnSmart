import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './StudentPerformanceAnalytics.css';
import avatarIcon from '../assets/avatars.png';
import PageHeader from './PageHeader';

const StudentPerformanceAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem('token');
      const currentUserId = localStorage.getItem('user_id');
      const currentRole = localStorage.getItem('user_role');

      if (!token) {
        window.PNotify.alert({
          text: 'No token found. Please log in.',
          type: 'error',
          delay: 2500
        });
        navigate('/web/login');
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/students/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          if (currentUserId !== data.custom_id && currentRole !== 'instructor') {
            window.PNotify.alert({
              text: 'Access denied. You are not allowed to view other students\' data.',
              type: 'error',
              delay: 2500
            });
            navigate('/dashboard');
            return;
          }

          setStudent({
            id: data.custom_id || id,
            name: data.email,
            username: data.username || 'Not Available yet',
            avatar: data.avatar || avatarIcon,
            class: data.class || 'General',
            stats: data.stats || {
              quizzes_taken: 0,
              average_score: 0,
              last_activity: 'N/A'
            }
          });
        } else {
          window.PNotify.alert({
            text: data.error || 'Failed to fetch student info.',
            type: 'error',
            delay: 2500
          });
          navigate('/dashboard');
        }
      } catch (err) {
        window.PNotify.alert({
          text: 'Server error while fetching student data.',
          type: 'error',
          delay: 2500
        });
      } finally {
        setShowLoader(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  if (showLoader) {
    return (
      <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-red-600">Student Not Found</h2>
          <p className="text-gray-600 mt-2">The student you're trying to view does not exist or you don't have permission.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-analytics-layout">
      <Sidebar />
      <div className="performance-analytics-main">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />

        <div className="student-profile-section">
          <div className="student-avatar-container">
            <img
              src={student.avatar}
              alt="Student avatar"
              className="student-large-avatar"
            />
          </div>
          <div className="student-details">
            <h2 className="student-name">{student.username}</h2>
            <p className="student-role">{student.class}</p>
            <p className="student-meta"><strong>Email:</strong> {student.name}</p>
            <p className="student-meta"><strong>Quizzes Taken:</strong> {student.stats.quizzes_taken}</p>
            <p className="student-meta"><strong>Average Score:</strong> {student.stats.average_score}%</p>
            <p className="student-meta"><strong>Last Activity:</strong> {student.stats.last_activity}</p>
          </div>
        </div>

        <div className="analytics-container">
          <div className="analytics-row">
            <div className="analytics-card completion-rate-card">
              <div className="card-header">
                <h3>Completion Rate</h3>
                <div className="time-filter">
                  <span>This week</span>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="completion-chart">
                <div className="chart-container">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} className="chart-column">
                      <div className="bar-container">
                        <div className="bar" style={{ height: `${10 + Math.random() * 20}%`, backgroundColor: '#32BFE0' }}></div>
                        <div className="light-bar" style={{ height: `${5 + Math.random() * 15}%`, backgroundColor: '#E5F6FA' }}></div>
                      </div>
                      <span className="day-label">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="analytics-card quiz-performance-card">
              <div className="card-header">
                <h3>Quiz Performance</h3>
              </div>
              <div className="quiz-chart">
                <div className="chart-container">
                  {Array(8).fill().map((_, index) => (
                    <div key={index} className="quiz-chart-column">
                      <div className="quiz-bar-container">
                        <div
                          className="quiz-bar"
                          style={{
                            height: `${20 + Math.random() * 30}%`,
                            backgroundColor: index % 2 === 0 ? '#32BFE0' : '#E5F6FA'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card time-spent-card">
            <div className="card-header">
              <h3>Time Spent Learning</h3>
            </div>
            <div className="time-spent-chart">
              <div className="calendar-container">
                {Array(7).fill().map((_, rowIndex) => (
                  <div key={rowIndex} className="calendar-row">
                    {Array(15).fill().map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="calendar-cell"
                        style={{
                          backgroundColor: Math.random() > 0.5
                            ? `rgba(50, 191, 222, ${0.2 + Math.random() * 0.6})`
                            : 'rgba(50, 191, 222, 0.1)'
                        }}
                      ></div>
                    ))}
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

export default StudentPerformanceAnalytics;
