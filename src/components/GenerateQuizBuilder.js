import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import avatarIcon from '../assets/avatar.png';

const GenerateQuizBuilder = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 🆕 loader state

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/quizzes`)
      .then((res) => res.json())
      .then((data) => setQuizzes(data.quizzes || []))
      .catch((err) => console.error('Failed to fetch quizzes', err))
      .finally(() => setLoading(false)); // 🆕 stop loader
  }, []);

  const handleInputChange = (qIndex, field, value) => {
    const updated = [...quizzes];
    updated[0].quiz[qIndex][field] = value;
    setQuizzes(updated);
  };

  const handleChoiceChange = (qIndex, key, value) => {
    const updated = [...quizzes];
    updated[0].quiz[qIndex].choices[key] = value;
    setQuizzes(updated);
  };

  const handleAnswerSelect = (qIndex, value) => {
    const updated = [...quizzes];
    updated[0].quiz[qIndex].answer = value;
    setQuizzes(updated);
  };

  const handleSave = (status) => {
    const quiz = quizzes[0];
    const payload = {
      id: quiz._id,
      title: quiz.title,
      quiz: quiz.quiz,
      status,
    };

    const notice = window.PNotify.notice({
      text: 'Saving quiz...',
      hide: false,
      styling: 'brighttheme',
      icons: 'brighttheme',
    });

    fetch(`${process.env.REACT_APP_API_URL}/api/update-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        notice.close();

        window.PNotify.alert({
          text: data.message || 'Quiz saved!',
          type: 'success',
          delay: 2000,
          styling: 'brighttheme',
          icons: 'brighttheme',
        });

        setTimeout(() => {
          window.location.href = '/quiz-builder/my-quizzes';
        }, 2000);
      })
      .catch((err) => {
        notice.close();
        window.PNotify.alert({
          text: 'Failed to save quiz.',
          type: 'error',
          delay: 2000,
          styling: 'brighttheme',
          icons: 'brighttheme',
        });
        console.error('Error saving quiz:', err);
      });
  };

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />

          <div className="flex-1 p-6">
            <PageHeader
              username={localStorage.getItem('user_email')}
              role={localStorage.getItem('user_role') || 'User'}
              avatar={localStorage.getItem('user_avatar') || avatarIcon}
            />

            <div className="bg-white rounded-xl shadow p-6 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-sky-700">Quiz Builder</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800 font-medium"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  {editing ? 'Done' : 'Edit'}
                </button>
              </div>

              {quizzes.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">{quizzes[0].title}</h3>
                  {quizzes[0].quiz.map((q, index) => {
                    const answerLetter =
                      typeof q.answer === 'string'
                        ? q.answer.toUpperCase()
                        : typeof q.answer === 'object'
                        ? q.answer.letter?.toUpperCase()
                        : '';

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
                      >
                        <div className="mb-3">
                          {editing ? (
                            <input
                              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-sky-400"
                              value={q.question}
                              onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                            />
                          ) : (
                            <p className="font-medium text-gray-800">{q.question}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          {['A', 'B', 'C', 'D'].map((key) => (
                            <label
                              key={key}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <input
                                type="radio"
                                name={`answer-${index}`}
                                checked={answerLetter === key}
                                onChange={() => handleAnswerSelect(index, key)}
                                className="accent-sky-500"
                              />
                              {editing ? (
                                <input
                                  type="text"
                                  className="flex-1 border rounded px-3 py-1 focus:ring-1 focus:ring-sky-400"
                                  value={q.choices[key]}
                                  onChange={(e) =>
                                    handleChoiceChange(index, key, e.target.value)
                                  }
                                />
                              ) : (
                                <span>
                                  <strong>{key}:</strong> {q.choices[key]}
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3 justify-end mt-8">
                <button
                  onClick={() => handleSave('draft')}
                  className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  💾 Save Draft
                </button>
                <button
                  onClick={() => handleSave('published')}
                  className="px-5 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 shadow transition"
                >
                  🚀 Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateQuizBuilder;
