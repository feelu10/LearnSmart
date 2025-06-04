import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router-dom';

const QuizBuilder = () => {
  const { data } = useContext(AppContext);
  const [course, setCourse] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(5);
  const [material, setMaterial] = useState('');
  const [file, setFile] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.courses && data.courses.length > 0) {
      setCourseList(data.courses);
    } else {
      fetchCourses();
    }
  }, [data]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses`);
      const raw = await res.json();
      if (res.ok) {
        if (Array.isArray(raw)) setCourseList(raw);
        else if (raw.courses && Array.isArray(raw.courses)) setCourseList(raw.courses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAddCourse = async () => {
    const trimmed = customCourse.trim();
    if (trimmed && !courseList.some(c => c.title === trimmed)) {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed })
      });
      const data = await res.json();
      if (res.ok) {
        setCourseList(prev => [...prev, { title: trimmed }]);
        setCourse(trimmed);
        setCustomCourse('');
      }
    }
  };

  const handleDeleteCourse = async (courseName) => {
    if (!window.confirm(`Remove course '${courseName}'?`)) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${encodeURIComponent(courseName)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCourseList(prev => prev.filter(c => c.title !== courseName));
        if (course === courseName) setCourse('');
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Delete course error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    const formData = new FormData();
    formData.append('email', localStorage.getItem('user_email'));
    formData.append('course', course);
    formData.append('title', title);
    formData.append('count', count);
    formData.append('material', material);
    if (file) formData.append('import_file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generate-quiz`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.quiz_id) {
        window.PNotify.alert({ text: 'Quiz generated successfully!', type: 'success', delay: 1200, styling: 'brighttheme' });
        setTimeout(() => navigate(`/quiz-builder/generate/${data.quiz_id}`), 1200);
      } else {
        window.PNotify.alert({ text: data.error || 'Failed to generate quiz.', type: 'error', delay: 2000, styling: 'brighttheme' });
      }
    } catch (error) {
      console.error('Error:', error);
      window.PNotify.alert({ text: 'Something went wrong. Please try again.', type: 'error', delay: 2000, styling: 'brighttheme' });
    } finally {
      setShowLoader(false);
    }
  };

  const handleFetchQuizzes = async () => {
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');
    if (role === 'instructor') {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/get-quizzes?email=${email}`);
        const data = await res.json();
        if (res.ok) {
          setQuizzes(data.quizzes || []);
          setShowQuizzes(true);
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    }
  };

  return (
    <div className="quiz-builder-layout flex">
      {showLoader && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
        </div>
      )}

      <Sidebar />
      <div className="quiz-builder-main flex-1 p-6">
        <PageHeader
          username={localStorage.getItem('user_email') || 'Not Available yet'}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />

        <div className="flex space-x-2 mb-6">
          <button className="px-4 py-1 rounded-full border border-sky-500 text-sky-500 bg-white font-semibold">Prompt</button>
          <button className="px-4 py-1 rounded-full border border-sky-500 bg-sky-500 text-white font-semibold">Create quiz</button>
          <button className="px-4 py-1 rounded-full border border-emerald-500 bg-white text-emerald-500 font-semibold" onClick={() => navigate('/quiz-builder/my-quizzes')}>View My Quizzes</button>
        </div>

        {showQuizzes && quizzes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">My Quizzes</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {quizzes.map((quiz, index) => (
                <li key={index} className="mb-1">{quiz.title} ({quiz.course})</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full border rounded px-4 py-2 mb-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            >
              <option value="">Course Selection</option>
              {courseList.map((c, idx) => (
                <option key={c._id || idx} value={c.title}>{c.title}</option>
              ))}
            </select>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of the topic"
              className="w-full border rounded px-4 py-2 mb-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />

            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="20"
              placeholder="Number of questions (e.g., 5)"
              className="w-full border rounded px-4 py-2 mb-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="importFile" className="w-96 h-48 bg-blue-50 border-2 border-blue-100 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow mb-4">
              <img src="https://img.icons8.com/fluency/96/000000/import.png" className="w-16 mb-2" alt="Import Icon" />
              <span className="text-gray-700 font-medium text-lg">{file ? file.name : 'Import File (.txt, .docx, .pdf)'}</span>
              <input
                type="file"
                id="importFile"
                accept=".txt,.doc,.docx,.pdf"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  e.target.value = null; // Allow same file to be reselected
                }}
              />
            </label>

            {file && (
              <button
                type="button"
                className="mb-4 text-red-600 hover:underline text-sm"
                onClick={() => setFile(null)}
              >
                Remove uploaded file
              </button>
            )}

            {!file && (
              <textarea
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                rows="6"
                className="w-96 border rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none resize-none"
                placeholder="Or paste study material here..."
              ></textarea>
            )}
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-sky-400 text-white px-8 py-2 rounded-full font-semibold text-lg hover:bg-sky-500 transition">Generate Quiz</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizBuilder;
