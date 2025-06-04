import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyCourse from './components/MyCourse';
import TopicCourse from './components/TopicCourse';
import ManageStudentCourse from './components/ManageStudentCourse';
import ViewAnalyticsCourse from './components/ViewAnalyticsCourse';
import QuizBuilder from './components/QuizBuilder';
import GenerateQuizBuilder from './components/GenerateQuizBuilder';
import StudentAnalytics from './components/StudentAnalytics';
import StudentPerformanceAnalytics from './components/StudentPerformanceAnalytics';
import MyQuizzes from './components/MyQuizzes';
import TakeQuizPage from './components/TakeQuizPage';
import Settings from './components/Settings';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import TaskCalendar from './components/TaskCalendar';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UsersManagement';

import { AppContext, AppProvider } from './AppContext';

function LayoutWrapper() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/web/login';
  const isRegisterPage = location.pathname === '/web/register';

  const { setData } = useContext(AppContext);

  useEffect(() => {
    if (!isLandingPage && !isLoginPage && !isRegisterPage) {
      import('./components/MyCourse');
      import('./components/QuizBuilder');
      import('./components/StudentAnalytics');

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const preload = async () => {
        try {
          const [
            coursesRes,
            quizzesRes,
            studentsRes,
            settingsRes,
            activityLogsRes,
            engagementRes,
            userQuizzesRes, // <-- ADD THIS
          ] = await Promise.all([
            fetch(`${process.env.REACT_APP_API_URL}/api/courses`),
            fetch(`${process.env.REACT_APP_API_URL}/api/quizzes`),
            fetch(`${process.env.REACT_APP_API_URL}/api/students`, { headers }),
            fetch(`${process.env.REACT_APP_API_URL}/api/settings`, { headers }),
            fetch(`${process.env.REACT_APP_API_URL}/api/activity-logs`, { headers }),
            fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/course-engagement`),
            fetch(`${process.env.REACT_APP_API_URL}/api/get-quizzes?email=${localStorage.getItem('user_email')}`), // <-- HERE
          ]);

          const [
            courses,
            quizzes,
            students,
            settings,
            activityLogs,
            engagement,
            userQuizzes,
          ] = await Promise.all([
            coursesRes.json(),
            quizzesRes.json(),
            studentsRes.json(),
            settingsRes.json(),
            activityLogsRes.json(),
            engagementRes.json(),
            userQuizzesRes.json(),
          ]);

          setData({
            courses: courses.courses || courses,
            quizzes: quizzes.quizzes || quizzes,
            students: students.students || students,
            settings,
            activityLogs: activityLogs.logs || [],
            classEngagement: engagement.engagement || [],
            myQuizzes: userQuizzes.quizzes || [],
          });
        } catch (err) {
          console.error('❌ Preload failed:', err);
        }
      };

      preload();
    }
  }, [location.pathname]);

  if (isLandingPage || isLoginPage || isRegisterPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/web/login" element={<LoginPage />} />
        <Route path="/web/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/mycourse" element={<ProtectedRoute><MyCourse /></ProtectedRoute>} />
          <Route path="/course/:id" element={<ProtectedRoute><TopicCourse /></ProtectedRoute>} />
          <Route path="/course/:id/students" element={<ProtectedRoute><ManageStudentCourse /></ProtectedRoute>} />
          <Route path="/course/:id/analytics" element={<ProtectedRoute><ViewAnalyticsCourse /></ProtectedRoute>} />
          <Route path="/quiz-builder" element={<ProtectedRoute><QuizBuilder /></ProtectedRoute>} />
          <Route path="/quiz-builder/generate/:id" element={<ProtectedRoute><GenerateQuizBuilder /></ProtectedRoute>} />
          <Route path="/take-quiz/:courseName" element={<ProtectedRoute expected={['student', 'instructor']}><TakeQuizPage /></ProtectedRoute>} />
          <Route path="/student-analytics" element={<ProtectedRoute expected={['instructor']}><StudentAnalytics /></ProtectedRoute>} />
          <Route path="/student-analytics/:id" element={<ProtectedRoute expected={['student', 'instructor']}><StudentPerformanceAnalytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/quiz-builder/my-quizzes" element={<MyQuizzes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/task-calendar" element={<TaskCalendar />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute expected={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute expected={['admin']}><UserManagement /></ProtectedRoute>} />

        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </AppProvider>
  );
}

export default App;
