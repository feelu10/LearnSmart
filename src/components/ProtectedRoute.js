import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function ProtectedRoute({ children, field = 'role', expected = ['student', 'instructor'] }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('user_email');

      if (!token || !email) {
        setIsAuthorized(false);
        setShowLoader(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/validate-field`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ field, value: expected, email }),
        });

        const data = await res.json();

        if (res.ok && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        setIsAuthorized(false);
      } finally {
        setShowLoader(false);
      }
    };

    checkToken();
  }, [field, expected]);

  if (showLoader) {
    return (
      <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthorized) return <Navigate to="/web/logout" />;
  return children;
}

export default ProtectedRoute;
