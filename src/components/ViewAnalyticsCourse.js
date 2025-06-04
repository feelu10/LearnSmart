import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ViewAnalyticsCourse.css';
import avatarIcon from '../assets/avatar.png';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import PageHeader from './PageHeader';

const ViewAnalyticsCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [showLoader, setShowLoader] = useState(true);

  const [analytics, setAnalytics] = useState({
    total_students: 0,
    course_materials: 0,
    quizzes_taken: 0,
    failed_quizzes: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/analytics`);
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setShowLoader(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  const handleTabClick = (tab) => {
    if (tab === 'details') {
      navigate(`/course/${id}`);
    } else if (tab === 'manage') {
      navigate(`/course/${id}/students`);
    }
  };

  const chartData = [
    { name: 'Passed', value: analytics.quizzes_taken - analytics.failed_quizzes },
    { name: 'Failed/Past', value: analytics.failed_quizzes },
  ];

  const barData = [
    { name: 'Students', value: analytics.total_students },
    { name: 'Materials', value: analytics.course_materials },
    { name: 'Quizzes Taken', value: analytics.quizzes_taken },
    { name: 'Failed/Past', value: analytics.failed_quizzes },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  if (showLoader) {
    return (
      <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="analytics-layout">
      <Sidebar />
      <div className="analytics-main">
      <PageHeader
        username={localStorage.getItem('user_email')}
        role={localStorage.getItem('user_role') || 'User'}
        avatar={localStorage.getItem('user_avatar') || avatarIcon}
      />

        <div className="course-header-section">
          <h1 className="course-title">Course Analytics</h1>
        </div>

        <div className="course-tabs">
          <div className="tab-group">
            <button className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} onClick={() => handleTabClick('details')}>Details</button>
            <button className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => handleTabClick('manage')}>Manage Students</button>
            <button className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}>View Analytics</button>
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
                <h2 className="stat-value">{analytics.total_students}</h2>
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
                <h2 className="stat-value">{analytics.quizzes_taken}</h2>
                <p className="stat-label">Quizzes Taken</p>
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
                <h2 className="stat-value">{analytics.failed_quizzes}</h2>
                <p className="stat-label">Failed / Past</p>
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
                <h2 className="stat-value">{analytics.course_materials}</h2>
                <p className="stat-label">Course Material</p>
              </div>
            </div>
          </div>

          <div className="analytics-sections">
            <div className="chart-section">
              <h3>Quiz Results Distribution</h3>
              <PieChart width={300} height={240}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>

            <div className="chart-section">
              <h3>Quiz Metrics Overview</h3>
              <BarChart width={500} height={250} data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnalyticsCourse;