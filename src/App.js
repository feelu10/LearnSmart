import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'; // ✅ added Navigate
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
import Settings from './components/Settings';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function LayoutWrapper() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/web/login';
  const isRegisterPage = location.pathname === '/web/register';

  if (isLandingPage || isLoginPage || isRegisterPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/web/login" element={<LoginPage />} />
        <Route path="/web/register" element={<RegisterPage />} />
        {/* ✅ Redirect any unknown public routes to / */}
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
          <Route path="/quiz-builder/generate" element={<ProtectedRoute><GenerateQuizBuilder /></ProtectedRoute>} />
          <Route path="/student-analytics" element={<ProtectedRoute><StudentAnalytics /></ProtectedRoute>} />
          <Route path="/student-analytics/:id" element={<ProtectedRoute><StudentPerformanceAnalytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/quiz-builder/my-quizzes" element={<MyQuizzes />} />

          {/* ✅ Redirect any unknown private routes to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
