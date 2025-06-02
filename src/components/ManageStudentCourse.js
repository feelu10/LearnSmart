import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ManageStudentCourse.css';
import avatarIcon from '../assets/avatars.png';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

// "x mins ago"
function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const created = new Date(dateString);
  const seconds = Math.floor((now - created) / 1000);
  if (seconds < 60) return 'Just now';
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1)
      return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
  }
  return '';
}

const ManageStudentCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manage');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStudentEmail, setAddStudentEmail] = useState('');
  const [addStudentName, setAddStudentName] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [statusTab, setStatusTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // For dropdown
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('user_email');

  useEffect(() => {
    fetchStudents();
    fetchCourse();
    // eslint-disable-next-line
  }, [id]);

  const fetchCourse = async () => {
    setGlobalLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourse(data.course || null);

      // --- End debug lines ---
      setLoading(false);
    } catch {
      setLoading(false);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data.students || []);
    } catch (e) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all registered students for dropdown
  const fetchAllStudents = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/students/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllStudents(data.students || []);
    } catch {
      setAllStudents([]);
    }
  };

  // Open modal: fetch all students for selection
  const handleShowAddModal = () => {
    fetchAllStudents();
    setShowAddModal(true);
  };

  // Filter by search bar and by status tab
  const filteredStudents = students.filter(student =>
    (student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.id?.toLowerCase().includes(search.toLowerCase()))
  );
  const studentsByTab = filteredStudents.filter(student => {
    if (statusTab === 'all') return true;
    if (statusTab === 'pending') return (student.status || '').toLowerCase() === 'pending';
    if (statusTab === 'accepted') return ['in progress', 'complete', 'approved', 'accepted'].includes((student.status || '').toLowerCase());
    if (statusTab === 'rejected') return (student.status || '').toLowerCase() === 'rejected';
    return true;
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStudents = studentsByTab.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(studentsByTab.length / rowsPerPage);

  const isOwner = course && course.owner === userEmail;
  const alreadyEnrolled = students.some(s => s.email === userEmail && ['in progress', 'complete', 'approved', 'accepted'].includes((s.status || '').toLowerCase()));
  const alreadyPending = students.some(s => s.email === userEmail && (s.status || '').toLowerCase() === 'pending');

  // Add student as instructor
  const handleAddStudent = async () => {
    if (!addStudentEmail.trim()) {
      window.PNotify.alert({ text: 'Both name and email are required.', type: 'error' });
      return;
    }
    setGlobalLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: addStudentName, email: addStudentEmail }),
      });
      if (res.ok) {
        window.PNotify.alert({ text: 'Student added successfully.', type: 'success' });
        setShowAddModal(false);
        setAddStudentEmail('');
        setAddStudentName('');
        setSelectedStudent(null);
        fetchStudents();
      } else {
        const data = await res.json();
        window.PNotify.alert({ text: data.error || 'Error adding student.', type: 'error' });
      }
    } catch {
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    } finally {
      setGlobalLoading(false);
    }
  };

  // Apply to join as student (self-apply)
  const handleApply = async () => {
    setApplyLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/students/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: userEmail }),
      });
      if (res.ok) {
        window.PNotify.alert({ text: 'Applied to join! Waiting for instructor approval.', type: 'success' });
        fetchStudents();
      } else {
        const data = await res.json();
        window.PNotify.alert({ text: data.error || 'Error applying.', type: 'error' });
      }
    } catch {
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    } finally {
      setApplyLoading(false);
    }
  };

  // Instructor accept/reject
  const updateStudentStatus = async (studentId, newStatus) => {
    setGlobalLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/students/${studentId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        window.PNotify.alert({ text: `Student ${newStatus}`, type: 'success' });
        fetchStudents();
      } else {
        const data = await res.json();
        window.PNotify.alert({ text: data.error || 'Error updating status.', type: 'error' });
      }
    } catch {
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    } finally {
      setGlobalLoading(false);
    }
  };


  const handleTabClick = (tab) => {
    if (tab === 'details') {
      setActiveTab('details');
      navigate(`/course/${id}`);
    } else if (tab === 'analytics') {
      setActiveTab('analytics');
      navigate(`/course/${id}/analytics`);
    } else {
      setActiveTab('manage');
    }
  };

  

  return (
    <div className="manage-students-layout">
      <Sidebar />
      <div className="manage-students-main">
        <PageHeader
          username={userEmail}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />
        {/* Tabs */}
        <div className="course-tabs">
          <div className="tab-group">
            <button className={`tab-button ${activeTab === 'details' ? 'active' : ''}`} onClick={() => handleTabClick('details')}>Details</button>
            <button className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => handleTabClick('manage')}>Manage Students</button>
            <button className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => handleTabClick('analytics')}>View Analytics</button>
          </div>
           {/* Add Student Button - Only for Owner */}
          {isOwner && (
            <button className="add-content-btn" onClick={handleShowAddModal}>
              + Add Student
            </button>
          )}
          {/* Apply to Join - Only for users NOT enrolled and not owner */}
          {!isOwner && !alreadyEnrolled && !alreadyPending && (
            <button className="add-content-btn" onClick={handleApply} disabled={applyLoading}>
              {applyLoading ? 'Applying...' : 'Apply to Join'}
            </button>
          )}
          {/* Pending notice */}
          {!isOwner && alreadyPending && (
            <span className="ml-2 text-yellow-600 font-semibold">Pending approval</span>
          )}
        </div>

        {/* Filter Status Tabs */}
        <div className="flex gap-2 mb-4">
          <button className={`px-4 py-1 rounded ${statusTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setStatusTab('all')}>All</button>
          <button className={`px-4 py-1 rounded ${statusTab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`} onClick={() => setStatusTab('pending')}>Pending</button>
          <button className={`px-4 py-1 rounded ${statusTab === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-100'}`} onClick={() => setStatusTab('accepted')}>Accepted</button>
          <button className={`px-4 py-1 rounded ${statusTab === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100'}`} onClick={() => setStatusTab('rejected')}>Rejected</button>
        </div>

        {/* Course Title/Header */}
        <div className="course-header-section mb-4">
          {loading ? (
            <h1 className="course-title">Loading...</h1>
          ) : course ? (
            <div className="flex items-start gap-4">
              <img src={course.image ? `${process.env.REACT_APP_API_URL}/${course.image}` : avatarIcon} alt="Course" className="w-24 h-24 rounded object-cover" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
            </div>
          ) : (
            <h1 className="text-red-600">Course not found</h1>
          )}
        </div>

        {/* Search bar */}
        <div className="flex mb-4 gap-2 items-center">
          <input
            className="border rounded px-3 py-1"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 200 }}
          />
        </div>

        <div className="students-table-container p-4 bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="flex justify-center items-center py-8 text-gray-400 text-lg">
              <span className="mr-2">Loading students...</span>
              <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A8 8 0 104 12z"></path>
              </svg>
            </div>
          ) : studentsByTab.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-20 bg-white rounded shadow">
              <span style={{ fontSize: 64, marginBottom: 18 }} role="img" aria-label="no students">🧑‍🎓</span>
              <div className="text-gray-500 text-2xl font-semibold mb-2">No students found.</div>
              <div className="text-gray-400 text-base">Invite or enroll students to this class.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Student ID</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Class Enrolled</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentStudents.map((student, index) => (
                    <tr key={student.id || index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-gray-600">{student.id}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            src={student.avatar || avatarIcon}
                            alt="avatar"
                          />
                          <span className="font-medium text-gray-800">{student.name || "Not fill yet"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-700">{student.email || "---"}</td>

                      <td className="px-4 py-3 text-gray-700 flex items-center gap-1">
                        📅 <span>{timeAgo(student.enrolled_at || student.date)}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold
                          ${
                            student.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            student.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                            student.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {student.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-700">{student.class}</td>

                      <td className="px-4 py-3 text-right">
                        {isOwner && student.status === 'Pending' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => updateStudentStatus(student.id, 'Accepted')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateStudentStatus(student.id, 'Rejected')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-600">
                  Showing {studentsByTab.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, studentsByTab.length)} of {studentsByTab.length} students
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>


        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-popIn">
              <h2 className="text-xl font-bold mb-4">Add Student</h2>
              
              {/* Searchable Dropdown */}
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Search student name or email"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="max-h-40 overflow-y-auto mb-3 border rounded">
                {allStudents
                  .filter(s =>
                    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
                    (s.email || '').toLowerCase().includes(search.toLowerCase())
                  )
                  .map((s, idx) => (
                    <div
                      key={s.email}
                      onClick={() => {
                        setSelectedStudent(s);
                        setAddStudentEmail(s.email);
                        setAddStudentName(s.name);
                        setSearch('');
                      }}
                      className={`flex items-center px-2 py-2 cursor-pointer hover:bg-blue-100 ${
                        selectedStudent && selectedStudent.email === s.email ? 'bg-blue-200' : ''
                      }`}
                    >
                      <img
                        src={s.avatar || avatarIcon}
                        alt="Student"
                        className="w-8 h-8 rounded-full mr-2 border"
                      />
                      <div>
                        <div className="font-semibold">{s.name || s.email.split('@')[0]}</div>
                        <div className="text-xs text-gray-500">{s.email}</div>
                      </div>
                    </div>
                  ))}
              </div>

              <input
                className="w-full mb-3 p-2 border rounded"
                placeholder="Student Email"
                type="email"
                value={addStudentEmail}
                onChange={e => setAddStudentEmail(e.target.value)}
              />
              <input
                className="w-full mb-3 p-2 border rounded"
                placeholder="Student Name"
                value={addStudentName}
                onChange={e => setAddStudentName(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedStudent(null);
                    setAddStudentEmail('');
                    setAddStudentName('');
                    setSearch('');
                  }}
                >Cancel</button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleAddStudent}
                  disabled={globalLoading}
                >
                  {globalLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      {globalLoading && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ManageStudentCourse;
