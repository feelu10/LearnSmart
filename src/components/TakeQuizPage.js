import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TakeQuizPage = () => {
  const { courseName } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  const email = localStorage.getItem('user_email');
  setUserRole(role);
  setUserEmail(email);

  // Choose endpoint by role
  const apiPath = role === 'instructor'
    ? `/api/courses/${courseName}/quizzes/instructor`
    : `/api/courses/${courseName}/quizzes`;


  fetch(`${process.env.REACT_APP_API_URL}${apiPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(async res => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Access denied');
      }
      return res.json();
    })
    .then(data => {
      setQuizzes(data.quizzes || []);
    })
    .catch(err => {
      setErrorMsg(err.message || 'Failed to load quizzes.');
      setQuizzes([]);
    })
    .finally(() => setLoading(false));
}, [courseName]);

  const handleAnswerChange = (letter) => {
    setAnswers({ ...answers, [currentIndex]: letter });
  };

  const handleNext = () => setCurrentIndex(currentIndex + 1);
  const handleBack = () => setCurrentIndex(currentIndex - 1);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError('');

    const total = selectedQuiz.quiz.length;
    for (let i = 0; i < total; i++) {
      if (!answers.hasOwnProperty(i)) {
        setSubmitLoading(false);
        setSubmitError(`Please answer all questions before submitting.`);
        return;
      }
    }

    if (!selectedQuiz || !selectedQuiz._id || selectedQuiz._id.length !== 24) {
      setSubmitLoading(false);
      setSubmitError('Quiz ID is invalid. Please refresh and try again.');
      return;
    }

    const token = localStorage.getItem('token');
    const quizResult = {
      quiz_id: selectedQuiz._id,
      answers,
      email: userEmail
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quizzes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quizResult)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unauthorized or submission failed');
      }
      alert('Quiz submitted successfully!');
      setSelectedQuiz(null);
      setAnswers({});
      setCurrentIndex(0);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit quiz.');
      console.error(err);
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="animate-spin h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700">{errorMsg}</p>
      </div>
    );
  }

  if (!selectedQuiz && quizzes.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Quizzes Available</h2>
        <p className="text-gray-600">You are not enrolled in this course or no quizzes are published.</p>
      </div>
    );
  }

  // Instructor: Show quiz results table for all students
  if (userRole === 'instructor' && !selectedQuiz) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Results for "{courseName}"</h2>
        {quizzes.map(quiz => (
          <div key={quiz._id} className="border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Total Students: {quiz.total_enrolled} | Taken: {quiz.total_taken}
            </p>
            <table className="min-w-full table-auto text-left text-sm mb-2">
              <thead>
                <tr>
                  <th className="px-2 py-1 border">Name</th>
                  <th className="px-2 py-1 border">Email</th>
                  <th className="px-2 py-1 border">Score</th>
                  <th className="px-2 py-1 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {quiz.scores.map(student => (
                  <tr key={student.email}>
                    <td className="px-2 py-1 border">{student.name || '-'}</td>
                    <td className="px-2 py-1 border">{student.email}</td>
                    <td className="px-2 py-1 border">
                      {student.score !== null && student.score !== undefined
                        ? `${student.score} / ${student.total}`
                        : <span className="text-gray-400">Not Taken</span>}
                    </td>
                    <td className="px-2 py-1 border">
                      {student.submitted_at ? new Date(student.submitted_at).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  // Student: List quizzes, take quiz, or show result
  if (!selectedQuiz) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Select a Quiz from {courseName}</h2>
        <ul className="space-y-4">
          {quizzes.map(q => {
            const myScore = q.scores?.find(s => s.email === userEmail);
            const totalTaken = q.scores?.length || 0;
            const avgScore = totalTaken > 0
              ? (q.scores.reduce((sum, s) => sum + (s.score || 0), 0) / totalTaken).toFixed(1)
              : 0;

            return (
              <li key={q._id} className="border p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{q.title}</h3>
                    <p className="text-sm text-gray-500">{q.quiz.length} questions</p>
                    <p className="text-sm text-gray-600">
                      Taken by {totalTaken} student(s), avg: {avgScore} / {q.quiz.length}
                    </p>
                    {userRole !== 'instructor' && myScore && (
                      <p className="text-sm text-green-600">
                        You scored {myScore.score} / {myScore.total}
                      </p>
                    )}
                  </div>
                  {userRole !== 'instructor' && !myScore && (
                    <button
                      className="bg-sky-600 text-white px-4 py-1 rounded hover:bg-sky-700"
                      onClick={() => {
                        setSelectedQuiz(q);
                        setCurrentIndex(0);
                        setAnswers({});
                      }}
                    >
                      Take Quiz
                    </button>
                  )}
                  {userRole === 'instructor' && (
                    <div className="text-sm text-gray-400 italic">View Only</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Student: Take quiz UI
  const question = selectedQuiz.quiz[currentIndex];
  const total = selectedQuiz.quiz.length;
  const selectedAnswer = answers[currentIndex];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{selectedQuiz.title}</h2>
      <div className="mb-6">
        <p className="text-md font-semibold mb-2">Question {currentIndex + 1} of {total}</p>
        <p className="text-lg mb-4">{question.question}</p>
        <div className="space-y-2">
          {Object.entries(question.choices).map(([letter, text]) => (
            <label key={letter} className="block border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name={`question-${currentIndex}`}
                value={letter}
                checked={selectedAnswer === letter}
                onChange={() => handleAnswerChange(letter)}
                className="mr-2"
              />
              <span>{letter}. {text}</span>
            </label>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0 || submitLoading}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        {currentIndex < total - 1 ? (
          <button
            onClick={handleNext}
            disabled={submitLoading}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuizPage;
