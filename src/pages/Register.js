import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ loader state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ✅ show loader

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      window.PNotify.alert({
        text: data.message || 'Registered successfully',
        type: 'success',
        delay: 2000,
        styling: 'brighttheme',
        icons: 'brighttheme',
      });

      setTimeout(() => navigate('/web/login'), 2000);

      setEmail('');
      setPassword('');
      setFullName('');
      setRole('student');
    } catch (err) {
      window.PNotify.alert({
        text: err.message,
        type: 'error',
        delay: 2500,
        styling: 'brighttheme',
        icons: 'brighttheme',
      });
    } finally {
      setIsLoading(false); // ✅ hide loader
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* ✅ Loader overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
        </div>
      )}

      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-sky-600 text-white flex-col justify-center items-center px-10">
        <img src="/logo.png" alt="Logo" className="mb-4 w-24" />
        <p className="text-lg text-center max-w-sm">
          Empowering educators and learners with smart, AI-driven quiz generation and analytics.
        </p>
      </div>

      {/* Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-5"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
          />

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
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md font-semibold ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-sky-500 text-white hover:bg-sky-600'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <div className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{' '}
            <Link to="/web/login" className="text-sky-600 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
