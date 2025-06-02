import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import './MyCourse.css';
import avatarIcon from '../assets/avatars.png';
import { useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';
import { AppContext } from '../AppContext';

const MyCourse = () => {
  const navigate = useNavigate();
  const { data, setData } = useContext(AppContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('title');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.courses && data.courses.length > 0) {
      setMyCourses(data.courses);
      setLoading(false);
    } else {
      fetchCourses();
    }
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetched = await res.json();
      if (res.ok) {
        setMyCourses(fetched);
        setData((prev) => ({ ...prev, courses: fetched }));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
    setLoading(false);
  };

  const handleCourseClick = (id) => navigate(`/course/${id}`);

  const handleAddCourse = async () => {
    if (!title.trim() || !description.trim()) {
      window.PNotify.alert({ text: 'Title and Description are required.', type: 'error' });
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setTitle('');
        setDescription('');
        setImageFile(null);
        setModalOpen(false);
        fetchCourses(); // refresh list
        window.PNotify.alert({ text: 'Course added successfully.', type: 'success' });
      } else {
        window.PNotify.alert({ text: data.error || 'Failed to add course.', type: 'error' });
      }
    } catch (err) {
      console.error('Error adding course:', err);
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    }
  };

  const filteredCourses = myCourses.filter((c) =>
    c.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === 'title') return a.title.localeCompare(b.title);
    if (sortOption === 'date') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  return (
    <div className="mycourse-layout">
      <Sidebar />
      <div className="mycourse-main">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />

        <div className="mycourse-controls flex items-center justify-between mb-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Course
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search My Courses"
              className="border p-2 rounded"
              value={courseSearchQuery}
              onChange={(e) => setCourseSearchQuery(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="date">Newest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading courses...</div>
        ) : (
          <div className="course-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                className="cursor-pointer bg-white shadow rounded overflow-hidden"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {course.image ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${course.image}`}
                      alt="Course"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={avatarIcon} alt="default" className="h-20" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Course</h2>
              <input
                type="text"
                placeholder="Course Title"
                className="w-full mb-3 p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Course Description"
                className="w-full mb-3 p-2 border rounded"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="mb-4"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourse}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;
