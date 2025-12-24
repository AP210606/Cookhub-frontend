import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, ChefHat, Calendar, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../utils/constants';

const CookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cook, setCook] = useState(null);
  const [cookBookings, setCookBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCookDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const [cookResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/cooks/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/admin/cooks/${id}/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        const [cookData, bookingsData] = await Promise.all([
          cookResponse.json(),
          bookingsResponse.json()
        ]);

        if (cookResponse.ok) {
          setCook(cookData);
        } else {
          throw new Error(cookData.message || 'Failed to fetch cook details');
        }

        if (bookingsResponse.ok) {
          setCookBookings(bookingsData);
        } else {
          console.warn('Failed to fetch cook bookings:', bookingsData.message);
          setCookBookings([]);
        }
      } catch (err) {
        console.error('Error fetching cook details:', err);
        setError(err.message || 'Failed to load cook details.');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchCookDetails();
    } else {
      setError('Authentication token or cook ID missing.');
      setLoading(false);
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 to-teal-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-300 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading cook details...</p>
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
                  <h1 className="text-3xl font-bold text-white">Cook Details</h1>
                  <p className="text-teal-100">ID: {cook._id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  {cook.isAvailable ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    cook.isAvailable 
                      ? 'bg-green-700 text-green-100' 
                      : 'bg-red-700 text-red-100'
                  }`}>
                    {cook.isAvailable ? 'AVAILABLE' : 'BUSY'}
                  </span>
                </div>
                <p className="text-teal-100 text-sm">
                  Added: {new Date(cook.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Cook Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white font-semibold text-lg">{cook.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Phone Number</p>
                      <p className="text-white font-semibold">{cook.phone}</p>
                    </div>
                  </div>
                  {cook.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Email Address</p>
                        <p className="text-white font-semibold">{cook.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Added On</p>
                      <p className="text-white font-semibold">
                        {new Date(cook.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
                  <ChefHat className="w-6 h-6 mr-2" />
                  Professional Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <ChefHat className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Specialty</p>
                      <p className="text-white font-semibold">{cook.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Experience</p>
                      <p className="text-white font-semibold">{cook.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Rating</p>
                      <div className="flex items-center">
                        <span className="text-white font-semibold mr-1">{cook.rating?.toFixed(1) || 'N/A'}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{cookBookings.length}</h3>
                <p className="text-gray-400">Total Assignments</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {cookBookings.filter(b => b.status === 'approved').length}
                </h3>
                <p className="text-gray-400">Completed Jobs</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {cook.activeBookings ? cook.activeBookings.length : 0}
                </h3>
                <p className="text-gray-400">Active Bookings</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {cook.rating ? cook.rating.toFixed(1) : 'N/A'}
                </h3>
                <p className="text-gray-400">Average Rating</p>
              </div>
            </div>

            {/* Active Bookings */}
            {cook.activeBookings && cook.activeBookings.length > 0 && (
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 mb-8">
                <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Current Active Bookings
                </h2>
                <div className="grid gap-4">
                  {cook.activeBookings.map((bookingId, index) => (
                    <div key={index} className="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-400 text-sm">Booking ID</p>
                          <p className="text-white font-mono">{bookingId}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/booking-details/${bookingId}`)}
                          className="text-teal-400 hover:text-teal-300 underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignment History */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h2 className="text-2xl font-bold text-teal-300 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                Assignment History ({cookBookings.length})
              </h2>
              {cookBookings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">This cook hasn't been assigned to any bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-zinc-800 rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-zinc-700 text-left text-gray-300 uppercase text-sm leading-normal">
                        <th className="py-3 px-4">Booking ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4">Service Period</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-200 text-sm font-light">
                      {cookBookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-zinc-700 hover:bg-zinc-700">
                          <td className="py-3 px-4 font-mono text-xs">
                            {booking._id.substring(0, 8)}...
                          </td>
                          <td className="py-3 px-4">{booking.userName}</td>
                          <td className="py-3 px-4 max-w-xs truncate">{booking.address}</td>
                          <td className="py-3 px-4">
                            {booking.serviceStartTime && booking.serviceEndTime ? (
                              <div className="text-xs">
                                <p>{new Date(booking.serviceStartTime).toLocaleDateString('en-IN')}</p>
                                <p className="text-gray-400">
                                  {new Date(booking.serviceStartTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - 
                                  {new Date(booking.serviceEndTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            ) : 'Not scheduled'}
                          </td>
                          <td className="py-3 px-4">{booking.planDuration}</td>
                          <td className="py-3 px-4">₹{booking.totalAmount?.toLocaleString('en-IN') || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
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

export default CookDetails;