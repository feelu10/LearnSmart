import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import avatarIcon from '../assets/avatars.png';
import PageHeader from '../components/PageHeader';

const Dashboard = () => {
  const username = localStorage.getItem('user_email');
  const role = localStorage.getItem('user_role');
  const avatar = localStorage.getItem('user_avatar') || avatarIcon;

  const [uptimeHours, setUptimeHours] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [responseData, setResponseData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newSignups, setNewSignups] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/system-stats`);
        const data = await res.json();

        setUptimeHours(data.uptime_hours || 0);
        setTotalUsers(data.total_users || 0);
        setNewSignups(data.new_signups_this_month || 0);
        setTotalCourses(data.total_courses || 0);

        if (data.response_times && data.response_times.length > 0) {
          const avg =
            data.response_times.reduce((a, b) => a + b, 0) / data.response_times.length;
          setAvgResponseTime(avg.toFixed(2));
          setResponseData(data.response_times);
        }
      } catch (err) {
        console.error('Failed to fetch system stats:', err);
      }
    };

    fetchSystemStats();
  }, []);

  return (
    <div className="dashboard-container px-6 py-4 bg-gray-50 min-h-screen">
      <PageHeader username={username} role={role} avatar={avatar} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Uptime */}
        <div className="card col-span-1 md:col-span-2 p-4">
          <h3 className="text-lg font-semibold">Uptime</h3>
          <p className="text-3xl mt-4">{uptimeHours} hrs</p>
          <p className="text-sm text-gray-500">Since server started</p>
          <div className="h-2 w-full bg-gray-200 rounded-full mt-3">
            <div className="h-2 bg-blue-500 rounded-full w-full"></div>
          </div>
        </div>

        {/* Response Time */}
        <div className="card col-span-1 md:col-span-2 p-4">
          <h3 className="text-lg font-semibold">Response Time</h3>
          <p className="text-3xl mt-4">{avgResponseTime} ms</p>
          <p className="text-sm text-gray-500">{responseData.length} samples analyzed</p>
        </div>

        {/* New Signups */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold">📈 New Signups</h3>
          <p className="text-3xl mt-4">{newSignups}</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        {/* Total Users */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold">👥 Total Users</h3>
          <p className="text-3xl mt-4">{totalUsers}</p>
          <p className="text-sm text-gray-500">Excludes Admins</p>
        </div>

        {/* Active Courses */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold">📚 Active Courses</h3>
          <p className="text-3xl mt-4">{totalCourses}</p>
          <p className="text-sm text-gray-500">Total in system</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
