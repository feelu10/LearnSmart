import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validateInputs = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

        if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!email.trim()) newErrors.email = 'Email is required.';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format.';
        if (!password) newErrors.password = 'Password is required.';
        else if (!passwordRegex.test(password)) {
            newErrors.password =
                'Password must be at least 6 characters and include a number.';
        }
        if (password !== confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateInputs()) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful!');
                setTimeout(() => navigate('/web/register'), 1500);
            } else {
                setMessage(data.detail || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Network error: Unable to connect to the server.');
        }
    };

    const handleLoginRedirect = () => navigate('/');

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Sign up</h2>
                <p className="register-subtext">Create an account to continue!</p>

                <div className="input-group">
                    <i className="fas fa-user input-icon"></i>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                {errors.fullName && <p className="error-text">{errors.fullName}</p>}

                <div className="input-group">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}

                <div className="input-group">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}

                <div className="input-group">
                    <i className="fas fa-lock input-icon"></i>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                <button className="register-button" onClick={handleRegister}>
                    Sign Up
                </button>

                {message && <p className="register-message">{message}</p>}

                <p className="register-login-text">
                    Already have an account?{' '}
                    <span
                        onClick={handleLoginRedirect}
                        style={{
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
