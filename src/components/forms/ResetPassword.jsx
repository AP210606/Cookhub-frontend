import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    if (!password || password.length < 6) return setMessage('Please enter a password with 6+ characters');
    if (password !== confirm) return setMessage('Passwords do not match');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(json.message || 'Password reset successful');
        setTimeout(() => navigate('/auth'), 1500);
      } else {
        setIsError(true);
        setMessage(json.message || 'Unable to reset password');
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {message && <div className={`p-3 rounded mb-4 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">New password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm password</label>
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full p-3 border rounded" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded">{loading ? 'Resetting...' : 'Reset Password'}</button>
          <button type="button" onClick={() => navigate('/auth')} className="py-2 px-3 bg-gray-200 rounded">Back</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
