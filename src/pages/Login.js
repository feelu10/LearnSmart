import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rawMessages = window.flashMessages || [];
    let shouldRedirect = false;

    rawMessages.forEach(([type, text]) => {
      window.PNotify.alert({
        text,
        type: ['success', 'error'].includes(type) ? type : 'info',
        delay: 2000,
        styling: 'brighttheme',
        icons: 'brighttheme',
      });

      if (type === 'success') shouldRedirect = true;
    });

    if (shouldRedirect) {
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        const { user } = data;

        // 🚫 Block students
        if (user.role === 'student') {
          setShowLoader(false);
          return window.PNotify.alert({
            text: "Student login is not allowed.",
            type: 'error',
            delay: 2500,
            styling: 'brighttheme',
            icons: 'brighttheme'
          });
        }

        // 🚫 Block unverified instructors
        if (user.role === 'instructor' && !user.email_verified) {
          setShowLoader(false);
          return window.PNotify.alert({
            text: "Instructor account not yet verified.",
            type: 'error',
            delay: 2500,
            styling: 'brighttheme',
            icons: 'brighttheme'
          });
        }

        // ✅ Proceed with login
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_avatar', user.avatar || '');

        if (user.id) {
          localStorage.setItem('user_id', user.id);
        } else {
          localStorage.removeItem('user_id');
        }

        window.PNotify.alert({
          text: "Login successful! Redirecting...",
          type: 'success',
          delay: 1500,
          styling: 'brighttheme',
          icons: 'brighttheme',
        });

        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setShowLoader(false);
        window.PNotify.alert({
          text: data.error || "Login failed.",
          type: 'error',
          delay: 2500,
          styling: 'brighttheme',
          icons: 'brighttheme',
        });
      }
    } catch (error) {
      setShowLoader(false);
      window.PNotify.alert({
        text: "Network error. Please try again.",
        type: 'error',
        delay: 2500,
        styling: 'brighttheme',
        icons: 'brighttheme',
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex relative font-['Inter']">
      {showLoader && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
        </div>
      )}

      <div className="hidden lg:flex w-1/2 bg-sky-600 text-white flex-col justify-center items-center px-10">
        <img src="../logo.png" alt="Logo" className="mb-4" />
        <p className="text-lg text-center max-w-sm">
          Empowering educators and learners with smart, AI-driven quiz generation and analytics.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Log in to your LearnSmart dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  👁️
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {}}
              className="text-sky-500 hover:underline text-sm bg-transparent border-none p-0 cursor-pointer"
            >
              Forgot password?
            </button>

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition font-semibold"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <a href="/web/register" className="text-sky-500 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>

      <footer className="absolute bottom-0 w-full text-center text-sm text-gray-400 py-4">
        © 2025 LearnSmart Inc. | Smart Tools for Smarter Learning
      </footer>
    </div>
  );
}

export default LoginPage;
