/* global PNotify */
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './TaskCalendar.css';

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const TaskCalendar = () => {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week').add(1, 'day'));
    const [editingTask, setEditingTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [showLoader, setShowLoader] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: dayjs().format('YYYY-MM-DD'),
        time: '09:00',
        duration: '',
    });

  const weekDays = Array.from({ length: 5 }, (_, i) => currentWeekStart.add(i, 'day'));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      new PNotify.error({ text: 'Failed to fetch tasks.' });
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const durationHours = parseFloat(formData.duration);
    if (!durationHours || durationHours <= 0 || isNaN(durationHours)) {
      new PNotify.error({ text: 'Please select a valid duration.' });
      return;
    }

    const taskPayload = {
      ...formData,
      duration: durationHours.toFixed(2),
      status: 'Upcoming',
      creator: localStorage.getItem('user_email'),
    };

    try {
        setShowLoader(true);
        setSubmitting(true);
        let res, result;
        if (editingTask) {
        res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskPayload),
        });
        result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to update task');
        setTasks(prev => prev.map(t => t._id === editingTask._id ? { ...t, ...taskPayload } : t));
        new PNotify.success({ text: 'Task updated successfully!' });
      } else {
        res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskPayload),
        });
        result = await res.json();
        if (!res.ok) throw new Error('Failed to add task');
        setTasks(prev => [...prev, { ...taskPayload, _id: result.id }]);
        new PNotify.success({ text: 'Task added successfully!' });
      }

      setFormData({ title: '', description: '', date: dayjs().format('YYYY-MM-DD'), time: '09:00', duration: '' });
      setEditingTask(null);
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting task:', err);
      new PNotify.error({ text: err.message || 'Task submission failed.' });
    } finally {
      setSubmitting(false);
      setShowLoader(false)
    }
  };

  const handleDelete = async () => {
    if (!editingTask) return;
    try {
    setShowLoader(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${editingTask._id}`, {
        method: 'DELETE',
        });
            if (!res.ok) throw new Error('Delete failed');
                setTasks(prev => prev.filter(t => t._id !== editingTask._id));
            new PNotify.success({ text: 'Task deleted.' });
    setShowModal(false);
    setShowLoader(false); 
    } catch (err) {
        console.error('Delete error:', err);
        new PNotify.error({ text: 'Failed to delete task.' });
        setShowLoader(false);
    }
  };

  const changeWeek = (direction) => {
    setCurrentWeekStart(prev => prev.add(direction, 'week'));
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', date: dayjs().format('YYYY-MM-DD'), time: '09:00', duration: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', date: dayjs().format('YYYY-MM-DD'), time: '09:00', duration: '' });
  };

    if (showLoader) {
        return (
            <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
            </div>
        );
    }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => changeWeek(-1)} className="text-blue-600 font-semibold hover:underline">‹ Prev</button>
          <span className="text-gray-700 font-medium">{currentWeekStart.format('MMMM YYYY')}</span>
          <button onClick={() => changeWeek(1)} className="text-blue-600 font-semibold hover:underline">Next ›</button>
          <button onClick={() => openModal()} className="ml-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
            <i className="fas fa-plus mr-1"></i> Add Task
          </button>
        </div>
      </div>

      {loadingTasks ? <p className="text-center">Loading...</p> : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] border rounded shadow text-sm">
            <div className="bg-gray-100 p-2 border-r"></div>
            {weekDays.map(day => (
              <div key={day.format('YYYY-MM-DD')} className="bg-gray-100 p-2 border-r text-center font-semibold">
                {day.format('ddd, MMM D')}
              </div>
            ))}
            {hours.map(hour => (
              <React.Fragment key={hour}>
                <div className="border-t border-r p-2 text-right text-gray-500">{hour}</div>
                {weekDays.map(day => {
                  const dateKey = day.format('YYYY-MM-DD');
                  return (
                    <div key={dateKey + hour} className="border-t border-r h-24 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {tasks.filter(task => task.date === dateKey && task.time === hour).map((task, index) => (
                            <div
                                key={index}
                                className="bg-blue-100 border-l-4 border-blue-600 rounded shadow p-2 flex flex-col"
                                style={{ minHeight: '3.2rem' }}
                            >
                                <div className="text-xs text-gray-500 mb-1">
                                {task.time} – {dayjs(`${task.date} ${task.time}`).add(parseFloat(task.duration || 1), 'hour').format('HH:mm')}
                                </div>
                                <div className="font-semibold text-sm">{task.title}</div>
                                <div className="text-xs text-gray-700">{task.description}</div>
                                {task.creator === localStorage.getItem('user_email') && (
                                <div className="flex items-center justify-between mt-2 gap-3">
                                    <button
                                    onClick={() => openModal(task)}
                                    className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-xs font-semibold"
                                    title="Edit"
                                    >
                                    <i className="fas fa-edit"></i> Edit
                                    </button>
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className={editingTask ? 'fas fa-edit' : 'fas fa-plus'}></i> {editingTask ? 'Edit Task' : 'Add Task'}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input type="text" placeholder="Title" className="border p-2 rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <input type="text" placeholder="Description" className="border p-2 rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input type="date" className="border p-2 rounded" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              <div className="flex gap-2">
                <input type="time" className="border p-2 rounded w-1/2" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
                <select className="border p-2 rounded w-1/2" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required>
                  <option value="">Duration</option>
                  <option value="0.25">15 mins</option>
                  <option value="0.5">30 mins</option>
                  <option value="0.75">45 mins</option>
                  <option value="1">1 hour</option>
                  <option value="1.5">1.5 hours</option>
                  <option value="2">2 hours</option>
                </select>
              </div>
              <div className="flex justify-between gap-2">
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={submitting}>{submitting ? 'Saving...' : 'Save Task'}</button>
                {editingTask && (
                <button
                    type="button"
                    onClick={() => {
                    setTaskToDelete(editingTask);
                    setShowConfirmModal(true);
                    }}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                    Delete
                </button>
                )}
                <button type="button" onClick={closeModal} className="border py-2 px-4 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete <strong>{taskToDelete?.title}</strong>?</p>
            <div className="flex justify-end gap-4">
                <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                Cancel
                </button>
                <button
                onClick={async () => {
                    await handleDelete(taskToDelete._id);
                    setShowConfirmModal(false);
                    setEditingTask(null);
                    setShowModal(false);
                }}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                Confirm
                </button>
            </div>
            </div>
        </div>
        )}
        
    </div>
  );
};

export default TaskCalendar;
