import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, MapPin, Phone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../utils/constants';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const [userResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/admin/users/${id}/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        const [userData, bookingsData] = await Promise.all([
          userResponse.json(),
          bookingsResponse.json()
        ]);

        if (userResponse.ok) {
          setUser(userData);
        } else {
          throw new Error(userData.message || 'Failed to fetch user details');
        }

        if (bookingsResponse.ok) {
          setUserBookings(bookingsData);
        } else {
          console.warn('Failed to fetch user bookings:', bookingsData.message);
          setUserBookings([]);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchUserDetails();
    } else {
      setError('Authentication token or user ID missing.');
      setLoading(false);
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 to-teal-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-300 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 to-teal-900 p-8 flex items-center justify-center">
        <div className="bg-red-800 text-red-100 p-8 rounded-xl shadow-lg border border-red-700 text-center">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-700 text-yellow-100';
      case 'approved': return 'bg-green-700 text-green-100';
      case 'demo_scheduled': return 'bg-blue-700 text-blue-100';
      case 'rejected': return 'bg-red-700 text-red-100';
      default: return 'bg-gray-700 text-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-700 text-red-100';
      case 'user': return 'bg-blue-700 text-blue-100';
      default: return 'bg-gray-700 text-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 to-teal-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="p-2 rounded-full bg-teal-700 hover:bg-teal-800 transition duration-200"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white">User Details</h1>
                  <p className="text-teal-100">ID: {user._id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                  {user.role.toUpperCase()}
                </span>
                <p className="text-teal-100 mt-2 text-sm">
                  Registered: {new Date(user.registeredAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* User Information */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 mb-8">
              <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2" />
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white font-semibold text-lg">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p className="text-white font-semibold">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Account Role</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Registration Date</p>
                      <p className="text-white font-semibold">
                        {new Date(user.registeredAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Last Updated</p>
                      <p className="text-white font-semibold">
                        {new Date(user.updatedAt || user.registeredAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Phone Number</p>
                        <p className="text-white font-semibold">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{userBookings.length}</h3>
                <p className="text-gray-400">Total Bookings</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {userBookings.filter(b => b.status === 'approved').length}
                </h3>
                <p className="text-gray-400">Approved Bookings</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {userBookings.filter(b => b.status === 'pending').length}
                </h3>
                <p className="text-gray-400">Pending Bookings</p>
              </div>
            </div>

            {/* User Bookings */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                User Bookings ({userBookings.length})
              </h2>
              {userBookings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">This user hasn't made any bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-zinc-800 rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-zinc-700 text-left text-gray-300 uppercase text-sm leading-normal">
                        <th className="py-3 px-4">Booking ID</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4">Diet</th>
                        <th className="py-3 px-4">Meal</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-200 text-sm font-light">
                      {userBookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-zinc-700 hover:bg-zinc-700">
                          <td className="py-3 px-4 font-mono text-xs">
                            {booking._id.substring(0, 8)}...
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">{booking.address}</td>
                          <td className="py-3 px-4">{booking.dietaryPreference}</td>
                          <td className="py-3 px-4">{booking.mealPreference}</td>
                          <td className="py-3 px-4">{booking.planDuration}</td>
                          <td className="py-3 px-4">₹{booking.totalAmount?.toLocaleString('en-IN') || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => navigate(`/admin/booking-details/${booking._id}`)}
                              className="text-teal-400 hover:text-teal-300 underline text-sm"
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetails;