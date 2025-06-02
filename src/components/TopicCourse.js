import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './TopicCourse.css';
import avatarIcon from '../assets/avatars.png';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from './PageHeader';

const TopicCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState([]);
  const [showAddContent, setShowAddContent] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', description: '' });
  const [attachments, setAttachments] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  // Edit modal states
  const [editingContent, setEditingContent] = useState(null);
  const [editAttachments, setEditAttachments] = useState([]);
  const [editOldAttachments, setEditOldAttachments] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingContentId, setDeletingContentId] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);


  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourse();
    fetchContents();
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
      setLoading(false);
    } catch {
      setLoading(false);
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchContents = async () => {
    setGlobalLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/contents`);
      const data = await res.json();
      if (res.ok) setContents(data.contents || []);
    } catch {} 
    finally {
      setGlobalLoading(false);
    }
  };


  const renderAttachment = (att, i, originalFilename = null) => {
    const fileUrl = `${process.env.REACT_APP_API_URL}/${att}`;
    const ext = att.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
    const filename = originalFilename || att.split('/').pop();

    return (
      <div key={i} className="flex flex-col items-center min-w-[90px]">
        {isImage ? (
          <>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={fileUrl}
                alt={filename}
                className="w-16 h-16 object-cover rounded border mb-1 bg-white"
                style={{ cursor: 'pointer' }}
              />
            </a>
            <a href={fileUrl} download={filename} className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors mt-1" title="Download">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              <span className="text-xs">Download</span>
            </a>
            <span className="text-xs text-gray-500 mt-1 truncate max-w-[80px]">{filename}</span>
          </>
        ) : (
          <>
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border rounded mb-1">
              <a href={fileUrl} download={filename} className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors" title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
              </a>
            </div>
            <span className="text-xs text-gray-700 text-center truncate max-w-[80px]">{filename}</span>
          </>
        )}
      </div>
    );
  };


  // ADD CONTENT
  const handleAddContent = async () => {
    if (!newContent.title.trim() || !newContent.description.trim()) {
      return window.PNotify.alert({ text: 'All fields are required.', type: 'error' });
    }
    setContentLoading(true);
    setGlobalLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', newContent.title);
      formData.append('description', newContent.description);
      formData.append('email', localStorage.getItem('user_email') || 'guest');
      for (const file of attachments) {
        formData.append('attachments', file);
      }
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/contents`, {
        method: 'POST',
        body: formData,
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return window.PNotify.alert({ text: 'Server error: invalid response.', type: 'error' });
      }
      if (res.ok) {
        window.PNotify.alert({ text: 'Content added.', type: 'success' });
        setNewContent({ title: '', description: '' });
        setAttachments([]);
        setShowAddContent(false);
        fetchContents();
      } else {
        window.PNotify.alert({ text: data.error || 'Failed to add content.', type: 'error' });
      }
    } catch {
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    } finally {
      setContentLoading(false);
      setGlobalLoading(false);
    }
  };

  // EDIT Content (modal)
  const handleEditContent = (content) => {
    setEditingContent({ ...content });
    setEditOldAttachments(content.attachments || []);
    setEditAttachments([]);
  };

  // Remove old attachment (from edit)
  const handleRemoveOldAttachment = (index) => {
    setEditOldAttachments(editOldAttachments.filter((_, i) => i !== index));
  };

  // Remove new (before save)
  const handleRemoveEditAttachment = (index) => {
    setEditAttachments(editAttachments.filter((_, i) => i !== index));
  };

  // Remove from add new (before submit)
  const handleRemoveAddAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // UPDATE content
  const handleUpdateContent = async () => {
    if (!editingContent.title.trim() || !editingContent.description.trim()) {
      return window.PNotify.alert({ text: 'All fields are required.', type: 'error' });
    }
    setGlobalLoading(true);
    const formData = new FormData();
    formData.append('title', editingContent.title);
    formData.append('description', editingContent.description);
    // new
    for (const file of editAttachments) {
      formData.append('attachments', file);
    }
    // old
    formData.append('oldAttachments', JSON.stringify(editOldAttachments));
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/contents/${editingContent._id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        window.PNotify.alert({ text: 'Content updated.', type: 'success' });
        setEditingContent(null);
        setEditAttachments([]);
        setEditOldAttachments([]);
        fetchContents();
      } else {
        window.PNotify.alert({ text: data.error || 'Update failed.', type: 'error' });
      }
    } catch {
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    } finally {
      setGlobalLoading(false);
    }
  };

  // DELETE content
  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/contents/${contentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        window.PNotify.alert({ text: 'Content deleted.', type: 'success' });
        fetchContents();
      } else {
        window.PNotify.alert({ text: 'Failed to delete.', type: 'error' });
      }
    } catch {
      window.PNotify.alert({ text: 'Server error.', type: 'error' });
    }
  };

  // TAB navigation
  const handleTabClick = (tab) => {
    if (tab === 'manage') {
      navigate(`/course/${id}/students`);
    } else if (tab === 'analytics') {
      navigate(`/course/${id}/analytics`);
    } else {
      setActiveTab(tab);
    }
  };

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


  return (
    <div className="topiccourse-layout">
      <Sidebar />
      <div className="topiccourse-main">
        <PageHeader
          username={localStorage.getItem('user_email')}
          role={localStorage.getItem('user_role') || 'User'}
          avatar={localStorage.getItem('user_avatar')}
        />

        {/* Tabs */}
        <div className="course-tabs">
          <div className="tab-group">
            <button
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => handleTabClick('details')}
            >
              Details
            </button>
            <button
              className="tab-button"
              onClick={() => handleTabClick('manage')}
            >
              Manage Students
            </button>
            <button
              className="tab-button"
              onClick={() => handleTabClick('analytics')}
            >
              View Analytics
            </button>
          </div>
          <button className="add-content-btn" onClick={() => setShowAddContent(true)}>Add content</button>
        </div>

        {/* Course Title/Header */}
        <div className="course-header-section mb-4">
          {loading ? (
            <h1 className="course-title">Loading...</h1>
          ) : course ? (
            <div className="flex items-start gap-4">
              <img
                src={course.image ? `${process.env.REACT_APP_API_URL}/${course.image}` : avatarIcon}
                alt="Course"
                className="w-24 h-24 rounded object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-gray-600 mt-1">{course.description}</p>
              </div>
            </div>
          ) : (
            <h1 className="text-red-600">Course not found</h1>
          )}
        </div>

        {/* Content List */}
        <div className="course-content-area">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Course Contents</h2>
          </div>
          {contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 w-full">
            <span className="text-5xl mb-2" role="img" aria-label="folder">
              📂
            </span>
            <p className="text-gray-500 text-lg font-medium mb-1">No content added yet.</p>
            <span className="text-gray-400 text-sm">Start by adding new course materials or files.</span>
          </div>
          ) : (
            contents.map((c, i) => (
              <div key={i} className="flex gap-4 items-start border p-4 rounded shadow mb-4 bg-gray-50">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-700">{c.description}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <span>
                      <svg className="inline-block mr-1" width={16} height={16} fill="none" viewBox="0 0 24 24">
                        <path stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2"/>
                        <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth={2} fill="none"/>
                      </svg>
                      {c.created_by}
                    </span>
                    <span>·</span>
                    <span>{timeAgo(c.created_at)}</span>
                  </div>
                  {/* Attachments */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.attachments && c.attachments.length > 0 &&
                      c.attachments.map((att, i) => renderAttachment(att, i))
                    }
                  </div>
                  {c.created_by === localStorage.getItem('user_email') && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEditContent(c)}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeletingContentId(c._id); setShowDeleteModal(true); }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Content Modal */}
        {showAddContent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
              <input
                type="text"
                placeholder="Title"
                className="w-full mb-3 p-2 border rounded"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-3 p-2 border rounded"
                rows="3"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
              />
              <div className="mb-3">
                <input
                  type="file"
                  className="w-full"
                  multiple
                  onChange={(e) => setAttachments(Array.from(e.target.files))}
                />
                {/* Show selected attachments */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="mr-1">{file.name}</span>
                      <button onClick={() => handleRemoveAddAttachment(idx)} className="text-red-500 ml-2 text-xs">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAddContent(false); setAttachments([]); }}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={contentLoading}
                >
                  {contentLoading ? 'Adding...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Content Modal */}
        {editingContent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Content</h2>
              <input
                type="text"
                value={editingContent.title}
                onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
              />
              <textarea
                rows="3"
                value={editingContent.description}
                onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
                className="w-full mb-3 p-2 border rounded"
              />
              {/* Old Attachments */}
              <div className="flex flex-wrap gap-2 mb-2">
                {editOldAttachments.map((att, idx) => (
                  <div key={idx} className="flex items-center">
                    {renderAttachment(att, idx)}
                    <button onClick={() => handleRemoveOldAttachment(idx)} className="text-red-500 ml-2 text-xs">Remove</button>
                  </div>
                ))}
              </div>
              {/* New Attachments */}
              <input
                type="file"
                className="w-full"
                multiple
                onChange={e => setEditAttachments(Array.from(e.target.files))}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {editAttachments.map((file, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="mr-1">{file.name}</span>
                    <button onClick={() => handleRemoveEditAttachment(idx)} className="text-red-500 ml-2 text-xs">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingContent(null)} className="px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateContent}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center animate-popIn">
              <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Delete Content?</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this content? This action cannot be undone.</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setGlobalLoading(true);
                    try {
                      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${id}/contents/${deletingContentId}`, { method: 'DELETE' });
                      if (res.ok) {
                        window.PNotify.alert({ text: 'Content deleted.', type: 'success' });
                        fetchContents();
                      } else {
                        window.PNotify.alert({ text: 'Failed to delete.', type: 'error' });
                      }
                    } catch {
                      window.PNotify.alert({ text: 'Server error.', type: 'error' });
                    } finally {
                      setGlobalLoading(false);
                      setShowDeleteModal(false);
                      setDeletingContentId(null);
                    }
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {globalLoading && (
          <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
          </div>
        )} 
      </div>
    </div>
  );
};

export default TopicCourse;
