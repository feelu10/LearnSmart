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
  const [quizPerformances, setQuizPerformances] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [pendingQuizzes, setPendingQuizzes] = useState([]);

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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok) {
          window.PNotify.alert({
            text: data.error || 'Failed to fetch student info.',
            type: 'error',
            delay: 2500
          });
          navigate('/dashboard');
          return;
        }

        if (currentUserId !== data.custom_id && currentRole !== 'instructor') {
          window.PNotify.alert({
            text: 'Access denied. You are not allowed to view other students\' data.',
            type: 'error',
            delay: 2500
          });
          navigate('/dashboard');
          return;
        }

        const quizResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/quizzes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const quizData = await quizResponse.json();
        const quizzes = quizData.quizzes || quizData;

        const publishedQuizzes = quizzes.filter(q =>
          q.status && q.status.toLowerCase() === 'published'
        );

        const matchedScores = publishedQuizzes.flatMap(q => {
          if (!Array.isArray(q.scores)) return [];
          return q.scores
            .filter(s => s.email?.toLowerCase() === data.email?.toLowerCase())
            .map(s => ({
              ...s,
              quiz_title: q.title
            }));
        });

        const quizzesTaken = matchedScores.length;
        const totalAvailable = publishedQuizzes.length;

        const averageScore = quizzesTaken > 0
          ? Math.round(
              (matchedScores.reduce((sum, s) => sum + (s.score || 0), 0) /
              matchedScores.reduce((sum, s) => sum + (s.total || 1), 0)) * 100
            )
          : 0;

        const lastActivity = matchedScores
          .map(s => new Date(s.submitted_at?.$date || s.submitted_at))
          .sort((a, b) => b - a)[0];

        const quizPerformancesData = matchedScores.map(s => ({
          title: s.quiz_title,
          score: s.score,
          total: s.total,
          percent:
            typeof s.score === 'number' && typeof s.total === 'number' && s.total > 0
              ? Math.round((s.score / s.total) * 100)
              : 0
        }));

        const takenQuizTitles = matchedScores.map(s => s.quiz_title);
        const pending = publishedQuizzes
          .filter(q => !takenQuizTitles.includes(q.title))
          .map(q => q.title);

        setStudent({
          id: data.custom_id || id,
          name: data.email,
          username: data.username || 'Not Available yet',
          avatar: data.avatar || avatarIcon,
          class: data.class || 'General',
          stats: {
            quizzes_taken: quizzesTaken,
            average_score: averageScore,
            last_activity: lastActivity ? lastActivity.toLocaleDateString() : 'N/A'
          }
        });

        setQuizPerformances(quizPerformancesData);
        setCompletionRate(totalAvailable > 0 ? Math.round((quizzesTaken / totalAvailable) * 100) : 0);
        setPendingQuizzes(pending);
      } catch (err) {
        console.error('Student fetch error:', err);
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
            <img src={student.avatar} alt="Student avatar" className="student-large-avatar" />
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
              </div>
              <div className="chart-container">
                <p className="completion-rate-text">{completionRate}% of quizzes completed</p>
              </div>
            </div>

            <div className="analytics-card quiz-performance-card">
              <div className="card-header">
                <h3>Quiz Performance</h3>
              </div>
              <div className="quiz-chart">
                <div className="chart-container">
                  {quizPerformances.length === 0 ? (
                    <p className="text-gray-500 px-4 py-2">No quiz scores yet.</p>
                  ) : (
                    quizPerformances.map((item, index) => {
                      const isValid = typeof item.score === 'number' && typeof item.total === 'number' && item.total > 0;
                      return (
                        <div key={index} className="quiz-chart-column">
                          <div className="quiz-bar-container" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: '140px' }}>
                            <div
                              className="quiz-bar"
                              style={{
                                width: '100%',
                                height: isValid ? `${item.percent}%` : '10%',
                                backgroundColor: isValid
                                  ? item.percent >= 75
                                    ? '#32BFE0'
                                    : '#F87171'
                                  : '#D1D5DB',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                transition: 'height 0.3s'
                              }}
                              title={isValid ? `${item.score}/${item.total} (${item.percent}%)` : 'Invalid score data'}
                            >
                              <div style={{
                                color: '#274060',
                                width: '100%',
                                fontWeight: 600,
                                fontSize: '13px',
                                padding: '4px 2px',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                textAlign: 'center'
                              }}>
                                <div>{item.title}</div>
                                <div style={{ fontSize: '12px', fontWeight: 400 }}>
                                  {isValid ? `${item.score}/${item.total} (${item.percent}%)` : '⚠️ Invalid'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {pendingQuizzes.length > 0 && (
            <div className="analytics-card pending-quizzes-card">
              <div className="card-header">
                <h3>Pending Quizzes</h3>
              </div>
              <ul className="pending-list px-4 py-2">
                {pendingQuizzes.map((title, index) => (
                  <li key={index} className="text-sm py-1 text-gray-700">📌 {title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceAnalytics;
