import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you use axios for API calls
// import AdminDashboard from './AdminDashboard';

const AdminEmailSetting = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [appPassword, setAppPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                // Assuming you have an Admin role and a valid token stored
                const token = localStorage.getItem('token'); 
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('/api/settings/email', config);
                setCurrentEmail(response.data.email || 'Not configured');
                setNewEmail(response.data.email || '');
            } catch (err) {
                setError('Failed to fetch current email setting.');
            }
        };
        fetchEmail();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!newEmail) {
            setError('Email cannot be empty.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put('/api/settings/email', { newEmail }, config);
            
            if (response.status === 200) {
                setCurrentEmail(newEmail);
                setMessage('Email updated successfully! If you changed the email address, you must manually update the App Password in your .env file.');
                setAppPassword(''); // Clear the password field for security
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update email.');
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4 m-4">
            <h2 className="text-2xl font-bold text-gray-900">Email Settings</h2>
            <p className="text-sm text-gray-500">
                This email is used to send notifications to users.
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold text-gray-700">Current Sender Email:</p>
                <p className="text-lg font-mono text-gray-800 break-words">{currentEmail}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">
                        New Sender Email
                    </label>
                    <input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="Enter new email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="appPassword" className="block text-sm font-medium text-gray-700">
                        Gmail App Password
                    </label>
                    <input
                        id="appPassword"
                        type="password"
                        value={appPassword}
                        onChange={(e) => setAppPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="Enter 16-digit App Password"
                    />
                    <p className="mt-2 text-xs text-red-500">
                        NOTE: This field is for your reference only and is NOT saved. You must
                        manually update your `GMAIL_APP_PASSWORD` in the `.env` file on your server.
                    </p>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Update Email
                </button>
            </form>
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
        </div>
    );
};

export default AdminEmailSetting;
