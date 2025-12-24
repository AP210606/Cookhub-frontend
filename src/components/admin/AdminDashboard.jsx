import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../utils/constants';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import TextAreaField from '../common/TextAreaField';



// Helper function to capitalize the first letter of a string
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

const AdminDashboard = ({ token: initialToken, handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSummary, setBookingSummary] = useState([]);
  const [adminSettings, setAdminSettings] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [cooks, setCooks] = useState([]);
  const [newSetting, setNewSetting] = useState({ settingName: '', settingValue: '', description: '' });
  const [newCook, setNewCook] = useState({ name: '', email: '', phone: '', specialties: '', serviceAreas: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('summary');
  const [selectedBookingToAssign, setSelectedBookingToAssign] = useState(null);
  const [assignCookId, setAssignCookId] = useState('');
  const [assignServiceStartTime, setAssignServiceStartTime] = useState('');
  const [assignServiceEndTime, setAssignServiceEndTime] = useState('');
  const [assignServiceDate, setAssignServiceDate] = useState('');
  const [assignCookStatus, setAssignCookStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedCook, setSelectedCook] = useState(null);
  const [showAddCookModal, setShowAddCookModal] = useState(false);
  const [bookingsTab, setBookingsTab] = useState('pending');
  const [pendingPage, setPendingPage] = useState(1);
  const [demoScheduledPage, setDemoScheduledPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [coordinatorsPage, setCoordinatorsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [cooksPage, setCooksPage] = useState(1);
  const itemsPerPage = 10;

  const getNotificationEmail = () => {
  const setting = adminSettings.find(s => s.settingName === 'notificationEmail');
  return setting ? setting.settingValue : '';
};
  const token = useRef(initialToken || localStorage.getItem('authToken')).current;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [usersResponse, bookingsResponse, summaryResponse, settingsResponse, messagesResponse, cooksResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/admin/bookings`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/admin/booking-summary`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/admin-settings`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/contact/admin`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/cooks`, { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        const [usersData, bookingsData, summaryData, settingsData, messagesData, cooksData] = await Promise.all([
          usersResponse.json(),
          bookingsResponse.json(),
          summaryResponse.json(),
          settingsResponse.json(),
          messagesResponse.json(),
          cooksResponse.json(),
        ]);

        if (!usersResponse.ok) throw new Error(usersData.message || 'Failed to fetch users');
        if (!bookingsResponse.ok) throw new Error(bookingsData.message || 'Failed to fetch bookings');
        if (!summaryResponse.ok) throw new Error(summaryData.message || 'Failed to fetch booking summary');
        if (!settingsResponse.ok) throw new Error(settingsData.message || 'Failed to fetch admin settings');
        if (!messagesResponse.ok) throw new Error(messagesData.message || 'Failed to fetch contact messages');
        if (!cooksResponse.ok) throw new Error(cooksData.message || 'Failed to fetch cooks');

        setUsers(usersData);
        setBookings(bookingsData);
        setBookingSummary(Array.isArray(summaryData) ? summaryData : summaryData.data || []);
        setAdminSettings(settingsData);
        setContactMessages(messagesData);
        setCooks(cooksData);
      } catch (err) {
        console.error('Admin dashboard fetch error:', err);
        setError(err.message || 'Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
    else setError('Authentication token missing. Please log in.');
  }, [token]);

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    setError('');
    try {
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error('Server returned an invalid response. Check console for details.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setBookingsTab(newStatus);
      if (newStatus === 'pending') setPendingPage(1);
      else if (newStatus === 'demo_scheduled') setDemoScheduledPage(1);
      else if (newStatus === 'approved') setApprovedPage(1);
      else if (newStatus === 'rejected') setRejectedPage(1);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err.message || 'Failed to update booking status.');
    }
  };

  const handleNewSettingChange = (e) => {
    const { name, value } = e.target;
    setNewSetting(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSetting = async (e) => {
    e.preventDefault();
    setError('');
    if (!newSetting.settingName || !newSetting.settingValue) {
      setError('Setting name and value are required.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/admin-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSetting),
      });
      const data = await response.json();
      if (response.ok) {
        setAdminSettings(prev => [...prev, data]);
        setNewSetting({ settingName: '', settingValue: '', description: '' });
      } else {
        throw new Error(data.message || 'Failed to add setting');
      }
    } catch (err) {
      console.error('Error adding setting:', err);
      setError(err.message || 'Failed to add setting.');
    }
  };

  const handleDeleteSetting = async (id) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin-settings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setAdminSettings(prev => prev.filter(setting => setting._id !== id));
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete setting');
      }
    } catch (err) {
      console.error('Error deleting setting:', err);
      setError(err.message || 'Failed to delete setting.');
    }
  };

  const handleMarkMessageReviewed = async (id) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/contact/admin/${id}/review`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setContactMessages(prev =>
          prev.map(msg => (msg._id === id ? { ...msg, isReviewed: !msg.isReviewed, reviewedAt: data.data.reviewedAt, reviewedBy: data.data.reviewedBy } : msg))
        );
      } else {
        throw new Error(data.message || 'Failed to update message status');
      }
    } catch (err) {
      console.error('Error marking message reviewed:', err);
      setError(err.message || 'Failed to mark message reviewed.');
    }
  };

  const handleDeleteMessage = async (id) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/contact/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setContactMessages(prev => prev.filter(msg => msg._id !== id));
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete message');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err.message || 'Failed to delete message.');
    }
  };

  const handleNewCookChange = (e) => {
    const { name, value } = e.target;
    setNewCook(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCook = async (e) => {
    e.preventDefault();
    setError('');
    if (!newCook.name || !newCook.phone || !newCook.password) {
      setError('Cook name, phone, and password are required.');
      return;
    }
    if (newCook.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      const cookData = {
        ...newCook,
        specialties: newCook.specialties.split(',').map(s => s.trim()).filter(s => s),
        serviceAreas: newCook.serviceAreas.split(',').map(s => s.trim()).filter(s => s),
      };
      const response = await fetch(`${API_BASE_URL}/cooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cookData),
      });
      const responseBody = await response.text();
      if (!response.ok) {
        let errorMessage = 'Failed to add cook';
        try {
          const errorData = JSON.parse(responseBody);
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('Non-JSON response:', responseBody);
          errorMessage = 'Server returned an invalid response. Check console for details.';
        }
        throw new Error(errorMessage);
      }
      const data = JSON.parse(responseBody);
      setCooks(prev => [...prev, data]);
      setNewCook({ name: '', email: '', phone: '', specialties: '', serviceAreas: '', password: '' });
      setShowAddCookModal(false);
    } catch (err) {
      console.error('Error adding cook:', err);
      setError(err.message || 'Failed to add cook.');
    }
  };

  const handleDeleteCook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cook? This action cannot be undone.')) return;
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/cooks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setCooks(prev => prev.filter(cook => cook._id !== id));
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete cook');
      }
    } catch (err) {
      console.error('Error deleting cook:', err);
      setError(err.message || 'Failed to delete cook.');
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    setError('');
    try {
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const contentType = response.headers.get('content-type');
      let data;
      try {
        data = await response.json();
        console.log('Role update response:', data);
      } catch (jsonError) {
        const text = await response.text();
        console.error('Failed to parse JSON response:', jsonError, 'Response text:', text);
        throw new Error(`Server returned an invalid response: ${text || 'Empty response'}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Failed to update user role (Status: ${response.status})`);
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const updatedUsers = await usersResponse.json();
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message || 'Failed to update user role. Please check the server configuration.');
    }
  };

  const openAssignCookModal = (booking) => {
    setSelectedBookingToAssign(booking);
    setAssignCookId('');
    setAssignCookStatus('');

    // Try to prefill the service date/time from the user's earliest preferred booking
    try {
      const userId = booking.user || booking.userId || booking.userId;
      let defaultDate = '';
      let defaultStart = '';
      let defaultEnd = '';

      if (userId) {
        const userBookings = bookings.filter(b => b.user && String(b.user) === String(userId) && b.preferredStartDate);
        if (userBookings.length > 0) {
          userBookings.sort((a, b) => new Date(a.preferredStartDate) - new Date(b.preferredStartDate));
          const first = userBookings[0];
          if (first.preferredStartDate) defaultDate = new Date(first.preferredStartDate).toISOString().slice(0, 10);
          if (first.preferredMealTime) {
            // preferredMealTime might be like "13:00-14:30" or "13:00-14:30,19:00-20:30"
            const part = String(first.preferredMealTime).split(',')[0].trim();
            const [s, e] = part.split('-').map(x => x && x.trim());
            defaultStart = s || '';
            defaultEnd = e || '';
          }
        }
      }

      // Fallback to the booking's own preferred fields if nothing found
      if (!defaultDate && booking.preferredStartDate) defaultDate = new Date(booking.preferredStartDate).toISOString().slice(0, 10);
      if (!defaultStart && booking.preferredMealTime) {
        const part = String(booking.preferredMealTime).split(',')[0].trim();
        const [s, e] = part.split('-').map(x => x && x.trim());
        defaultStart = s || '';
        defaultEnd = e || '';
      }

      setAssignServiceDate(defaultDate);
      setAssignServiceStartTime(defaultStart);
      setAssignServiceEndTime(defaultEnd);
    } catch (err) {
      // If anything goes wrong, clear fields and proceed — admin can set manually
      setAssignServiceDate('');
      setAssignServiceStartTime('');
      setAssignServiceEndTime('');
      console.error('Error pre-filling assign times:', err);
    }
  };

  const formatTodayDate = () => new Date().toISOString().slice(0, 10);

  const setPresetTimes = (start, end) => {
    // If date not set, default to booking date or today
    if (!assignServiceDate) {
      const bookingDate = selectedBookingToAssign && selectedBookingToAssign.serviceDate ? selectedBookingToAssign.serviceDate.slice(0,10) : null;
      setAssignServiceDate(bookingDate || formatTodayDate());
    }
    setAssignServiceStartTime(start);
    setAssignServiceEndTime(end);
  };

  const handleAssignCook = async (e) => {
    e.preventDefault();
    setAssignCookStatus('');
    if (!assignCookId) {
      setAssignCookStatus('Please select a cook.');
      return;
    }
    if (!selectedBookingToAssign) {
      setAssignCookStatus('No booking selected for assignment.');
      return;
    }
    // Validate date/time inputs
    if (!assignServiceDate || !assignServiceStartTime || !assignServiceEndTime) {
      setAssignCookStatus('Please select date, start time and end time for the service.');
      return;
    }

    const startIso = new Date(`${assignServiceDate}T${assignServiceStartTime}`);
    const endIso = new Date(`${assignServiceDate}T${assignServiceEndTime}`);
    if (isNaN(startIso.getTime()) || isNaN(endIso.getTime())) {
      setAssignCookStatus('Invalid date/time. Please check your inputs.');
      return;
    }
    if (startIso >= endIso) {
      setAssignCookStatus('End time must be after start time.');
      return;
    }

    // Ensure selected cook is available
    const cookObj = cooks.find(c => c._id === assignCookId);
    if (!cookObj) {
      setAssignCookStatus('Selected cook not found.');
      return;
    }
    if (!cookObj.isAvailable) {
      setAssignCookStatus('Selected cook is currently not available. Choose another cook.');
      return;
    }

    try {
  const response = await fetch(`${API_BASE_URL}/cooks/bookings/${selectedBookingToAssign._id}/assign-cook`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cookId: assignCookId,
          // send ISO strings so backend can store timezone-aware timestamps
          serviceStartTime: startIso.toISOString(),
          serviceEndTime: endIso.toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAssignCookStatus('Cook assigned successfully!');
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === selectedBookingToAssign._id ? { ...booking, ...data.booking } : booking
          )
        );
        // mark cook as booked locally
        setCooks(prev => prev.map(c => c._id === assignCookId ? { ...c, isAvailable: false, activeBookings: [...(c.activeBookings || []), selectedBookingToAssign._id] } : c));
        setTimeout(() => {
          setSelectedBookingToAssign(null);
          setAssignCookStatus('');
        }, 2000);
      } else {
        setAssignCookStatus(data.message || 'Failed to assign cook.');
      }
    } catch (err) {
      console.error('Error assigning cook:', err);
      setAssignCookStatus('An error occurred while assigning cook.');
    }
  };

  const paginate = (data, currentPage) => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return data.slice(indexOfFirst, indexOfLast);
  };

  const renderPagination = (data, currentPage, setPage) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${currentPage === 1 ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
        >
          Previous
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          if (pageNum > totalPages || pageNum < 1) return null;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${currentPage === pageNum ? 'bg-teal-700 text-white' : 'bg-zinc-700 text-gray-200 hover:bg-zinc-600'}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${currentPage === totalPages ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
        >
          Next
        </button>
      </div>
    );
  };

  const renderDetailFields = (item) => {
    return Object.entries(item)
      .filter(([key]) => key !== 'password' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt')
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value, null, 2);
        }
        return (
          <div key={key} className="flex justify-between py-2 border-b border-zinc-700 last:border-b-0">
            <span className="text-gray-300 text-sm capitalize">{capitalize(key.replace('_', ' '))}:</span>
            <span className="text-white font-mono text-sm break-all max-w-[300px]">{value || 'N/A'}</span>
          </div>
        );
      });
  };

  // Render only the specific booking fields user requested, in a predictable order
  const renderBookingDetails = (booking) => {
    if (!booking) return null;
    const fields = [
      { key: 'userName', label: 'User Name' },
      { key: 'userEmail', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'address', label: 'Address' },
      { key: 'dietaryPreference', label: 'Dietary Preference' },
      { key: 'mealPreference', label: 'Meal Preference' },
      { key: 'planDuration', label: 'Plan Duration' },
      { key: 'numPeople', label: 'Number of People' },
      { key: 'message', label: 'Message' },
      { key: 'assignedCookName', label: 'Assigned Cook' },
    ];

    return fields.map(({ key, label }) => {
      let value = booking[key];
      // Handle assignedCook when populated as object
      if (key === 'assignedCookName') {
        value = booking.assignedCookName || (booking.assignedCook && (booking.assignedCook.name || booking.assignedCook)) || null;
      }
      if (value === null || typeof value === 'undefined' || value === '') value = 'N/A';
      // For arrays, join them
      if (Array.isArray(value)) value = value.join(', ');
      return (
        <div key={key} className="flex justify-between py-2 border-b border-zinc-700 last:border-b-0">
          <span className="text-gray-300 text-sm">{label}:</span>
          <span className="text-white font-mono text-sm break-all max-w-[300px]">{value}</span>
        </div>
      );
    });
  };

  // Render only name, email and role for user details modal
  const renderUserDetails = (user) => {
    if (!user) return null;
    const fields = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
    ];
    return fields.map(({ key, label }) => {
      let value = user[key];
      if (value === null || typeof value === 'undefined' || value === '') value = 'N/A';
      return (
        <div key={key} className="flex justify-between py-2 border-b border-zinc-700 last:border-b-0">
          <span className="text-gray-300 text-sm">{label}:</span>
          <span className="text-white font-mono text-sm break-all max-w-[300px]">{value}</span>
        </div>
      );
    });
  };

  // Render only selected fields for message details modal
  const renderMessageDetails = (msg) => {
    if (!msg) return null;
    const fields = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'message', label: 'Message' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'address', label: 'Address' },
    ];
    return fields.map(({ key, label }) => {
      let value = msg[key];
      if (value === null || typeof value === 'undefined' || value === '') value = 'N/A';
      if (Array.isArray(value)) value = value.join(', ');
      return (
        <div key={key} className="flex justify-between py-2 border-b border-zinc-700 last:border-b-0">
          <span className="text-gray-300 text-sm">{label}:</span>
          <span className="text-white font-mono text-sm break-all max-w-[300px]">{value}</span>
        </div>
      );
    });
  };

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const demoScheduledBookings = bookings.filter(booking => booking.status === 'demo_scheduled');
  const approvedBookings = bookings.filter(booking => booking.status === 'approved');
  const rejectedBookings = bookings.filter(booking => booking.status === 'rejected');
  const coordinators = users.filter(user => user.role === 'coordinator');

  const renderUsersTable = (usersData, title, currentPage, setPage) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="p-6 rounded-xl shadow-2xl border border-zinc-700 bg-zinc-800/80 backdrop-blur-sm">
      <h3 className="text-2xl font-extrabold text-teal-400 mb-4 border-b border-teal-800 pb-2">{title} ({usersData.length})</h3>
      {error && currentView === (title === 'Registered Users' ? 'users' : 'coordinators') && (
        <div className="bg-red-700 text-red-100 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      {usersData.length === 0 ? (
        <p className="text-gray-400 italic">No {title.toLowerCase()} found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-zinc-900 rounded-lg shadow-inner border border-zinc-700">
              <thead>
                <tr className="bg-teal-900 text-left text-teal-200 uppercase text-xs font-semibold tracking-wider">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-sm font-light divide-y divide-zinc-700">
                {paginate(usersData, currentPage).map(user => (
                  <tr key={user._id} className="hover:bg-zinc-700 transition duration-150 ease-in-out">
                    <td className="py-3 px-4 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{user.name}</td>
                    <td className="py-3 px-4 text-left overflow-hidden text-ellipsis max-w-[160px]">{user.email}</td>
                    <td className="py-3 px-4 text-left whitespace-nowrap">{user.role}</td>
                    <td className="py-3 px-4 text-left whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-2 py-0.5 rounded-md text-sm border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white transition duration-150"
                        title="View Details"
                      >
                        View Details
                      </button>
                      {title === 'Registered Users' && user.role !== 'coordinator' && (
                        <button
                          onClick={() => handleChangeUserRole(user._id, 'coordinator')}
                          className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-xs hover:bg-blue-700 transition duration-200"
                        >
                          Make Coordinator
                        </button>
                      )}
                      {title === 'Coordinators' && user.role === 'coordinator' && (
                        <button
                          onClick={() => handleChangeUserRole(user._id, 'user')}
                          className="bg-red-600 text-white px-2 py-0.5 rounded-md text-xs hover:bg-red-700 transition duration-200"
                        >
                          Remove Coordinator
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(usersData, currentPage, setPage)}
        </>
      )}
    </motion.div>
  );

  const renderBookingsTable = (bookingsData, status, currentPage, setPage) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="p-6 rounded-xl shadow-2xl border border-zinc-700 bg-zinc-800/80 backdrop-blur-sm">
      <h3 className="text-2xl font-extrabold text-teal-400 mb-4 border-b border-teal-800 pb-2">{capitalize(status)} Bookings ({bookingsData.length})</h3>
      {bookingsData.length === 0 ? (
        <p className="text-gray-400 italic">No {status} bookings available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-zinc-900 rounded-lg shadow-inner border border-zinc-700">
              <thead>
                <tr className="bg-teal-900 text-left text-teal-200 uppercase text-xs font-semibold tracking-wider">
                  <th className="py-3 px-3">User Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Assigned Cook</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-xs font-light divide-y divide-zinc-700">
                {paginate(bookingsData, currentPage).map(booking => (
                  <tr key={booking._id} className="hover:bg-zinc-700 transition duration-150 ease-in-out">
                    <td className="py-2 px-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{booking.userName}</td>
                    <td className="py-2 px-3 text-left overflow-hidden text-ellipsis max-w-[120px]">{booking.userEmail}</td>
                    <td className="py-2 px-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">{booking.phone}</td>
                    <td className="py-2 px-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {booking.assignedCookName || (booking.assignedCook && (booking.assignedCook.name || booking.assignedCook)) || '—'}
                    </td>
                    <td className="py-2 px-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">{booking.planDuration}</td>
                    <td className="py-2 px-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px]">₹{booking.totalAmount?.toLocaleString('en-IN') || 'N/A'}</td>
                    <td className="py-2 px-3 text-left whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${booking.paymentStatus === 'paid' ? 'bg-green-600/80 text-green-100' : 'bg-yellow-600/80 text-yellow-100'}`}>
                        {booking.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-left whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)}
                        className="block w-full px-1 py-0.5 border border-zinc-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-xs bg-zinc-700 text-gray-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="demo_scheduled">Demo Scheduled</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 text-left">
                      <div className="flex flex-col space-y-1 min-w-[80px]">
                          <button
                            onClick={() => openAssignCookModal(booking)}
                            className={`w-full px-2 py-1 rounded-md text-xs font-medium transition duration-200 truncate ${(booking.assignedCook || booking.assignedCookName) ? 'bg-gray-600 text-gray-200 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                            disabled={Boolean(booking.assignedCook || booking.assignedCookName)}
                            title={(booking.assignedCook || booking.assignedCookName) ? 'Already Assigned' : 'Assign Cook'}
                          >
                            {(booking.assignedCook || booking.assignedCookName) ? 'Assigned' : 'Assign Cook'}
                          </button>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="w-full px-2 py-1 rounded-md text-xs border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white transition duration-150 truncate"
                            title="View Details"
                          >
                            View Details
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination(bookingsData, currentPage, setPage)}
        </>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-zinc-900">
        <p className="text-xl text-teal-400">Loading admin data...</p>
      </section>
    );
  }

  const navigationItems = [
    { view: 'summary', label: 'Dashboard Overview' },
    { view: 'bookings', label: 'All Bookings' },
    { view: 'users', label: 'Users' },
    { view: 'coordinators', label: 'Coordinators' },
    { view: 'settings', label: 'Admin Settings' },
    { view: 'messages', label: 'Contact Messages' },
    { view: 'cooks', label: 'Manage Cooks' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      <nav className="fixed left-0 top-0 h-screen w-64 bg-zinc-800 shadow-2xl p-6 flex flex-col justify-between border-r border-teal-900/50 z-10">
        <div>
          <h2 className="text-3xl font-extrabold text-teal-400 mb-10 tracking-wider">CookHub Admin</h2>
          <div className="space-y-3">
            {navigationItems.map(({ view, label }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition duration-200 ease-in-out flex items-center space-x-3 ${
                  currentView === view
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-700/30'
                    : 'text-gray-300 hover:bg-zinc-700 hover:text-teal-300'
                }`}
              >
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-700 px-4 py-3 rounded-lg text-lg font-semibold hover:bg-red-800 transition duration-200 shadow-md"
        >
          Logout
        </button>
      </nav>

      <div className="flex-1 ml-64 flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">
          <header className="mb-6 p-4 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-0">
              <h1 className="text-3xl font-extrabold text-gray-100">{capitalize(currentView)}</h1>
          </header>
          
          <div className="space-y-6">
            {currentView === 'summary' && (
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-teal-400">{users.length}</p>
                  </div>
                  <div className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Bookings</h3>
                    <p className="text-3xl font-bold text-teal-400">{bookings.length}</p>
                  </div>
                  <div className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Cooks</h3>
                    <p className="text-3xl font-bold text-teal-400">{cooks.length}</p>
                  </div>
                  <div className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Unread Messages</h3>
                    <p className="text-3xl font-bold text-teal-400">{contactMessages.filter(m => !m.isReviewed).length}</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700">
                  <h3 className="text-2xl font-bold text-teal-400 mb-4">Booking Summary (Aggregated)</h3>
                  {bookingSummary.length === 0 ? (
                    <p className="text-gray-400 italic">No aggregated booking data available yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto bg-zinc-900 rounded-lg shadow-sm border border-zinc-700">
                        <thead>
                          <tr className="bg-zinc-700 text-left text-gray-300 uppercase text-xs leading-normal">
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Duration</th>
                            <th className="py-3 px-4">Bookings</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-200 text-sm font-light divide-y divide-zinc-700">
                          {bookingSummary.map((item, index) => (
                            <tr key={index} className="hover:bg-zinc-700">
                              <td className="py-3 px-4 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{item.location}</td>
                              <td className="py-3 px-4 text-left whitespace-nowrap">{item.duration}</td>
                              <td className="py-3 px-4 text-left whitespace-nowrap">{item.bookingsCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            {currentView === 'bookings' && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setBookingsTab('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${bookingsTab === 'pending' ? 'bg-teal-600 text-white shadow-md' : 'bg-zinc-700 text-gray-200 hover:bg-teal-700'}`}
                  >
                    Pending ({pendingBookings.length})
                  </button>
                  <button
                    onClick={() => setBookingsTab('demo_scheduled')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${bookingsTab === 'demo_scheduled' ? 'bg-teal-600 text-white shadow-md' : 'bg-zinc-700 text-gray-200 hover:bg-teal-700'}`}
                  >
                    Demo Scheduled ({demoScheduledBookings.length})
                  </button>
                  <button
                    onClick={() => setBookingsTab('approved')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${bookingsTab === 'approved' ? 'bg-teal-600 text-white shadow-md' : 'bg-zinc-700 text-gray-200 hover:bg-teal-700'}`}
                  >
                    Approved ({approvedBookings.length})
                  </button>
                  <button
                    onClick={() => setBookingsTab('rejected')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${bookingsTab === 'rejected' ? 'bg-teal-600 text-white shadow-md' : 'bg-zinc-700 text-gray-200 hover:bg-teal-700'}`}
                  >
                    Rejected ({rejectedBookings.length})
                  </button>
                </div>
                {bookingsTab === 'pending' && renderBookingsTable(pendingBookings, 'pending', pendingPage, setPendingPage)}
                {bookingsTab === 'demo_scheduled' && renderBookingsTable(demoScheduledBookings, 'demo_scheduled', demoScheduledPage, setDemoScheduledPage)}
                {bookingsTab === 'approved' && renderBookingsTable(approvedBookings, 'approved', approvedPage, setApprovedPage)}
                {bookingsTab === 'rejected' && renderBookingsTable(rejectedBookings, 'rejected', rejectedPage, setRejectedPage)}
              </div>
            )}

            {currentView === 'users' && renderUsersTable(users, 'Registered Users', usersPage, setUsersPage)}

            {currentView === 'coordinators' && renderUsersTable(coordinators, 'Coordinators', coordinatorsPage, setCoordinatorsPage)}

            {/* Admin Settings Section */}
{motion.div && currentView === 'settings' && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-teal-300">Admin Settings</h2>
      <button
        onClick={() => setCurrentView('summary')}
        className="text-teal-400 hover:text-teal-300"
      >
        ← Back
      </button>
    </div>

    {/* Special: Notification Email Setting */}
    <div className="bg-zinc-800/80 p-6 rounded-xl border border-teal-600/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-teal-300">Notification Email Address</h3>
          <p className="text-sm text-gray-400 mt-1">
            This email is used to send booking confirmations, alerts, etc.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {getNotificationEmail() || 'Not set yet'}
          </p>
          {getNotificationEmail() && (
            <p className="text-xs text-gray-500">All emails sent from this address</p>
          )}
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.target.email.value.trim();
          if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
          }

          try {
            const existing = adminSettings.find(s => s.settingName === 'notificationEmail');
            const method = existing ? 'PUT' : 'POST';
            const url = existing 
              ? `${API_BASE_URL}/admin-settings/${existing._id}` 
              : `${API_BASE_URL}/admin-settings`;

            const res = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                settingName: 'notificationEmail',
                settingValue: email,
                description: 'Email address used for sending notifications to users'
              })
            });

            const data = await res.json();
            if (res.ok) {
              if (existing) {
                setAdminSettings(prev => prev.map(s => 
                  s._id === existing._id ? data : s
                ));
              } else {
                setAdminSettings(prev => [...prev, data]);
              }
              e.target.reset();
              setError('');
              alert('✅ Notification email updated successfully!');
            } else {
              throw new Error(data.message);
            }
          } catch (err) {
            setError(err.message || 'Failed to update email');
          }
        }}
        className="flex gap-3 mt-4"
      >
        <InputField
          name="email"
          type="email"
          placeholder={getNotificationEmail() || "Enter new email (e.g. bookings@cookhub.com)"}
          defaultValue={getNotificationEmail()}
          required
          className="flex-1"
          isDark={true}
        />
        <button
          type="submit"
          className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition shadow-lg"
        >
          {getNotificationEmail() ? 'Update Email' : 'Set Email'}
        </button>
      </form>
    </div>

    {/* Other Settings */}
    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
      <h3 className="text-xl font-bold text-teal-300 mb-4">Other Settings</h3>
      <form onSubmit={handleAddSetting} className="flex gap-3 mb-6">
        <InputField
          label="Setting Name"
          name="settingName"
          value={newSetting.settingName}
          onChange={handleNewSettingChange}
          placeholder="e.g. maintenanceMode"
          required
          isDark={true}
        />
        <InputField
          label="Value"
          name="settingValue"
          value={newSetting.settingValue}
          onChange={handleNewSettingChange}
          placeholder="true / false / any value"
          required
          isDark={true}
        />
        <InputField
          label="Description (optional)"
          name="description"
          value={newSetting.description}
          onChange={handleNewSettingChange}
          placeholder="What this setting does"
          isDark={true}
        />
        <div className="self-end">
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition"
          >
            Add Setting
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {adminSettings
          .filter(s => s.settingName !== 'notificationEmail') // Hide the special one
          .map(setting => (
            <div key={setting._id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
              <div>
                <p className="font-semibold text-teal-300">{setting.settingName}</p>
                <p className="text-lg text-white">{setting.settingValue}</p>
                {setting.description && <p className="text-xs text-gray-400 mt-1">{setting.description}</p>}
              </div>
              <button
                onClick={() => handleDeleteSetting(setting._id)}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  </motion.div>
)}

{currentView === 'messages' && (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700">
    <h3 className="text-2xl font-bold text-teal-400 mb-4">Contact Messages ({contactMessages.length})</h3>
    {contactMessages.length === 0 ? (
      <p className="text-gray-400 italic">No contact messages received yet.</p>
    ) : (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-zinc-900 rounded-lg shadow-inner border border-zinc-700">
            <thead>
              <tr className="bg-teal-900 text-left text-teal-200 uppercase text-xs font-semibold tracking-wider">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Mark/Unmark</th>
                <th className="py-3 px-4">View Details</th>
                <th className="py-3 px-2">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-200 text-sm font-light divide-y divide-zinc-700">
              {paginate(contactMessages, messagesPage).map(message => (
                <tr key={message._id} className="hover:bg-zinc-700 transition duration-150 ease-in-out">
                  <td className="py-3 px-4 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{message.fullName}</td>
                  <td className="py-3 px-4 text-left overflow-hidden text-ellipsis max-w-[160px]">{message.email}</td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${message.isReviewed ? 'bg-green-600/80 text-green-100' : 'bg-yellow-600/80 text-yellow-100'}`}>
                      {message.isReviewed ? 'Reviewed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    <button onClick={() => handleMarkMessageReviewed(message._id)} className={`px-2 py-0.5 rounded-md text-xs whitespace-nowrap transition duration-200 ${message.isReviewed ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                      {message.isReviewed ? 'Unmark' : 'Mark Reviewed'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    <button onClick={() => setSelectedMessage(message)} className="px-2 py-0.5 rounded-md text-xs whitespace-nowrap border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white transition duration-150">View Details</button>
                  </td>
                  <td className="py-3 px-2 text-left whitespace-nowrap">
                    <button onClick={() => handleDeleteMessage(message._id)} className="bg-red-600 text-white px-2 py-0.5 rounded-md text-xs whitespace-nowrap hover:bg-red-700 transition duration-200">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(contactMessages, messagesPage, setMessagesPage)}
      </>
    )}
  </motion.div>
)}

            {currentView === 'cooks' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-zinc-800/80 p-6 rounded-xl shadow-2xl border border-zinc-700"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-teal-400">Manage Cooks ({cooks.length})</h3>
                  <button
                    onClick={() => setShowAddCookModal(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition duration-200 shadow-md"
                  >
                    Add New Cook
                  </button>
                </div>
                {error && currentView === 'cooks' && (
                  <div className="bg-red-700 text-red-100 p-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}
                {cooks.length === 0 ? (
                  <p className="text-gray-400 italic">No cooks added yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-zinc-900 rounded-lg shadow-sm border border-zinc-700">
                      <thead>
                        <tr className="bg-teal-900 text-left text-teal-200 uppercase text-xs font-semibold tracking-wider">
                          <th className="py-3 px-2">Name</th>
                          <th className="py-3 px-2">Phone</th>
                          <th className="py-3 px-3">Specialties</th>
                          <th className="py-3 px-3">Service Areas</th>
                          <th className="py-3 px-2">Availability</th>
                          <th className="py-3 px-3">Booked For</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-200 text-xs font-light divide-y divide-zinc-700">
                        {paginate(cooks, cooksPage).map(cook => (
                          <tr key={cook._id} className="hover:bg-zinc-700 transition duration-150 ease-in-out">
                            <td className="py-2 px-2 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{cook.name}</td>
                            <td className="py-2 px-2 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">{cook.phone}</td>
                            <td className="py-2 px-3 text-left max-w-[120px] overflow-hidden text-ellipsis whitespace-normal break-words">{cook.specialties.join(', ') || 'N/A'}</td>
                            <td className="py-2 px-3 text-left max-w-[140px] overflow-hidden text-ellipsis whitespace-normal break-words">{cook.serviceAreas.join(', ') || 'N/A'}</td>
                            <td className="py-2 px-2 text-left whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cook.isAvailable ? 'bg-green-600/80 text-green-100' : 'bg-red-600/80 text-red-100'}`}>
                                {cook.isAvailable ? 'Available' : 'Booked'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-left max-w-[140px]">
                              {cook.activeBookings && cook.activeBookings.length > 0 ? (
                                <ol className="list-decimal list-inside text-xs space-y-1 max-h-16 overflow-y-auto">
                                  {cook.activeBookings.map((bookingId, index) => (
                                    <li key={bookingId} className="truncate" title={bookingId}>
                                      Booking #{index + 1}
                                    </li>
                                  ))}
                                </ol>
                              ) : (
                                <span className="text-gray-500">None</span>
                              )}
                            </td>
                            <td className="py-2 px-4 text-left space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteCook(cook._id)}
                                className="bg-red-600 text-white px-2 py-0.5 rounded-md text-xs hover:bg-red-700 transition duration-200"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setSelectedCook(cook)}
                                className="px-2 py-0.5 rounded-md text-xs border border-teal-600 text-teal-300 hover:bg-teal-600 hover:text-white transition duration-150"
                                title="View Details"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {renderPagination(cooks, cooksPage, setCooksPage)}
              </motion.div>
            )}

            {showAddCookModal && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-teal-600/50">
                  <h3 className="text-xl font-bold text-teal-300 mb-4 border-b border-zinc-700 pb-2">Add New Cook</h3>
                  {error && <div className="bg-red-700 text-red-100 p-3 rounded-md mb-4 text-sm">{error}</div>}
                  <form onSubmit={handleAddCook} className="space-y-3">
                    <InputField
                      label="Cook Name"
                      name="name"
                      value={newCook.name}
                      onChange={handleNewCookChange}
                      required
                      isDark={true}
                    />
                    <InputField
                      label="Email"
                      type="email"
                      name="email"
                      value={newCook.email}
                      onChange={handleNewCookChange}
                      required
                      isDark={true}
                    />
                    <InputField
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={newCook.phone}
                      onChange={handleNewCookChange}
                      required
                      isDark={true}
                    />
                    <InputField
                      label="Password"
                      type="password"
                      name="password"
                      value={newCook.password}
                      onChange={handleNewCookChange}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      isDark={true}
                    />
                    <InputField
                      label="Specialties (comma-separated, e.g., North Indian, Jain)"
                      name="specialties"
                      value={newCook.specialties}
                      onChange={handleNewCookChange}
                      isDark={true}
                    />
                    <InputField
                      label="Service Areas (comma-separated, e.g., South Delhi, West Mumbai)"
                      name="serviceAreas"
                      value={newCook.serviceAreas}
                      onChange={handleNewCookChange}
                      isDark={true}
                    />
                    <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-700 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCookModal(false);
                          setError('');
                          setNewCook({ name: '', email: '', phone: '', specialties: '', serviceAreas: '', password: '' });
                        }}
                        className="bg-gray-600 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-600 text-white px-4 py-1.5 rounded-lg hover:bg-teal-700 transition duration-200 text-sm"
                      >
                        Add Cook
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>

        
      </div>

      {selectedBookingToAssign && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-zinc-800 p-7 rounded-xl shadow-2xl max-w-2xl w-full border border-teal-600/50">
      <h3 className="text-2xl font-bold text-teal-300 mb-5 border-b border-zinc-700 pb-3">
        Assign Cook to Booking
      </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
        <div>
          <span className="font-semibold">Booking ID:</span> {selectedBookingToAssign.displayId || selectedBookingToAssign._id}
        </div>
        <div>
          <span className="font-semibold">User:</span> {selectedBookingToAssign.userName}
        </div>
        <div>
          <span className="font-semibold">Dietary Preference:</span>{' '}
          <span className="text-teal-400 font-bold">
            {selectedBookingToAssign.dietaryPreference || 'Not specified'}
          </span>
        </div>
        <div>
          <span className="font-semibold">Plan:</span>{' '}
          {selectedBookingToAssign.planDuration}
        </div>
      </div>

      {assignCookStatus && (
        <div
          className={`text-center py-3 rounded-lg mb-5 font-medium ${
            assignCookStatus.includes('successfully') || assignCookStatus.includes('Cook assigned')
              ? 'bg-green-700 text-green-100'
              : 'bg-red-700 text-red-100'
          }`}
        >
          {assignCookStatus}
        </div>
      )}

      <form onSubmit={handleAssignCook} className="space-y-6">
        {/* Smart Cook Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Select Cook (Auto-filtered by dietary preference)
          </label>

          {(() => {
            const dietary = (selectedBookingToAssign?.dietaryPreference || '')
              .toLowerCase()
              .trim();

            const matchingCooks = cooks.filter((cook) => {
              if (!cook.isAvailable) return false;
              if (!dietary) return true;

              return cook.specialties.some((spec) =>
                spec.toLowerCase().includes(dietary) ||
                dietary.includes(spec.toLowerCase())
              );
            });

            if (matchingCooks.length === 0) {
              return (
                <div className="bg-orange-900/60 border border-orange-600 text-orange-200 p-4 rounded-lg text-sm">
                  ⚠️ No available cook matches "<strong>{selectedBookingToAssign.dietaryPreference}</strong>" preference.
                  <br />
                  <span className="text-gray-400">
                    Add more cooks or assign manually by temporarily changing the filter.
                  </span>
                </div>
              );
            }

            const selectedCookObj = matchingCooks.find(c => c._id === assignCookId);

            return (
              <>
                <select
                  value={assignCookId}
                  onChange={(e) => setAssignCookId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:border-teal-500 focus:outline-none transition text-sm"
                >
                  <option value="">-- Choose a Cook --</option>
                  {matchingCooks.map((cook) => (
                    <option key={cook._id} value={cook._id}>
                      {cook.name} • {cook.phone} • Areas: {cook.serviceAreas.join(', ')} • Active Bookings:{' '}
                      {cook.activeBookings?.length || 0}
                    </option>
                  ))}
                </select>

                {selectedCookObj && selectedBookingToAssign && !selectedCookObj.serviceAreas.some(area =>
                  selectedBookingToAssign.address?.toLowerCase().includes(area.toLowerCase())
                ) && (
                  <p className="text-orange-400 text-xs mt-2 flex items-center gap-1">
                    ⚠️ Cook may not regularly service this area
                  </p>
                )}
              </>
            );
          })()}
        </div>

        {/* Smart Time Suggestions */}
        <div className="bg-zinc-900/70 p-5 rounded-lg border border-zinc-700">
          <p className="text-sm font-medium text-gray-300 mb-3">
            Suggested Time Slots for <strong>{selectedBookingToAssign.planDuration}</strong> Plan:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedBookingToAssign.planDuration?.toLowerCase().includes('month') && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAssignServiceStartTime('09:00');
                    setAssignServiceEndTime('12:00');
                  }}
                  className="px-3 py-2 text-xs bg-teal-700 hover:bg-teal-600 rounded transition"
                >
                  Morning 9AM–12PM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssignServiceStartTime('13:00');
                    setAssignServiceEndTime('16:00');
                  }}
                  className="px-3 py-2 text-xs bg-teal-700 hover:bg-teal-600 rounded transition"
                >
                  Lunch 1PM–4PM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssignServiceStartTime('18:00');
                    setAssignServiceEndTime('21:00');
                  }}
                  className="px-3 py-2 text-xs bg-teal-700 hover:bg-teal-600 rounded transition"
                >
                  Dinner 6PM–9PM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssignServiceStartTime('13:00');
                    setAssignServiceEndTime('21:00');
                  }}
                  className="px-3 py-2 text-xs bg-orange-700 hover:bg-orange-600 rounded transition"
                >
                  Full Day (Lunch + Dinner)
                </button>
              </>
            )}

            {selectedBookingToAssign.planDuration?.toLowerCase().includes('15') && (
              <button
                type="button"
                onClick={() => setPresetTimes('18:00', '21:00')}
                className="px-3 py-2 text-xs bg-teal-700 hover:bg-teal-600 rounded transition"
              >
                Dinner Only 6PM–9PM
              </button>
            )}

            {(selectedBookingToAssign.planDuration?.toLowerCase().includes('trial') ||
              selectedBookingToAssign.planDuration?.toLowerCase().includes('demo')) && (
              <>
                <button
                  type="button"
                  onClick={() => setPresetTimes('12:00', '14:00')}
                  className="px-3 py-2 text-xs bg-purple-700 hover:bg-purple-600 rounded transition"
                >
                  Demo Lunch
                </button>
                <button
                  type="button"
                  onClick={() => setPresetTimes('19:00', '21:30')}
                  className="px-3 py-2 text-xs bg-purple-700 hover:bg-purple-600 rounded transition"
                >
                  Demo Dinner
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setAssignServiceStartTime('');
                setAssignServiceEndTime('');
              }}
              className="px-3 py-2 text-xs bg-zinc-700 hover:bg-zinc-600 rounded transition"
            >
              Custom Time
            </button>
          </div>
        </div>

        {/* Date & Time Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Service Date"
            type="date"
            value={assignServiceDate}
            onChange={(e) => setAssignServiceDate(e.target.value)}
            required
            isDark={true}
          />
          <InputField
            label="Start Time"
            type="time"
            value={assignServiceStartTime}
            onChange={(e) => setAssignServiceStartTime(e.target.value)}
            required
            isDark={true}
          />
          <InputField
            label="End Time"
            type="time"
            value={assignServiceEndTime}
            onChange={(e) => setAssignServiceEndTime(e.target.value)}
            required
            isDark={true}
          />
        </div>

        {/* Live Preview */}
        {assignServiceDate && assignServiceStartTime && assignServiceEndTime && (
          <div className="p-3 bg-zinc-900 rounded text-sm text-gray-300 border border-zinc-700">
            <strong>Preview:</strong>{' '}
            {new Date(`${assignServiceDate}T${assignServiceStartTime}`).toLocaleString()} →{' '}
            {new Date(`${assignServiceDate}T${assignServiceEndTime}`).toLocaleString()}
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-700">
          <button
            type="button"
            onClick={() => {
              setSelectedBookingToAssign(null);
              setAssignCookStatus('');
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium shadow-lg"
          >
            Assign Cook
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-teal-600/50 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold text-teal-300 mb-4 border-b border-zinc-700 pb-2">Booking Details</h3>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {renderBookingDetails(selectedBooking)}
            </div>
            <div className="flex justify-end pt-3 border-t border-zinc-700 mt-4">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-600 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-teal-600/50 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold text-teal-300 mb-4 border-b border-zinc-700 pb-2">User Details</h3>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {renderUserDetails(selectedUser)}
            </div>
            <div className="flex justify-end pt-3 border-t border-zinc-700 mt-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-600 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-teal-600/50 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold text-teal-300 mb-4 border-b border-zinc-700 pb-2">Message Details</h3>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {renderMessageDetails(selectedMessage)}
            </div>
            <div className="flex justify-end pt-3 border-t border-zinc-700 mt-4">
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-gray-600 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCook && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-teal-600/50 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold text-teal-300 mb-4 border-b border-zinc-700 pb-2">Cook Details</h3>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {renderDetailFields(selectedCook)}
            </div>
            <div className="flex justify-end pt-3 border-t border-zinc-700 mt-4">
              <button
                onClick={() => setSelectedCook(null)}
                className="bg-gray-600 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;