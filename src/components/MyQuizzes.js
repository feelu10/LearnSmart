import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';

const MyQuizzes = () => {
  const { data, setData } = useContext(AppContext);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const quizzes = data?.myQuizzes || [];

  useEffect(() => {
    if (Array.isArray(data.myQuizzes)) {
      setLoading(false);
    }
  }, [data.myQuizzes]);


  const confirmDelete = (quizId) => {
    setQuizToDelete(quizId);
    setShowModal(true);
  };

  const handleDeleteQuiz = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quizzes/${quizToDelete}`, {
        method: 'DELETE',
      });
      const respData = await res.json();
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          myQuizzes: (prev.myQuizzes || []).filter(q => q._id !== quizToDelete)
        }));
        setShowModal(false);
      } else {
        alert(respData.error || 'Failed to delete quiz.');
      }
    } catch (err) {
      console.error('Error deleting quiz:', err);
      alert('An error occurred while deleting the quiz.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filter === 'all') return true;
    return quiz.status === filter;
  });

  return (
    <div className="quiz-list-layout flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role')}
          avatar={localStorage.getItem('user_avatar')}
        />

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-sky-700 mb-2">📚 My Quizzes</h2>
          <div className="mt-4 flex items-center gap-2">
            <label className="font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">All</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
          ) : loading && filteredQuizzes.length > 0 ? (
            <div className="flex justify-center items-center h-40">
              <span className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 h-40">
              <span className="text-4xl mb-2">📭</span>
              <p className="text-sm">No quizzes found for this filter.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-sky-700">{quiz.title}</h3>
                <p className="text-sm text-sky-700 font-medium mt-1">
                  🎓 Course: <span className="text-gray-800 font-semibold">{quiz.course || 'N/A'}</span>
                </p>
                <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                  quiz.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {quiz.status || 'draft'}
                </span>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/quiz-builder/generate/${quiz._id}`)}
                    className="text-sm bg-sky-500 text-white px-4 py-1.5 rounded-full hover:bg-sky-600 transition"
                  >
                    View / Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(quiz._id)}
                    className="text-sm text-red-500 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this quiz? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
