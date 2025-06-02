import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router-dom';

const QuizBuilder = () => {
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
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setCourseList(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAddCourse = async () => {
    const trimmed = customCourse.trim();
    if (trimmed && !courseList.some(c => c.name === trimmed)) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmed })
        });
        const data = await res.json();
        if (res.ok) {
          setCourseList(prev => [...prev, { name: trimmed }]);
          setCourse(trimmed);
          setCustomCourse('');
        } else {
          alert(data.error || 'Failed to add course');
        }
      } catch (err) {
        console.error('Add course error:', err);
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
        setCourseList(prev => prev.filter(c => c.name !== courseName));
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

      if (response.ok) {
        localStorage.setItem('generated_quiz', JSON.stringify(data.quiz));
        localStorage.setItem('quiz_title', data.title || title);

        window.PNotify.alert({ text: 'Quiz generated successfully!', type: 'success', delay: 1500, styling: 'brighttheme' });
        setTimeout(() => navigate('/quiz-builder/generate'), 1500);
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
                <option key={c._id || idx} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                placeholder="Add new course"
                className="flex-1 border rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCourse}
                className="bg-emerald-500 text-white px-4 rounded hover:bg-emerald-600"
              >Add</button>
            </div>

            <ul className="text-sm text-gray-600 mb-3">
              {courseList.map((c, i) => (
                <li key={i} className="flex items-center justify-between">
                  {c.name}
                  <button type="button" onClick={() => handleDeleteCourse(c.name)} className="text-red-500 hover:underline text-xs">Remove</button>
                </li>
              ))}
            </ul> */}

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
              <span className="text-gray-700 font-medium text-lg">Import File (.txt, .docx, .pdf)</span>
              <input type="file" id="importFile" accept=".txt,.doc,.docx,.pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>

            <textarea
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              rows="6"
              className="w-96 border rounded px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none resize-none"
              placeholder="Or paste study material here..."
            ></textarea>
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
