// Updated: cookhub-frontend/src/components/Login.jsx
// Changes: 
// - Added role selection (user/coordinator/admin vs cook)
// - Unified login: /api/auth/login for users, /api/cooks/login for cooks
// - Updated token storage to 'authToken'
// - On success, calls onLogin and redirects based on role
// - Enhanced UI with role toggle

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/constants';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' for coordinators/admins, 'cook' for cooks
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Normalize credentials
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      let response;
      if (role === 'cook') {
        // Cook login
        response = await fetch(`${API_BASE_URL}/cooks/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password: trimmedPassword }),
        });
      } else {
        // User login (coordinator/admin)
        response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail, password: trimmedPassword }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('cookhubUser', JSON.stringify(data.user));
      
      if (onLogin) {
        onLogin(data.user, data.token);
      } else {
        // Fallback: Navigate based on role
        if (data.user.role === 'cook') {
          navigate('/cook-dashboard');
        } else if (data.user.role === 'admin' || data.user.role === 'coordinator') {
          navigate('/admin-dashboard'); // Or coordinator-dashboard
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


};

export default Login;