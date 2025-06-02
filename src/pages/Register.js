import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Add navigate + Link

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      window.PNotify.alert({
        text: data.message || 'Registered successfully',
        type: 'success',
        delay: 2000,
        styling: 'brighttheme',
        icons: 'brighttheme'
      });

      setTimeout(() => navigate('/web/ogin'), 2000);

      setEmail('');
      setPassword('');
      setRole('student');
    } catch (err) {
      window.PNotify.alert({
        text: err.message,
        type: 'error',
        delay: 2500,
        styling: 'brighttheme',
        icons: 'brighttheme'
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-sky-600 text-white flex-col justify-center items-center px-10">
        <img src="/logo.png" alt="Logo" className="mb-4 w-24" />
        <p className="text-lg text-center max-w-sm">
          Empowering educators and learners with smart, AI-driven quiz generation and analytics.
        </p>
      </div>

      {/* Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-5">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2 text-sm text-gray-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 font-semibold"
          >
            Register
          </button>

          {/* ✅ Link to login */}
          <div className="text-center text-sm text-gray-500 pt-2">
            Already have an account? <Link to="/web/login" className="text-sky-600 hover:underline">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
