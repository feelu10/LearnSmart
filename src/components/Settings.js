import React, { useEffect, useState, useContext } from 'react';
import Sidebar from './Sidebar';
import './Settings.css';
import defaultAvatar from '../assets/avatars.png';
import { AppContext } from '../AppContext';

const Settings = () => {
  const { data, setData } = useContext(AppContext);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    avatar: defaultAvatar,
    notif: false,
    ads: false,
    emailNotif: false,
    notif1: false,
    notif2: false,
    notif3: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🟢 Prefer preloaded data
  useEffect(() => {
    if (data.settings && data.settings.email) {
      const s = data.settings;
      setForm((prev) => ({
        ...prev,
        username: s.username || '',
        email: s.email || '',
        avatar: s.avatar
          ? s.avatar.startsWith('http')
            ? s.avatar
            : `${process.env.REACT_APP_API_URL}/${s.avatar}`
          : defaultAvatar,
        notif: s.notif || false,
        ads: s.ads || false,
        emailNotif: s.email_notif || false,
        notif1: s.notif1 || false,
        notif2: s.notif2 || false,
        notif3: s.notif3 || false,
      }));
      return; // don't fetch again if already loaded
    }

    // 🟡 Fallback: fetch settings from API if not in context
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/settings`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataRes = await res.json();
        if (!res.ok) throw new Error(dataRes.error || 'Failed to fetch');

        setForm((prev) => ({
          ...prev,
          username: dataRes.username || '',
          email: dataRes.email || '',
          avatar: dataRes.avatar
            ? dataRes.avatar.startsWith('http')
              ? dataRes.avatar
              : `${process.env.REACT_APP_API_URL}/${dataRes.avatar}`
            : defaultAvatar,
          notif: dataRes.notif || false,
          ads: dataRes.ads || false,
          emailNotif: dataRes.email_notif || false,
          notif1: dataRes.notif1 || false,
          notif2: dataRes.notif2 || false,
          notif3: dataRes.notif3 || false,
        }));

        // Store to context so other pages can use
        setData((prev) => ({
          ...prev,
          settings: dataRes,
        }));

        localStorage.setItem('user', JSON.stringify({
          username: dataRes.username,
          email: dataRes.email,
          avatar: dataRes.avatar,
          role: dataRes.role,
        }));
      } catch (err) {
        console.error('❌ Failed to load user settings:', err);
        window.PNotify.error({ text: err.message });
      }
    };

    fetchUserData();
  }, [data.settings, setData]);

  const handleInput = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (action) => async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      window.PNotify.error({ text: 'Unauthorized. Please log in.' });
      return;
    }

    const formData = new FormData();
    formData.append('action', action);

    if (action === 'username') {
      formData.append('username', form.username);
    } else if (action === 'email') {
      formData.append('email', form.email);
    } else if (action === 'password') {
      formData.append('new_password', form.password);
    } else if (action === 'website_notifications') {
      formData.append('notif', form.notif);
      formData.append('ads', form.ads);
      formData.append('email_notif', form.emailNotif);
    } else if (action === 'email_notifications') {
      formData.append('notif1', form.notif1);
      formData.append('notif2', form.notif2);
      formData.append('notif3', form.notif3);
    } else if (action === 'change_profile') {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append('profile_image', fileInput.files[0]);
      } else {
        window.PNotify.error({ text: 'No image selected.' });
        return;
      }
    } else if (action === 'delete') {
      formData.append('action', 'delete');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/settings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      window.PNotify.success({ text: data.message || 'Updated successfully.' });
    } catch (err) {
      console.error('❌ Update failed:', err);
      window.PNotify.error({ text: err.message || 'Update failed.' });
    }
  };

  return (
    <div className="settings-layout">
      <Sidebar />
      <div className="settings-main">
        <div className="header">
          <div className="user-info"></div>
          <div className="icons">
            <span className="icon-svg">
              <svg width="24" height="24" fill="none" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 16v-5a6 6 0 10-12 0v5l-1.5 2h15z"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </span>
            <span className="icon-svg">
              <svg width="24" height="24" fill="none" stroke="#373A3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/>
              </svg>
            </span>
          </div>
        </div>

        <div className="settings-content">
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={form.avatar} alt="Profile avatar" className="profile-image" />
              <input type="file" onChange={handleImageUpload} />
            </div>
            <h2 className="profile-name">{form.username}</h2>
            <button className="change-profile-btn" onClick={handleSubmit('change_profile')}>Change Profile</button>
          </div>

          <div className="settings-container">
            <div className="account-section">
              <h2 className="section-title">Account</h2>

              <form onSubmit={handleSubmit('username')} className="setting-row username-row">
                <div className="setting-info">
                  <div className="setting-label">Username</div>
                  <input type="text" name="username" value={form.username} onChange={handleInput} className="setting-value" />
                </div>
                <button type="submit" className="action-btn change-btn">Change</button>
              </form>

              <form onSubmit={handleSubmit('email')} className="setting-row email-row">
                <div className="setting-info">
                  <div className="setting-label">Email Address</div>
                  <input type="email" name="email" value={form.email} onChange={handleInput} className="setting-value" />
                </div>
                <button type="submit" className="action-btn change-btn">Change</button>
              </form>

              <form onSubmit={handleSubmit('password')} className="setting-row password-row">
                <div className="setting-info">
                  <div className="setting-label">Password</div>
                  <input type="password" name="password" placeholder="New Password" value={form.password} onChange={handleInput} className="setting-value" />
                </div>
                <button type="submit" className="action-btn change-btn">Change</button>
              </form>

              <div className="setting-row deletion-row">
                <div className="setting-info">
                  <div className="setting-label">Deletion</div>
                  <div className="setting-value">Permanently delete your account, posts, and comments.</div>
                </div>
                <button
                  className="action-btn delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </button>

                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to permanently delete your account? This action cannot be undone.
                      </p>

                      <div className="flex justify-end space-x-3">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => {
                            setShowDeleteModal(false);
                            handleSubmit('delete')();
                          }}
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit('website_notifications')} className="website-notifications-section">
              <h2 className="section-title">Website Notifications</h2>
              <div className="notification-options">
                <label className="checkbox-label">
                  <input type="checkbox" name="notif" checked={form.notif} onChange={handleInput} className="notification-checkbox" />
                  <span>Enable notifications</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="ads" checked={form.ads} onChange={handleInput} className="notification-checkbox" />
                  <span>Enable advertisements</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="emailNotif" checked={form.emailNotif} onChange={handleInput} className="notification-checkbox" />
                  <span>Enable email notifications</span>
                </label>
              </div>
              <button className="action-btn change-btn mt-2">Save</button>
            </form>

            <form onSubmit={handleSubmit('email_notifications')} className="email-notifications-section">
              <h2 className="section-title">Email Notifications</h2>
              <p className="notification-question">What would you like to be notified of via email?</p>
              <div className="notification-options">
                <label className="checkbox-label">
                  <input type="checkbox" name="notif1" checked={form.notif1} onChange={handleInput} className="notification-checkbox" />
                  <span>Notifications about quiz results</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="notif2" checked={form.notif2} onChange={handleInput} className="notification-checkbox" />
                  <span>Updates to courses</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="notif3" checked={form.notif3} onChange={handleInput} className="notification-checkbox" />
                  <span>New quizzes posted</span>
                </label>
              </div>
              <button className="action-btn change-btn mt-2">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
