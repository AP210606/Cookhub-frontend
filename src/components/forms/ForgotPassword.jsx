import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(json.message || 'If an account exists, instructions were sent to the email');
        // In dev, response may include resetUrl - show it for testing
        if (json.resetUrl) setMessage(prev => prev + `\n
Reset link: ${json.resetUrl}`);
      } else {
        setIsError(true);
        setMessage(json.message || 'Unable to send reset link');
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
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {message && (
        <div className={`p-3 rounded mb-4 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded">{loading ? 'Sending...' : 'Send reset link'}</button>
          <button type="button" onClick={() => navigate('/auth')} className="py-2 px-3 bg-gray-200 rounded">Back</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
