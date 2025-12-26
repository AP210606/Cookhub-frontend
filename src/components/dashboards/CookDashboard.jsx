import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Filter, Users, User, ClipboardList, MapPin,
  AlertCircle, CheckCircle, LogOut, Edit, Trash2, X, Save, Clock, Mail, Phone, Check, PieChart, BarChart,
  Home, Settings, BarChart3, ChevronLeft, ArrowLeft, Calendar, Image as ImageIcon, Briefcase, ListTodo,
  Star, TrendingUp, RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// API base: prefer environment variable, fall back to localhost dev API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://cookhub-backend.onrender.com/api';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// --- HELPER COMPONENTS (ProfileCard defined locally for single file mandate) ---

const ProfileCard = ({ user, handleLogout, themeColor }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-xl border-t-4 border-${themeColor}-500`}>
        <div className="flex flex-col items-center">
            <div className={`h-24 w-24 rounded-full bg-${themeColor}-100 text-${themeColor}-500 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md`}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-800">{user.name || 'Cook User'}</h2>
            <p className="text-sm text-slate-500">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown Role'}</p>
        </div>
        <div className="mt-6 space-y-3 border-t pt-4 border-slate-100">
            <p className="text-sm text-slate-700 flex items-center">
                <Mail className="h-4 w-4 mr-3 text-slate-400" />
                {user.email || 'N/A'}
            </p>
            <p className="text-sm text-slate-700 flex items-center">
                <Phone className="h-4 w-4 mr-3 text-slate-400" />
                {user.phone || 'N/A'}
            </p>
        </div>
        <button
            onClick={handleLogout}
            className={`w-full mt-6 py-2 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center`}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </button>
    </div>
);


const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
  </div>
);

// Reusable micro-spinner for buttons/cards
const MicroSpinner = ({ color = 'text-white' }) => (
    <RefreshCw className={`animate-spin h-4 w-4 ${color} mr-2`} />
);

const CookTable = ({ cooks, onEdit, onDelete, onStatusChange }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Cooks Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {cooks.map((cook) => (
                <tr key={cook._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cook.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{cook.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{cook.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{cook.location || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onEdit(cook)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => onDelete(cook._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
);
const ApplicationTable = ({ applications, cooks, onAssign, onComplete, onCancel }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Applications Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{app.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{app.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{app.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onAssign(app.id)} className="text-green-600 hover:text-green-900 mr-4">Assign</button>
                    <button onClick={() => onComplete(app.id)} className="text-blue-600 hover:text-blue-900 mr-4">Complete</button>
                    <button onClick={() => onCancel(app.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
);
const CookForm = ({ cook, onSave, onCancel, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{cook ? 'Edit Cook' : 'Add New Cook'}</h2>
        <p>Cook Form content placeholder...</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
          <button onClick={() => onSave({})} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};
const AssignCookModal = ({ booking, cooks, onAssign, onClose, assignStatus }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Assign Cook to Booking #{booking.id}</h2>
        <p>Cook assignment modal placeholder...</p>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};
const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Booking Details #{booking.id}</h2>
        <p>Details content placeholder...</p>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
};

// --- COORDINATOR DASHBOARD CONTENT ---
const CoordinatorDashboardContent = ({ user, applications, cooks, handleLogout }) => {
    // Retaining all Coordinator state and logic
    const [activeTab, setActiveTab] = useState('applications');
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCook, setEditingCook] = useState(null);
    const [selectedBookingToAssign, setSelectedBookingToAssign] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [assignStatus, setAssignStatus] = useState(null);

    const handleSaveCook = (cookData) => { console.log('Saving cook:', cookData); setIsFormOpen(false); setEditingCook(null); };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => { setLoading(false); }, 1500);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row gap-6">

            {/* Main Content Area */}
            <div className="lg:w-3/4 space-y-6">
                <div className="flex justify-start border-b border-slate-200 mb-6">
                    {['applications', 'cooks', 'reports'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-6 text-base font-medium transition-colors border-b-2 ${
                                activeTab === tab
                                ? 'text-amber-600 border-amber-500'
                                : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? <LoadingSpinner /> : (
                    <>
                        {activeTab === 'applications' && (
                            <ApplicationTable
                                applications={applications}
                                cooks={cooks}
                                onAssign={id => setSelectedBookingToAssign({ id })}
                                onComplete={() => console.log('Complete')}
                                onCancel={() => console.log('Cancel')}
                            />
                        )}
                        {activeTab === 'cooks' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => { setIsFormOpen(true); setEditingCook(null); }}
                                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-medium rounded-xl shadow-md hover:bg-amber-600 transition-colors"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add New Chef
                                </button>
                                <CookTable
                                    cooks={cooks}
                                    onEdit={cook => { setEditingCook(cook); setIsFormOpen(true); }}
                                    onDelete={() => console.log('Delete cook')}
                                    onStatusChange={() => console.log('Change status')}
                                />
                            </div>
                        )}
                        {activeTab === 'reports' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Application Status</h3>
                                    <Pie data={{ labels: ['Pending', 'Assigned', 'Completed'], datasets: [{ data: [30, 50, 20], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'] }] }} />
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Cook Performance</h3>
                                    <Bar data={{ labels: ['Cook A', 'Cook B', 'Cook C'], datasets: [{ label: 'Completed Jobs', data: [15, 25, 10], backgroundColor: '#ef4444' }] }} />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Location Coordinator Profile - SLIDE BAR */}
            {user && (
                <div className="lg:w-1/4 p-0">
                    <ProfileCard user={user} handleLogout={handleLogout} themeColor="amber" />
                </div>
            )}
            {/* Modals for Coordinator */}
            <CookForm cook={editingCook} onSave={handleSaveCook} onCancel={() => { setIsFormOpen(false); setEditingCook(null); }} isOpen={isFormOpen} />
            <AssignCookModal booking={selectedBookingToAssign} cooks={cooks} onAssign={() => console.log('Assign')} onClose={() => setSelectedBookingToAssign(null)} assignStatus={assignStatus} />
            <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        </div>
    );
}

// --- COOK DASHBOARD CONTENT (NEW PAGE) ---

const CookDashboardContent = ({ user, bookings, handleLogout, ratings = [] }) => {
    const initialBookingsArr = Array.isArray(bookings)
        ? bookings
        : (bookings && typeof bookings === 'object')
            ? (bookings.activeBookings || bookings.bookings || [])
            : [];

    const [localBookings, setLocalBookings] = useState(initialBookingsArr);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [notificationSent, setNotificationSent] = useState(false);

    // New State for Status Update UI
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateStatusId, setUpdateStatusId] = useState(null); // Track which booking is updating
    const [deleteStatusId, setDeleteStatusId] = useState(null); // Track which booking is deleting
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const token = localStorage.getItem('authToken');

    // Polling for real-time updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                fetchBookings();
            }
        }, 30000); // Poll every 30 seconds for real-time simulation

        return () => clearInterval(interval);
    }, [token]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cooks/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setLocalBookings(data);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    useEffect(() => {
        setLocalBookings(initialBookingsArr);
    }, [initialBookingsArr]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    }, []);

    const getTimestamp = (booking) => new Date(`${booking.date} ${booking.time}`).getTime();

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const statusConfig = useMemo(() => ({
        'Upcoming': { color: 'blue', bg: 'blue-100', text: 'blue-800', btnBg: 'bg-blue-500', btnHover: 'hover:bg-blue-600' },
        'On the Way': { color: 'yellow', bg: 'yellow-100', text: 'yellow-800', btnBg: 'bg-yellow-500', btnHover: 'hover:bg-yellow-600' },
        'Arrived': { color: 'green', bg: 'green-100', text: 'green-800', btnBg: 'bg-green-500', btnHover: 'hover:bg-green-600' },
        'Completed': { color: 'gray', bg: 'gray-100', text: 'gray-800', btnBg: 'bg-gray-500', btnHover: 'hover:bg-gray-600' },
        'Not Available': { color: 'red', bg: 'red-100', text: 'red-800', btnBg: 'bg-red-500', btnHover: 'hover:bg-red-600' },
        'Missed': { color: 'red', bg: 'red-100', text: 'red-800', btnBg: 'bg-red-500', btnHover: 'hover:bg-red-600' },
    }), []);

    const now = useMemo(() => Date.now(), []);

    const sortedBookings = useMemo(() => {
        const future = localBookings
            .filter(b => getTimestamp(b) > now)
            .sort((a, b) => getTimestamp(a) - getTimestamp(b)); // Soonest first
        const past = localBookings
            .filter(b => getTimestamp(b) <= now)
            .sort((a, b) => getTimestamp(b) - getTimestamp(a)); // Most recent past first
        return [...future, ...past];
    }, [localBookings, now]);

    const activeBookings = useMemo(() =>
        localBookings
            .filter(b => getTimestamp(b) > now && ['Upcoming', 'On the Way', 'Arrived'].includes(b.status))
            .sort((a, b) => getTimestamp(a) - getTimestamp(b)),
        [localBookings, now]
    );

    const currentBooking = activeBookings[0];
    const nextBooking = activeBookings[1];

    const getDerivedStatus = (booking) => {
        if (booking.status !== 'Upcoming') return booking.status;
        if (getTimestamp(booking) > now) return 'Upcoming';
        // If past due, mark as Missed
        return 'Missed';
    };

    const getNextStatus = (booking) => {
        if (!booking) return [];
        const status = booking.status;
        const timestamp = getTimestamp(booking);
        const derivedStatus = getDerivedStatus(booking);

        // If derived status is different, no actions available
        if (derivedStatus !== status) return [];

        switch (status) {
            case 'Upcoming':
                // Only allow action if time has arrived or passed
                if (timestamp > now) return [];
                return [{ value: 'On the Way', label: 'Start Travel (On the Way)' }];
            case 'On the Way':
                return [{ value: 'Arrived', label: 'I have Arrived' }];
            case 'Arrived':
                return [{ value: 'Completed', label: 'Job Completed' }];
            case 'Completed':
            case 'Not Available':
            default:
                return [];
        }
    };

    const notifyNearbyCoordinator = async () => {
        if (!currentLocation || !token) {
            console.error('No location or token available for notification');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/cooks/notify-nearby-coordinator`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: currentLocation,
                    bookingId: currentBooking?.id
                }),
            });
            if (response.ok) {
                console.log('Notification sent to nearby coordinator');
                setNotificationSent(true);
                setTimeout(() => setNotificationSent(false), 3000);
            } else {
                console.error('Failed to send notification');
            }
        } catch (err) {
            console.error('Error sending notification:', err);
        }
    };

    const updateStatus = async (bookingId, newStatus) => {
        if (!token) {
            console.error('No token available');
            setUpdateError(`No token found for booking ${bookingId}`);
            return;
        }

        setIsUpdating(true);
        setUpdateStatusId(bookingId);
        setUpdateError(null); // Clear previous errors

        // Mock success for demo (remove or comment out for real API)
        // This simulates the API response since the mock API doesn't exist
        setTimeout(() => {
            setLocalBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            // Re-fetch to sync with server (for real-time consistency) - optional for mock
            // await fetchBookings();
            // Only notify if status is 'Arrived'
            if (newStatus === 'Arrived') {
                setNotificationSent(true);
                setTimeout(() => setNotificationSent(false), 3000);
                // await notifyNearbyCoordinator();
            }
            setIsUpdating(false);
            setUpdateStatusId(null);
        }, 1000); // Simulate network delay

        // Real API call (commented out for demo)
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                // Real-time update: Immediately update local state
                setLocalBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
                // Re-fetch to sync with server (for real-time consistency)
                await fetchBookings();
                // Only notify if status is 'Arrived'
                if (newStatus === 'Arrived') {
                    await notifyNearbyCoordinator();
                }
            } else {
                // Mock response body if API fails
                const errorBody = await response.json().catch(() => ({ message: 'Server did not provide error details.' }));
                throw new Error(errorBody.message || 'Failed to update status on server.');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            setUpdateError(err.message || 'An unexpected error occurred during status update.');
        } finally {
            setIsUpdating(false);
            setUpdateStatusId(null);
        }
        */
    };

    // New: Delete booking and notify coordinator
    const deleteBooking = async (bookingId) => {
        if (!token || !window.confirm('Are you sure you want to delete this booking? This will notify the coordinator to reassign it.')) {
            return;
        }

        setIsDeleting(true);
        setDeleteStatusId(bookingId);
        setDeleteError(null);

        // Mock success for demo
        setTimeout(() => {
            setLocalBookings(prev => prev.filter(b => b.id !== bookingId));
            // Re-fetch for consistency
            // await fetchBookings();
            console.log('Booking deleted and coordinator notified for reassignment.');
            setIsDeleting(false);
            setDeleteStatusId(null);
        }, 500);

        // Real API call (commented out)
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason: 'Cook unavailable - please reassign to another cook' }),
            });
            if (response.ok) {
                // Update local state immediately
                setLocalBookings(prev => prev.filter(b => b.id !== bookingId));
                // Re-fetch for consistency
                await fetchBookings();
                // Notify coordinator (via the DELETE endpoint or separate call)
                console.log('Booking deleted and coordinator notified for reassignment.');
            } else {
                const errorBody = await response.json().catch(() => ({ message: 'Server did not provide error details.' }));
                throw new Error(errorBody.message || 'Failed to delete booking.');
            }
        } catch (err) {
            console.error('Error deleting booking:', err);
            setDeleteError(err.message || 'An unexpected error occurred during deletion.');
        } finally {
            setIsDeleting(false);
            setDeleteStatusId(null);
        }
        */
    };

    const updateRating = async (bookingId, rating) => {
        if (!token) {
            console.error('No token available');
            return;
        }
        // Mock for demo
        setLocalBookings(prev => prev.map(b => b.id === bookingId ? { ...b, rating } : b));

        // Real
        /*
        try {
            const response = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}/rating`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating }),
            });
            if (response.ok) {
                setLocalBookings(prev => prev.map(b => b.id === bookingId ? { ...b, rating } : b));
            } else {
                console.error('Failed to update rating');
            }
        } catch (err) {
            console.error('Error updating rating:', err);
        }
        */
    };

    const Rating = ({ value = 0, onChange, className = '' }) => (
        <div className={`flex ${className}`}>
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-5 w-5 cursor-pointer transition-colors ${i < value ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-400'}`}
                    onClick={() => onChange(i + 1)}
                />
            ))}
        </div>
    );

    const getStatusConfig = (status) => statusConfig[status] || statusConfig['Upcoming'];

    // --- NEW/MODIFIED HELPER COMPONENTS FOR NEW UI ---

    const CurrentLocationMapCard = () => (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-indigo-500 transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-indigo-500" />
                    My Live Location
                </h3>
                {currentLocation && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">Tracking...</span>
                )}
            </div>

            <div className="flex-grow bg-slate-100 rounded-lg flex items-center justify-center mb-4 border border-slate-200 h-40">
                <p className="text-slate-500 italic text-center p-4">
                    {/* Placeholder for map - integrate with Google Maps or Leaflet if needed */}
                    📍 Location Preview
                </p>
            </div>

            {currentLocation ? (
                <div className="space-y-2 text-sm text-slate-700">
                    <p className="flex justify-between">
                        <span className="font-medium">Latitude:</span> {currentLocation.lat.toFixed(6)}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Longitude:</span> {currentLocation.lng.toFixed(6)}
                    </p>
                    <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`, '_blank')}
                        className="w-full py-2 mt-3 rounded-xl text-white font-medium bg-indigo-500 hover:bg-indigo-600 transition-colors"
                    >
                        Open in Google Maps
                    </button>
                </div>
            ) : (
                <p className="text-slate-500 italic">Fetching your location... (Enable location services in browser)</p>
            )}
        </div>
    );

    const QuickStatsCard = ({ user, localBookings }) => {
        const completedJobs = localBookings.filter(b => b.status === 'Completed').length;
        const totalRating = localBookings.reduce((sum, b) => sum + (b.rating || 0), 0);
        const averageRating = completedJobs > 0 ? (totalRating / completedJobs).toFixed(1) : 'N/A';
        const upcomingJobs = localBookings.filter(b => getTimestamp(b) > now && ['Upcoming', 'On the Way'].includes(b.status)).length;

        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-500 space-y-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-emerald-500" />
                    My Performance
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">{completedJobs}</p>
                        <p className="text-xs text-slate-500 mt-1">Jobs Completed</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">{averageRating}</p>
                        <p className="text-xs text-slate-500 mt-1">Avg. Rating</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg col-span-2">
                        <p className="text-2xl font-bold text-blue-600">{upcomingJobs}</p>
                        <p className="text-xs text-slate-500 mt-1">Upcoming Jobs</p>
                    </div>
                </div>
            </div>
        );
    };

    const RecentRatingsCard = ({ ratings = [] }) => {
        const count = Array.isArray(ratings) ? ratings.length : 0;
        const avg = count ? (ratings.reduce((s, r) => s + (r.rating || 0), 0) / count) : 0;
        const avgRounded = Math.round(avg);
        const avgDisplay = count ? avg.toFixed(1) : 'N/A';
        const recent = Array.isArray(ratings) ? ratings.slice(0, 5) : [];

        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-yellow-400">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-800">Recent Ratings</h3>
                    <div className="text-sm text-slate-500">{count} review{count !== 1 ? 's' : ''}</div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl font-bold text-amber-600">{avgDisplay}</div>
                    <div className="flex items-center">
                        {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`h-4 w-4 ${i <= avgRounded ? 'text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                    </div>
                </div>

                {count === 0 ? (
                    <p className="text-sm text-slate-500">No ratings yet. Your customers will see this after they rate you.</p>
                ) : (
                    <div className="space-y-3 max-h-64 overflow-auto pr-2">
                        {recent.map(r => (
                            <div key={r._id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-slate-800">{r.user?.name || r.user?.email || 'Customer'}</div>
                                    <div className="text-xs text-slate-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} className={`h-4 w-4 ${i <= (r.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                {r.comment && <p className="mt-2 text-sm text-slate-700 truncate">{r.comment}</p>}
                            </div>
                        ))}

                        {count > recent.length && (
                            <div className="text-xs text-slate-500 mt-2">Showing {recent.length} of {count} reviews</div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const BookingCard = ({
        title, booking, icon: Icon, color = 'blue', showActions = false,
        isUpdating, updateError, updateStatus, getNextStatusFn, updateStatusId
    }) => {
        if (!booking) {
            return (
                <div className={`bg-white p-6 rounded-2xl shadow-xl border-t-4 border-${color}-500 transition-shadow duration-300 hover:shadow-2xl h-full`}>
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center">
                            <Icon className={`h-6 w-6 mr-3 text-${color}-500`} />
                            {title}
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-800">None</span>
                    </div>
                    <p className="text-slate-500 italic">No {title.toLowerCase()} scheduled at this time. Enjoy your break!</p>
                </div>
            );
        }

        const derivedStatus = getDerivedStatus(booking);
        const config = getStatusConfig(derivedStatus);
        const handleDirections = () => {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`, '_blank');
        };

        const distance = currentLocation && booking.lat && booking.lng
            ? haversineDistance(currentLocation.lat, currentLocation.lng, booking.lat, booking.lng).toFixed(1)
            : null;

        const nextStatuses = getNextStatusFn(booking);
        const isCurrentBookingUpdating = isUpdating && updateStatusId === booking.id;

        return (
            <div className={`bg-white p-6 rounded-2xl shadow-xl border-t-4 border-${config.color}-500 transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col`}>
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <Icon className={`h-6 w-6 mr-3 text-${config.color}-500`} />
                        {title}
                    </h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${config.bg} text-${config.text}`}>
                        {derivedStatus}
                    </span>
                </div>

                <div className="space-y-3 text-slate-700 flex-grow">
                    <p className="flex items-center text-lg font-semibold">
                        <Clock className="h-4 w-4 mr-2 text-slate-500" />
                        {booking.time} on {booking.date}
                    </p>
                    <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500 flex-shrink-0" />
                        Location: {booking.address}
                        {distance && <span className="ml-2 text-sm font-medium text-blue-600">({distance} km away)</span>}
                    </p>
                    <p className="flex items-start">
                        <Briefcase className="h-4 w-4 mr-2 mt-1 text-slate-500 flex-shrink-0" />
                        Client: {booking.client}
                    </p>
                    <p className="flex items-start">
                        <ListTodo className="h-4 w-4 mr-2 mt-1 text-slate-500 flex-shrink-0" />
                        Notes: {booking.notes || 'No notes provided.'}
                    </p>
                </div>

                {showActions && (
                    <div className="mt-6 space-y-3 pt-4 border-t border-slate-200">
                        <button
                            onClick={handleDirections}
                            className={`w-full py-2 rounded-xl text-white font-medium bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center justify-center`}
                        >
                            <ArrowLeft className="h-4 w-4 rotate-180 mr-2" /> Navigate
                        </button>

                        {isCurrentBookingUpdating ? (
                            <div className="flex items-center justify-center py-2 text-blue-600 font-medium bg-blue-50 rounded-xl">
                                <MicroSpinner color="text-blue-600" />
                                <span className="ml-1">Updating Status...</span>
                            </div>
                        ) : nextStatuses.length > 0 ? (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Next Action:</label>
                                {nextStatuses.map(status => (
                                    <button
                                        key={status.value}
                                        onClick={() => updateStatus(booking.id, status.value)}
                                        className={`w-full py-3 rounded-xl text-white font-medium bg-green-600 hover:bg-green-700 shadow-md transition-colors flex items-center justify-center`}
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        ) : booking.status === 'Upcoming' && getTimestamp(booking) > now ? (
                            <p className="text-sm text-yellow-700 font-medium flex items-center p-2 bg-yellow-50 rounded-xl">
                                <Clock className="h-4 w-4 mr-1 text-yellow-500" /> Starts at {booking.time} on {booking.date}
                            </p>
                        ) : (
                            <p className="text-sm text-green-700 font-medium flex items-center p-2 bg-green-50 rounded-xl">
                                <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Job status is **{derivedStatus}**.
                            </p>
                        )}

                        {/* Error message display */}
                        {updateError && updateStatusId === booking.id && (
                            <p className="text-sm text-red-600 mt-2 flex items-center p-2 bg-red-50 rounded-xl">
                                <AlertCircle className="h-4 w-4 mr-1" /> Error: {updateError}
                            </p>
                        )}

                        {/* Notification Confirmation for Arrival */}
                        {notificationSent && derivedStatus === 'Arrived' && (
                            <p className="text-sm text-blue-600 mt-2 flex items-center p-2 bg-blue-50 rounded-xl">
                                <CheckCircle className="h-4 w-4 mr-1 text-blue-500" /> Coordinator notified of your arrival!
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">

            {/* Cook Schedule & Bookings - Main Content (Left, Wider) */}
            <div className="lg:w-3/4 space-y-8">
                <h2 className="text-3xl font-extrabold text-slate-800">Cook Portal: My Daily Schedule</h2>

                {/* Current Location/Map & Current Booking - New Two-Column Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <CurrentLocationMapCard />
                    <BookingCard
                        title="Current Job"
                        booking={currentBooking}
                        icon={Briefcase}
                        color="orange"
                        showActions={true}
                        isUpdating={isUpdating}
                        updateError={updateError}
                        updateStatus={updateStatus}
                        getNextStatusFn={getNextStatus}
                        updateStatusId={updateStatusId}
                    />
                </div>

                {/* Full Schedule List */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <ListTodo className="h-5 w-5 mr-3 text-slate-500" />
                        Full Schedule History
                    </h3>
                    {nextBooking && (
                         <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 flex items-center">
                                <Calendar className="h-4 w-4 mr-2" /> Next Job: {nextBooking.client} on {nextBooking.date} @ {nextBooking.time}
                            </h4>
                            <p className="text-sm text-blue-700 mt-1 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" /> Location: {nextBooking.address}
                            </p>
                         </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date/Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {sortedBookings.map((booking) => {
                                    const derivedStatus = getDerivedStatus(booking);
                                    const config = getStatusConfig(derivedStatus);
                                    const isCurrentDeleting = isDeleting && deleteStatusId === booking.id;
                                    const canDelete = getTimestamp(booking) > now && booking.status === 'Upcoming'; // Only allow delete for future Upcoming
                                    return (
                                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {booking.date} @ {booking.time}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{booking.client}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{booking.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${config.bg} text-${config.text}`}
                                                >
                                                    {derivedStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {derivedStatus === 'Completed' ? (
                                                    <Rating
                                                        value={booking.rating || 0}
                                                        onChange={(r) => updateRating(booking.id, r)}
                                                        className="justify-start"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {canDelete ? (
                                                    <>
                                                        {isCurrentDeleting ? (
                                                            <div className="flex items-center text-red-600">
                                                                <MicroSpinner color="text-red-600" />
                                                                <span>Deleting...</span>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => deleteBooking(booking.id)}
                                                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                                                title="Delete and notify coordinator for reassignment"
                                                            >
                                                                Delete & Notify
                                                            </button>
                                                        )}
                                                        {deleteError && deleteStatusId === booking.id && (
                                                            <p className="text-xs text-red-600 mt-1">{deleteError}</p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Cook Profile & Quick Stats - Right Column (Standard) - NOW STICKY */}
            <div className="lg:w-1/4 p-0 space-y-6 sticky top-8 h-fit self-start">
                <ProfileCard user={user} handleLogout={handleLogout} themeColor="emerald" />
                <QuickStatsCard user={user} localBookings={localBookings} />
                <RecentRatingsCard ratings={ratings} />
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App = ({ logout }) => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [cooks, setCooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('authToken');

    // Simple placeholder logout function
    const handleLogout = () => {
        console.log("User logging out.");
        localStorage.removeItem('authToken');
        // In a real app, redirect to login
        if (typeof logout === 'function') {
            logout();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('No authentication token found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                let fetchedUser = null;

                // Fetch user profile from the cooks database endpoint to get complete real data
                try {
                    const userResp = await fetch(`${API_BASE_URL}/cooks/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (userResp.ok) {
                        const userData = await userResp.json();
                        fetchedUser = {
                            _id: userData._id || userData.id,
                            name: userData.name || userData.username || userData.email || 'Cook User',
                            email: userData.email || null,
                            role: userData.role || 'cook',
                            phone: userData.phone || null,
                            location: userData.location || null,
                        };
                    } else {
                        console.warn('Could not fetch cook profile from server, status:', userResp.status);
                    }
                } catch (userErr) {
                    console.warn('Error fetching cook profile from API:', userErr);
                }

                // If API fetch failed, fallback to token decode
                if (!fetchedUser) {
                    try {
                        const parts = token.split('.');
                        if (parts.length >= 2) {
                            const payload = JSON.parse(atob(parts[1]));
                            fetchedUser = {
                                name: payload.name || payload.username || payload.email || 'Cook User',
                                email: payload.email || null,
                                role: payload.role || 'cook',
                                phone: payload.phone || null,
                                location: payload.location || null,
                            };
                        }
                    } catch (decodeErr) {
                        console.warn('Unable to decode token payload for user fallback:', decodeErr);
                        // No default hardcoded user - let it fail to prompt login if no data
                        throw new Error('Unable to retrieve user data from token or database.');
                    }
                }

                // Set the fetched user
                setUser(fetchedUser);

                // Fetch bookings assigned to this cook from backend
                try {
                    const resp = await fetch(`${API_BASE_URL}/cooks/bookings`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        // Support multiple response shapes: array | { bookings: [...] } | { data: [...] }
                        const bookingsData = Array.isArray(data) ? data : (data.bookings || data.data || []);
                        setBookings(bookingsData);
                    } else {
                        console.warn('Could not fetch bookings, server returned', resp.status);
                        setBookings([]); // Ensure bookings is always set
                    }
                } catch (err) {
                    console.error('Error fetching bookings from API:', err);
                    setBookings([]); // Fallback to empty array
                }

                // Fetch recent ratings for this cook (if we have an id)
                try {
                    const cookId = fetchedUser?._id;
                    if (cookId) {
                        const r = await fetch(`${API_BASE_URL}/ratings/cook/${cookId}`);
                        if (r.ok) {
                            const arr = await r.json();
                            setRatings(Array.isArray(arr) ? arr : []);
                        } else {
                            console.warn('Could not fetch ratings for cook, status:', r.status);
                        }
                    }
                } catch (err) {
                    console.warn('Error fetching cook ratings:', err);
                }

                setLoading(false);
            } catch (err) {
                console.error('Fetch error while loading dashboard data:', err);
                setError(err.message || 'Failed to load data from database. Please check your network or login status.');
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !user) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
                <p className="text-red-600 font-semibold">Error loading dashboard: {error || 'No user data found from database. Please log in.'}</p>
                <p className="text-sm text-slate-500 mt-2">You can retry loading the dashboard or log out to return to the login screen.</p>
                <div className="mt-4 flex justify-center space-x-3">
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Retry</button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-slate-200 rounded-lg">Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Show a sticky header only for the Coordinator role */}
            {user.role === 'coordinator' && (
                <header className="bg-white shadow-md p-4 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center">
                            <BarChart3 className="h-6 w-6 text-amber-500 mr-2" />
                            Coordinator Dashboard
                        </h1>
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-slate-500 hidden sm:block">
                                Welcome, {user?.name || 'User'}!
                            </p>
                        </div>
                    </div>
                </header>
            )}

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {user.role === 'coordinator' ? (
                    <CoordinatorDashboardContent user={user} applications={applications} cooks={cooks} handleLogout={handleLogout} />
                ) : user.role === 'cook' ? (
                    <CookDashboardContent user={user} bookings={bookings} ratings={ratings} handleLogout={handleLogout} />
                ) : (
                    <div className="text-red-500 p-4 font-semibold">
                        Error: User role "{user.role}" is not supported by this dashboard. Please contact support.
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;






























// // CookDashboard.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Plus, Search, Filter, Users, User, ClipboardList, MapPin,
//   AlertCircle, CheckCircle, LogOut, Edit, Trash2, X, Save, Clock, Mail, Phone, Check, PieChart, BarChart,
//   Home, Settings, BarChart3, ChevronLeft, ArrowLeft, Calendar, Image as ImageIcon, Briefcase, ListTodo,
//   Star, TrendingUp, RefreshCw
// } from 'lucide-react';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
// } from 'chart.js';
// import { Pie, Bar } from 'react-chartjs-2';

// // API base: prefer environment variable, fall back to localhost dev API
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title
// );

// // --- SMALL REUSABLE UI PIECES --- //

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center p-8">
//     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
//   </div>
// );

// const MicroSpinner = ({ color = 'text-white' }) => (
//   <RefreshCw className={`animate-spin h-4 w-4 ${color} mr-2`} />
// );

// const ProfileCard = ({ user, handleLogout, themeColor = 'emerald' }) => (
//   <div className={`bg-white p-6 rounded-2xl shadow-xl border-t-4 border-${themeColor}-500`}>
//     <div className="flex flex-col items-center">
//       <div className={`h-24 w-24 rounded-full bg-${themeColor}-100 text-${themeColor}-500 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md`}>
//         {user?.name ? user.name[0].toUpperCase() : 'U'}
//       </div>
//       <h2 className="mt-4 text-2xl font-bold text-slate-800">{user?.name || 'Cook User'}</h2>
//       <p className="text-sm text-slate-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Cook'}</p>
//     </div>
//     <div className="mt-6 space-y-3 border-t pt-4 border-slate-100">
//       <p className="text-sm text-slate-700 flex items-center">
//         <Mail className="h-4 w-4 mr-3 text-slate-400" />
//         {user?.email || 'N/A'}
//       </p>
//       <p className="text-sm text-slate-700 flex items-center">
//         <Phone className="h-4 w-4 mr-3 text-slate-400" />
//         {user?.phone || 'N/A'}
//       </p>
//     </div>
//     <button
//       onClick={handleLogout}
//       className={`w-full mt-6 py-2 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center`}
//     >
//       <LogOut className="h-4 w-4 mr-2" />
//       Logout
//     </button>
//   </div>
// );

// // --- HELPERS --- //

// const parseTimestamp = (dateStr = '', timeStr = '') => {
//   // Creates a JS timestamp (ms) from 'YYYY-MM-DD' and 'HH:MM' (or other shapes).
//   try {
//     // If booking stores datetime in ISO or combined string, Date can parse it.
//     if (!dateStr && timeStr) {
//       const ts = Date.parse(timeStr);
//       return isNaN(ts) ? Date.now() : ts;
//     }
//     if (dateStr && timeStr) {
//       const combined = `${dateStr} ${timeStr}`;
//       const ts = Date.parse(combined);
//       if (!isNaN(ts)) return ts;
//       // Fallback: attempt replacing '-' with '/'
//       const ts2 = Date.parse(combined.replace(/-/g, '/'));
//       return isNaN(ts2) ? Date.now() : ts2;
//     }
//     if (dateStr) {
//       const ts = Date.parse(dateStr);
//       return isNaN(ts) ? Date.now() : ts;
//     }
//     return Date.now();
//   } catch {
//     return Date.now();
//   }
// };

// const safeNumber = (v) => (typeof v === 'number' ? v : parseFloat(v) || 0);

// // --- COOK DASHBOARD CONTENT --- //

// const CookDashboardContent = ({ user, initialBookings = [], handleLogout }) => {
//   const [bookings, setBookings] = useState(Array.isArray(initialBookings) ? initialBookings : []);
//   const [loadingBookings, setLoadingBookings] = useState(true);
//   const [errorBookings, setErrorBookings] = useState(null);

//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [notificationSent, setNotificationSent] = useState(false);

//   // state to indicate booking id currently being updated/deleted
//   const [updatingId, setUpdatingId] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);
//   const [actionError, setActionError] = useState(null);

//   const token = localStorage.getItem('authToken');

//   // Fetch bookings (initial + periodic refresh)
//   const fetchBookings = async () => {
//     setLoadingBookings(true);
//     setErrorBookings(null);
//     try {
//       const resp = await fetch(`${API_BASE_URL}/cooks/bookings`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : '',
//           'Content-Type': 'application/json',
//         },
//       });
//       if (resp.ok) {
//         const data = await resp.json();
//         const arr = Array.isArray(data) ? data : (data.bookings || data.data || []);
//         setBookings(arr);
//       } else {
//         const text = await resp.text().catch(() => '');
//         setErrorBookings(`Server returned ${resp.status}${text ? `: ${text}` : ''}`);
//         setBookings([]);
//       }
//     } catch (err) {
//       console.error('fetchBookings error', err);
//       setErrorBookings('Failed to fetch bookings. Check network or backend.');
//       setBookings([]);
//     } finally {
//       setLoadingBookings(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     const interval = setInterval(fetchBookings, 30000); // refresh every 30s
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   // Geolocation
//   useEffect(() => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (p) => setCurrentLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
//       (err) => console.warn('Geolocation error', err),
//       { enableHighAccuracy: true, maximumAge: 60_000 }
//     );
//   }, []);

//   const now = useMemo(() => Date.now(), []);

//   // Filter to upcoming bookings (user requested option 1). We'll treat bookings with timestamp >= now as upcoming.
//   const upcomingBookings = useMemo(() =>
//     bookings
//       .map(b => ({ ...b, _ts: parseTimestamp(b.date, b.time) }))
//       .filter(b => b._ts >= now)
//       .sort((a, b) => a._ts - b._ts)
//   , [bookings, now]);

//   // Completed stats etc. for right panel
//   const completedJobs = bookings.filter(b => b.status === 'Completed').length;
//   const totalRating = bookings.reduce((s, b) => s + (safeNumber(b.rating) || 0), 0);
//   const averageRating = completedJobs > 0 ? (totalRating / completedJobs).toFixed(1) : 'N/A';
//   const upcomingCount = upcomingBookings.length;

//   // STATUS flow helpers
//   const getNextStatuses = (booking) => {
//     // Define allowed transitions based on server-side expected statuses
//     const status = booking.status || 'Upcoming';
//     const ts = booking._ts || parseTimestamp(booking.date, booking.time);
//     // If booking is in future and still 'Upcoming' don't allow 'On the Way' until time arrived optionally.
//     if (status === 'Upcoming') {
//       // We'll allow "On the Way" if the cook clicks it (some systems only allow after scheduled time; keep flexible)
//       return [{ value: 'On the Way', label: 'Start Travel (On the Way)' }];
//     }
//     if (status === 'On the Way') return [{ value: 'Arrived', label: 'I have Arrived' }];
//     if (status === 'Arrived') return [{ value: 'Completed', label: 'Mark Completed' }];
//     return [];
//   };

//   const updateBookingStatus = async (bookingId, newStatus) => {
//     if (!token) {
//       setActionError('No auth token. Please login again.');
//       return;
//     }
//     setActionError(null);
//     setUpdatingId(bookingId);

//     // Try real API first
//     try {
//       const resp = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}/status`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (resp.ok) {
//         // update local state quickly
//         setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
//         if (newStatus === 'Arrived') {
//           setNotificationSent(true);
//           setTimeout(() => setNotificationSent(false), 3000);
//         }
//       } else {
//         // If server not available, try to parse error
//         const body = await resp.json().catch(() => null);
//         const msg = body?.message || `Server returned ${resp.status}`;
//         throw new Error(msg);
//       }
//     } catch (err) {
//       console.warn('updateBookingStatus failed, applying optimistic local update for demo.', err);
//       // optimistic fallback (useful during local dev)
//       setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
//       // show an error message to inform the user we couldn't persist to server
//       setActionError('Status updated locally, but failed to persist to server. Check connection or backend.');
//     } finally {
//       setUpdatingId(null);
//       // Refresh bookings (best-effort)
//       fetchBookings().catch(() => {});
//     }
//   };

//   const deleteBooking = async (bookingId) => {
//     if (!token) {
//       setActionError('No auth token. Please login again.');
//       return;
//     }
//     if (!window.confirm('Delete booking and notify coordinator to reassign?')) return;

//     setDeletingId(bookingId);
//     setActionError(null);

//     try {
//       const resp = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reason: 'Cook unavailable - delete requested by cook' }),
//       });
//       if (resp.ok) {
//         setBookings(prev => prev.filter(b => b.id !== bookingId));
//       } else {
//         const body = await resp.json().catch(() => null);
//         throw new Error(body?.message || `Server returned ${resp.status}`);
//       }
//     } catch (err) {
//       console.warn('deleteBooking failed', err);
//       setActionError('Failed to delete booking from server. Try again later.');
//       // optimistic fallback: remove locally
//       setBookings(prev => prev.filter(b => b.id !== bookingId));
//     } finally {
//       setDeletingId(null);
//       fetchBookings().catch(() => {});
//     }
//   };

//   const callCustomer = (phone) => {
//     if (!phone) {
//       alert('No phone number provided for this customer.');
//       return;
//     }
//     // open dialer
//     window.location.href = `tel:${phone}`;
//   };

//   const navigateToAddress = (booking) => {
//     // prefer lat/lng if provided, otherwise use address
//     if (booking.lat && booking.lng) {
//       window.open(`https://www.google.com/maps/dir/?api=1&destination=${booking.lat},${booking.lng}`, '_blank');
//     } else if (booking.address) {
//       window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`, '_blank');
//     } else {
//       alert('No address or coordinates available for this booking.');
//     }
//   };

//   const updateRating = async (bookingId, rating) => {
//     // optimistic update locally, then try to persist
//     setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, rating } : b));
//     if (!token) return;
//     try {
//       await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}/rating`, {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ rating }),
//       });
//     } catch (err) {
//       console.warn('updateRating failed', err);
//     }
//   };

//   // Rating control component
//   const Rating = ({ value = 0, onChange }) => (
//     <div className="flex items-center">
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           className={`h-5 w-5 cursor-pointer transition-colors ${i < value ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-400'}`}
//           onClick={() => onChange(i + 1)}
//         />
//       ))}
//     </div>
//   );

//   // UI for a single booking card (left column)
//   const BookingCard = ({ booking }) => {
//     const derivedStatus = booking.status || 'Upcoming';
//     const nextActions = getNextStatuses(booking);
//     const isUpdating = updatingId === booking.id;
//     const isDeleting = deletingId === booking.id;

//     // A small computed field showing distance (if currentLocation present)
//     const haversineDistance = (lat1, lon1, lat2, lon2) => {
//       if (!lat1 || !lon1 || !lat2 || !lon2) return null;
//       const R = 6371; // km
//       const dLat = (lat2 - lat1) * Math.PI / 180;
//       const dLon = (lon2 - lon1) * Math.PI / 180;
//       const a = Math.sin(dLat / 2) ** 2 +
//         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//         Math.sin(dLon * Math.PI / 180) ** 2;
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       return (R * c).toFixed(1);
//     };
//     const distance = currentLocation && booking.lat && booking.lng
//       ? haversineDistance(currentLocation.lat, currentLocation.lng, booking.lat, booking.lng)
//       : null;

//     return (
//       <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 flex flex-col">
//         <div className="flex items-start justify-between">
//           <div>
//             <h4 className="text-lg font-semibold text-slate-800">{booking.client || booking.customerName || 'Customer'}</h4>
//             <p className="text-sm text-slate-500">{booking.address || booking.location || 'Address not provided'}</p>
//             <p className="mt-2 text-sm text-slate-600 font-medium">
//               <Clock className="h-4 w-4 inline-block mr-2 text-slate-400" />
//               {booking.date || ''} {booking.time ? `@ ${booking.time}` : ''}
//               {distance && <span className="ml-3 text-xs text-blue-600 font-semibold">({distance} km away)</span>}
//             </p>
//           </div>

//           <div className="text-right">
//             <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">{derivedStatus}</span>
//             <div className="mt-3 text-xs text-slate-500">
//               <p>{booking.serviceType || ''}</p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 text-sm text-slate-700">
//           <p className="font-medium">Special Requests:</p>
//           <p className="mt-1 text-slate-600">{booking.notes || booking.specialRequests || 'None'}</p>
//         </div>

//         <div className="mt-4 flex gap-2 flex-wrap">
//           <button
//             onClick={() => callCustomer(booking.phone || booking.clientPhone || booking.customerPhone)}
//             className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition"
//           >
//             <Phone className="h-4 w-4" /> Call Customer
//           </button>

//           <button
//             onClick={() => navigateToAddress(booking)}
//             className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
//           >
//             <MapPin className="h-4 w-4" /> Navigate
//           </button>

//           {isUpdating ? (
//             <div className="flex items-center px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium">
//               <MicroSpinner color="text-blue-600" /> Updating...
//             </div>
//           ) : nextActions.length > 0 ? (
//             nextActions.map(act => (
//               <button
//                 key={act.value}
//                 onClick={() => updateBookingStatus(booking.id, act.value)}
//                 className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
//               >
//                 <Check className="h-4 w-4" /> {act.label}
//               </button>
//             ))
//           ) : (
//             <div className="px-3 py-2 rounded-xl bg-slate-50 text-slate-500 text-sm">No actions</div>
//           )}

//           {isDeleting ? (
//             <div className="flex items-center px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
//               <MicroSpinner color="text-red-600" /> Deleting...
//             </div>
//           ) : (
//             <button
//               onClick={() => deleteBooking(booking.id)}
//               className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
//             >
//               <Trash2 className="h-4 w-4" /> Delete
//             </button>
//           )}
//         </div>

//         <div className="mt-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="text-sm text-slate-500">Rating:</div>
//             <div>
//               {derivedStatus === 'Completed' ? (
//                 <Rating value={booking.rating || 0} onChange={(r) => updateRating(booking.id, r)} />
//               ) : (
//                 <span className="text-xs text-slate-400 italic">Available after completion</span>
//               )}
//             </div>
//           </div>

//           <div className="text-xs text-red-600">{actionError && <span>{actionError}</span>}</div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-6">
//       {/* Main Column: All booking cards */}
//       <div className="lg:w-3/4 space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-extrabold text-slate-800">My Upcoming Visits</h2>
//             <p className="text-sm text-slate-500 mt-1">All upcoming bookings assigned to you (from database)</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={fetchBookings}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl shadow hover:bg-amber-600 transition"
//             >
//               <RefreshCw className="h-4 w-4" /> Refresh
//             </button>
//             <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 rounded-xl text-slate-700">Logout</button>
//           </div>
//         </div>

//         {loadingBookings ? <LoadingSpinner /> : null}
//         {errorBookings ? (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">{errorBookings}</div>
//         ) : null}

//         {/* Cards Grid: show upcoming bookings as cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {upcomingBookings.length === 0 && !loadingBookings ? (
//             <div className="bg-white p-6 rounded-2xl shadow-md text-center col-span-full">
//               <h3 className="text-lg font-semibold text-slate-800">No upcoming bookings</h3>
//               <p className="text-sm text-slate-500 mt-2">You have no upcoming visits right now. Check back later or refresh.</p>
//             </div>
//           ) : upcomingBookings.map(b => (
//             <BookingCard booking={b} key={b.id} />
//           ))}
//         </div>
//       </div>

//       {/* Right Column: Profile + stats */}
//       <div className="lg:w-1/4 p-0 space-y-6 sticky top-8 h-fit self-start">
//         <ProfileCard user={user} handleLogout={handleLogout} themeColor="emerald" />

//         <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-indigo-500">
//           <h3 className="text-xl font-bold text-slate-800 flex items-center">
//             <MapPin className="h-6 w-6 mr-3 text-indigo-500" />
//             My Live Location
//           </h3>
//           <div className="mt-4 bg-slate-100 rounded-lg p-4 text-center">
//             {currentLocation ? (
//               <>
//                 <p className="text-sm text-slate-600">Lat: <span className="font-medium">{currentLocation.lat.toFixed(6)}</span></p>
//                 <p className="text-sm text-slate-600">Lng: <span className="font-medium">{currentLocation.lng.toFixed(6)}</span></p>
//                 <button
//                   onClick={() => window.open(`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`, '_blank')}
//                   className="mt-3 w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
//                 >
//                   Open in Google Maps
//                 </button>
//               </>
//             ) : (
//               <p className="text-sm text-slate-500 italic">Enable location permissions to show your live coordinates.</p>
//             )}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-500">
//           <h3 className="text-xl font-bold text-slate-800 flex items-center">
//             <TrendingUp className="h-6 w-6 mr-3 text-emerald-500" />
//             My Performance
//           </h3>
//           <div className="grid grid-cols-2 gap-3 mt-4 text-center">
//             <div className="p-3 bg-emerald-50 rounded-lg">
//               <p className="text-2xl font-bold text-emerald-600">{completedJobs}</p>
//               <p className="text-xs text-slate-500 mt-1">Jobs Completed</p>
//             </div>
//             <div className="p-3 bg-emerald-50 rounded-lg">
//               <p className="text-2xl font-bold text-emerald-600">{averageRating}</p>
//               <p className="text-xs text-slate-500 mt-1">Avg. Rating</p>
//             </div>
//             <div className="p-3 bg-blue-50 rounded-lg col-span-2">
//               <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
//               <p className="text-xs text-slate-500 mt-1">Upcoming Jobs</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- APP (MAIN) --- //

// const App = ({ logout }) => {
//   const [user, setUser] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem('authToken');

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     if (typeof logout === 'function') logout();
//     else window.location.reload();
//   };

//   useEffect(() => {
//     const fetchStartData = async () => {
//       setLoading(true);
//       setError(null);

//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Try fetching user profile
//         let fetchedUser = null;
//         try {
//           const userResp = await fetch(`${API_BASE_URL}/cooks/me`, {
//             headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//           });
//           if (userResp.ok) {
//             const ud = await userResp.json();
//             fetchedUser = {
//               name: ud.name || ud.username || ud.email || 'Cook',
//               email: ud.email || null,
//               role: ud.role || 'cook',
//               phone: ud.phone || null,
//               location: ud.location || null,
//             };
//           }
//         } catch (err) {
//           console.warn('Failed to fetch cook profile', err);
//         }

//         // Fallback decode token
//         if (!fetchedUser) {
//           try {
//             const parts = token.split('.');
//             if (parts.length >= 2) {
//               const payload = JSON.parse(atob(parts[1]));
//               fetchedUser = {
//                 name: payload.name || payload.username || payload.email || 'Cook',
//                 email: payload.email || null,
//                 role: payload.role || 'cook',
//                 phone: payload.phone || null,
//                 location: payload.location || null,
//               };
//             }
//           } catch (err) {
//             console.warn('Token decode failed', err);
//           }
//         }

//         setUser(fetchedUser || { name: 'Cook', role: 'cook' });

//         // fetch bookings
//         try {
//           const resp = await fetch(`${API_BASE_URL}/cooks/bookings`, {
//             headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//           });
//           if (resp.ok) {
//             const d = await resp.json();
//             const arr = Array.isArray(d) ? d : (d.bookings || d.data || []);
//             setBookings(arr);
//           } else {
//             console.warn('Bookings fetch returned', resp.status);
//             setBookings([]);
//           }
//         } catch (err) {
//           console.error('Error fetching bookings', err);
//           setBookings([]);
//         }

//       } catch (err) {
//         setError('Failed loading dashboard: ' + (err.message || 'Unknown error'));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStartData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   if (loading) return <LoadingSpinner />;

//   if (error || !user) {
//     return (
//       <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
//         <p className="text-red-600 font-semibold">Error loading dashboard: {error || 'No user data found.'}</p>
//         <div className="mt-4 flex justify-center space-x-3">
//           <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Retry</button>
//           <button onClick={handleLogout} className="px-4 py-2 bg-slate-200 rounded-lg">Logout</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         <CookDashboardContent user={user} initialBookings={bookings} handleLogout={handleLogout} />
//       </div>
//     </div>
//   );
// };

// export default App;













// 19-11-2025
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Plus, Search, Filter, Users, User, ClipboardList, MapPin,
//   AlertCircle, CheckCircle, LogOut, Edit, Trash2, X, Save, Clock, Mail, Phone, Check, PieChart, BarChart,
//   Home, Settings, BarChart3, ChevronLeft, ArrowLeft, Calendar, Image as ImageIcon, Briefcase, ListTodo,
//   Star, TrendingUp, RefreshCw, Navigation, Bell
// } from 'lucide-react';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
// } from 'chart.js';
// import { Pie, Bar } from 'react-chartjs-2';

// // --- CONFIGURATION ---
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// // --- HELPER COMPONENTS ---

// // 1. Toast Notification System
// const Toast = ({ message, type, onClose }) => {
//     useEffect(() => {
//         const timer = setTimeout(onClose, 3000);
//         return () => clearTimeout(timer);
//     }, [onClose]);

//     const colors = {
//         success: 'bg-emerald-500',
//         error: 'bg-red-500',
//         info: 'bg-blue-500'
//     };

//     return (
//         <div className={`fixed top-4 right-4 z-50 ${colors[type] || colors.info} text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-bounce-in`}>
//             {type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
//             {type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
//             <span className="font-medium">{message}</span>
//             <button onClick={onClose} className="ml-4 hover:bg-white/20 rounded-full p-1"><X className="h-4 w-4" /></button>
//         </div>
//     );
// };

// // 2. Loading Spinner
// const LoadingSpinner = () => (
//   <div className="flex flex-col justify-center items-center h-64 w-full">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
//     <p className="mt-4 text-slate-400 text-sm font-medium">Syncing with database...</p>
//   </div>
// );

// // 3. Status Badge
// const StatusBadge = ({ status }) => {
//     const config = {
//         'Upcoming': 'bg-blue-100 text-blue-700 border-blue-200',
//         'On the Way': 'bg-amber-100 text-amber-700 border-amber-200',
//         'Arrived': 'bg-purple-100 text-purple-700 border-purple-200',
//         'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
//         'Cancelled': 'bg-red-100 text-red-700 border-red-200',
//         'Missed': 'bg-red-50 text-red-600 border-red-100',
//     };
//     const style = config[status] || 'bg-slate-100 text-slate-600 border-slate-200';

//     return (
//         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style} shadow-sm inline-flex items-center`}>
//             {status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
//             {status === 'On the Way' && <Navigation className="w-3 h-3 mr-1" />}
//             {status?.toUpperCase() || 'UNKNOWN'}
//         </span>
//     );
// };

// // 4. Profile Card
// const ProfileCard = ({ user, handleLogout }) => (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
//         <div className="h-24 bg-gradient-to-r from-amber-500 to-orange-600"></div>
//         <div className="px-6 pb-6 relative">
//             <div className="-mt-12 mb-4 flex justify-between items-end">
//                 <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
//                     <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-600 border border-slate-200">
//                         {user.name ? user.name[0].toUpperCase() : 'U'}
//                     </div>
//                 </div>
//                 <span className="mb-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
//                     {user.role?.toUpperCase() || 'USER'}
//                 </span>
//             </div>
            
//             <h2 className="text-xl font-bold text-slate-800">{user.name || 'User Name'}</h2>
//             <p className="text-slate-500 text-sm mb-4">{user.email || 'No email provided'}</p>

//             <div className="space-y-3 border-t border-slate-100 pt-4">
//                 <div className="flex items-center text-slate-600 text-sm">
//                     <Phone className="h-4 w-4 mr-3 text-slate-400" />
//                     {user.phone || 'N/A'}
//                 </div>
//                 <div className="flex items-center text-slate-600 text-sm">
//                     <MapPin className="h-4 w-4 mr-3 text-slate-400" />
//                     {user.location || 'Location N/A'}
//                 </div>
//             </div>

//             <button
//                 onClick={handleLogout}
//                 className="w-full mt-6 py-2.5 rounded-xl text-red-600 font-medium bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center border border-red-100"
//             >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Sign Out
//             </button>
//         </div>
//     </div>
// );

// // --- COORDINATOR DASHBOARD CONTENT ---
// const CoordinatorDashboardContent = ({ user, applications, cooks, handleLogout }) => {
//     const [activeTab, setActiveTab] = useState('applications');
    
//     // Placeholders for charts
//     const pieData = {
//         labels: ['Pending', 'Assigned', 'Completed'],
//         datasets: [{ data: [5, 12, 8], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'], borderColor: '#ffffff', borderWidth: 2 }]
//     };
//     const barData = {
//         labels: ['Chef A', 'Chef B'],
//         datasets: [{ label: 'Jobs', data: [15, 22], backgroundColor: '#f97316', borderRadius: 4 }]
//     };

//     return (
//         <div className="flex flex-col lg:flex-row gap-8">
//             <div className="flex-1 space-y-6">
//                 {/* Tabs */}
//                 <div className="flex items-center space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
//                     {['applications', 'cooks', 'reports'].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
//                                 activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
//                             }`}
//                         >
//                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Content Area */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
//                     {activeTab === 'applications' && (
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left border-collapse">
//                                 <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
//                                     <tr>
//                                         <th className="px-6 py-4">Client</th>
//                                         <th className="px-6 py-4">Date</th>
//                                         <th className="px-6 py-4">Status</th>
//                                         <th className="px-6 py-4 text-right">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-100">
//                                     {applications.length > 0 ? applications.map((app) => (
//                                         <tr key={app.id} className="hover:bg-slate-50 transition-colors">
//                                             <td className="px-6 py-4 text-sm font-medium text-slate-900">{app.client}</td>
//                                             <td className="px-6 py-4 text-sm text-slate-600">{app.date}</td>
//                                             <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
//                                             <td className="px-6 py-4 text-right">
//                                                 <button className="text-amber-600 hover:underline text-sm">Manage</button>
//                                             </td>
//                                         </tr>
//                                     )) : (
//                                         <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">No applications found in database.</td></tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
                    
//                     {activeTab === 'cooks' && (
//                          <div className="overflow-x-auto">
//                             <table className="w-full text-left border-collapse">
//                                 <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
//                                     <tr>
//                                         <th className="px-6 py-4">Name</th>
//                                         <th className="px-6 py-4">Email</th>
//                                         <th className="px-6 py-4">Location</th>
//                                         <th className="px-6 py-4 text-right">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-100">
//                                     {cooks.map((cook) => (
//                                         <tr key={cook._id} className="hover:bg-slate-50">
//                                             <td className="px-6 py-4 text-sm font-medium text-slate-900">{cook.name}</td>
//                                             <td className="px-6 py-4 text-sm text-slate-600">{cook.email}</td>
//                                             <td className="px-6 py-4 text-sm text-slate-600">{cook.location}</td>
//                                             <td className="px-6 py-4 text-right">
//                                                 <button className="text-indigo-600 hover:underline text-sm">Edit</button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                          </div>
//                     )}

//                     {activeTab === 'reports' && (
//                         <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//                             <div className="h-64 flex justify-center"><Pie data={pieData} /></div>
//                             <div className="h-64 flex justify-center"><Bar data={barData} /></div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Sidebar */}
//             <div className="lg:w-80 w-full flex-shrink-0">
//                 <ProfileCard user={user} handleLogout={handleLogout} />
//             </div>
//         </div>
//     );
// };

// // --- COOK DASHBOARD CONTENT (DATABASE INTEGRATED) ---

// const CookDashboardContent = ({ user, bookings, handleLogout, onRefresh, onShowToast }) => {
//     const [currentLocation, setCurrentLocation] = useState(null);
//     const [loadingAction, setLoadingAction] = useState(null);
//     const token = localStorage.getItem('authToken');

//     // Real-time Geolocation Tracking
//     useEffect(() => {
//         let watchId;
//         if (navigator.geolocation) {
//             watchId = navigator.geolocation.watchPosition(
//                 (position) => {
//                     const newLoc = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude
//                     };
//                     setCurrentLocation(newLoc);
//                 },
//                 (error) => console.warn('Location tracking error:', error),
//                 { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
//             );
//         }
//         return () => { if(watchId) navigator.geolocation.clearWatch(watchId); };
//     }, [token]);

//     // Sort bookings
//     const sortedBookings = useMemo(() => {
//         const now = Date.now();
//         const getTimestamp = (b) => new Date(`${b.date} ${b.time}`).getTime();
        
//         const safeBookings = Array.isArray(bookings) ? bookings : [];
        
//         const future = safeBookings.filter(b => getTimestamp(b) > now && b.status !== 'Cancelled' && b.status !== 'Completed').sort((a, b) => getTimestamp(a) - getTimestamp(b));
//         const active = safeBookings.filter(b => ['On the Way', 'Arrived'].includes(b.status));
//         const past = safeBookings.filter(b => getTimestamp(b) <= now || ['Completed', 'Cancelled'].includes(b.status)).sort((a, b) => getTimestamp(b) - getTimestamp(a));
        
//         return { 
//             active: active[0] || future[0] || null, 
//             history: [...active.slice(1), ...future, ...past] 
//         };
//     }, [bookings]);

//     const currentJob = sortedBookings.active;

//     // API Action: Update Status
//     const handleStatusUpdate = async (bookingId, newStatus) => {
//         if (!token) return;
//         setLoadingAction(bookingId);

//         try {
//             const response = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}/status`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ status: newStatus }),
//             });

//             if (response.ok) {
//                 onShowToast(`Status updated to ${newStatus}`, 'success');
                
//                 // Notify coordinator if Arrived
//                 if (newStatus === 'Arrived' && currentLocation) {
//                     await fetch(`${API_BASE_URL}/cooks/notify-nearby-coordinator`, {
//                         method: 'POST',
//                         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ location: currentLocation, bookingId })
//                     });
//                 }

//                 onRefresh(); // Refresh data
//             } else {
//                 throw new Error('Server rejected update');
//             }
//         } catch (err) {
//             console.error('Error updating status:', err);
//             onShowToast('Failed to update status. Check connection.', 'error');
//         } finally {
//             setLoadingAction(null);
//         }
//     };

//     const openGoogleMaps = (address) => {
//         const query = encodeURIComponent(address);
//         window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
//     };

//     const JobCard = ({ booking, isMain = false }) => {
//         if (!booking) return (
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
//                 <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-3" />
//                 <h3 className="text-lg font-semibold text-slate-600">No active jobs</h3>
//                 <p className="text-slate-400 text-sm">You are free for the day!</p>
//             </div>
//         );

//         const isActionLoading = loadingAction === booking.id;
//         let actionButton = null;

//         if (booking.status === 'Upcoming') {
//             actionButton = (
//                 <button 
//                     onClick={() => handleStatusUpdate(booking.id, 'On the Way')}
//                     disabled={isActionLoading}
//                     className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl flex items-center justify-center transition shadow-md disabled:opacity-50"
//                 >
//                     {isActionLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : <><Navigation className="h-5 w-5 mr-2" /> Start Travel</>}
//                 </button>
//             );
//         } else if (booking.status === 'On the Way') {
//             actionButton = (
//                 <button 
//                     onClick={() => handleStatusUpdate(booking.id, 'Arrived')}
//                     disabled={isActionLoading}
//                     className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl flex items-center justify-center transition shadow-md disabled:opacity-50"
//                 >
//                     {isActionLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : <><MapPin className="h-5 w-5 mr-2" /> I Have Arrived</>}
//                 </button>
//             );
//         } else if (booking.status === 'Arrived') {
//             actionButton = (
//                 <button 
//                     onClick={() => handleStatusUpdate(booking.id, 'Completed')}
//                     disabled={isActionLoading}
//                     className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center transition shadow-md disabled:opacity-50"
//                 >
//                     {isActionLoading ? <RefreshCw className="animate-spin h-5 w-5" /> : <><CheckCircle className="h-5 w-5 mr-2" /> Mark Completed</>}
//                 </button>
//             );
//         }

//         return (
//             <div className={`bg-white rounded-2xl overflow-hidden border ${isMain ? 'border-amber-200 shadow-lg ring-4 ring-amber-50' : 'border-slate-200 shadow-sm'}`}>
//                 {isMain && (
//                     <div className="bg-amber-500 px-6 py-2 flex justify-between items-center">
//                         <span className="text-white text-xs font-bold uppercase tracking-wider">Current Job</span>
//                         <div className="flex items-center text-white/90 text-xs">
//                             <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></span>
//                             {currentLocation ? 'GPS Active' : 'Locating...'}
//                         </div>
//                     </div>
//                 )}
//                 <div className="p-6">
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <h3 className="text-xl font-bold text-slate-800">{booking.client}</h3>
//                             <p className="text-slate-500 text-sm flex items-center mt-1">
//                                 <Clock className="h-3.5 w-3.5 mr-1" /> {booking.date} at {booking.time}
//                             </p>
//                         </div>
//                         <StatusBadge status={booking.status} />
//                     </div>

//                     <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 mb-6">
//                         <div className="flex items-start">
//                             <MapPin className="h-5 w-5 text-amber-500 mt-0.5 mr-3 shrink-0" />
//                             <div>
//                                 <p className="text-sm font-semibold text-slate-700">Location</p>
//                                 <p className="text-sm text-slate-600 break-words">{booking.address}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-start">
//                             <ListTodo className="h-5 w-5 text-amber-500 mt-0.5 mr-3 shrink-0" />
//                             <div>
//                                 <p className="text-sm font-semibold text-slate-700">Notes</p>
//                                 <p className="text-sm text-slate-600 italic">{booking.notes || "No special instructions."}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         {/* Map Button */}
//                         <button 
//                             onClick={() => openGoogleMaps(booking.address)}
//                             className="col-span-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 flex items-center justify-center transition"
//                         >
//                             <Navigation className="h-4 w-4 mr-2 text-blue-500" /> Map
//                         </button>

//                         {/* Call Button - Fixed to use tel: Protocol */}
//                         {booking.phone ? (
//                             <a 
//                                 href={`tel:${booking.phone}`}
//                                 className="col-span-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 flex items-center justify-center transition no-underline cursor-pointer"
//                             >
//                                 <Phone className="h-4 w-4 mr-2 text-emerald-500" /> Call
//                             </a>
//                         ) : (
//                             <button 
//                                 onClick={() => onShowToast('No phone number provided for this client', 'error')}
//                                 className="col-span-1 py-2.5 bg-slate-50 border border-slate-200 text-slate-400 font-medium rounded-xl flex items-center justify-center cursor-not-allowed"
//                             >
//                                 <Phone className="h-4 w-4 mr-2 text-slate-300" /> Call
//                             </button>
//                         )}
//                     </div>

//                     {isMain && <div className="mt-6 border-t border-slate-100 pt-4">{actionButton}</div>}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="flex flex-col lg:flex-row gap-8 pb-12">
//             <div className="flex-1 space-y-8">
//                 {/* Active Job Section */}
//                 <section>
//                     <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
//                         <Briefcase className="h-6 w-6 mr-2 text-amber-600" />
//                         Active Job
//                     </h2>
//                     <JobCard booking={currentJob} isMain={true} />
//                 </section>

//                 {/* History / Upcoming Section */}
//                 <section>
//                     <div className="flex items-center justify-between mb-4">
//                         <h2 className="text-xl font-bold text-slate-800">Schedule & History</h2>
//                         <button onClick={onRefresh} className="text-sm text-amber-600 font-medium hover:underline flex items-center">
//                             <RefreshCw className="h-3 w-3 mr-1" /> Refresh
//                         </button>
//                     </div>
//                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
//                         {sortedBookings.history.map(job => (
//                             <div key={job.id} className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-1">
//                                         <h4 className="font-semibold text-slate-800">{job.client}</h4>
//                                         <span className="text-xs text-slate-400">• {job.date}</span>
//                                     </div>
//                                     <p className="text-sm text-slate-500 flex items-center">
//                                         <MapPin className="h-3 w-3 mr-1" /> {job.address}
//                                     </p>
//                                 </div>
//                                 <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
//                                     <StatusBadge status={job.status} />
//                                 </div>
//                             </div>
//                         ))}
//                         {sortedBookings.history.length === 0 && (
//                             <div className="p-8 text-center text-slate-400">No other jobs found.</div>
//                         )}
//                     </div>
//                 </section>
//             </div>

//             {/* Sidebar Stats */}
//             <div className="lg:w-80 w-full space-y-6">
//                  <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
//                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
//                      <h3 className="text-lg font-semibold mb-1">My Performance</h3>
                     
//                      <div className="grid grid-cols-2 gap-4 mt-6">
//                          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
//                              <p className="text-2xl font-bold">
//                                  {Array.isArray(bookings) ? bookings.filter(b => b.status === 'Completed').length : 0}
//                              </p>
//                              <p className="text-xs text-indigo-200">Jobs Done</p>
//                          </div>
//                          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
//                              <p className="text-2xl font-bold flex items-center">
//                                  4.8 <Star className="h-4 w-4 ml-1 text-yellow-400 fill-current" />
//                              </p>
//                              <p className="text-xs text-indigo-200">Avg Rating</p>
//                          </div>
//                      </div>
//                  </div>

//                  <ProfileCard user={user} handleLogout={handleLogout} />
//             </div>
//         </div>
//     );
// };

// // --- MAIN APP COMPONENT ---

// const App = ({ logout }) => {
//     const [user, setUser] = useState(null);
//     const [bookings, setBookings] = useState([]);
//     const [applications, setApplications] = useState([]); 
//     const [cooks, setCooks] = useState([]); 
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [toast, setToast] = useState(null); // Toast State Helper

//     const token = localStorage.getItem('authToken');

//     const showToast = (message, type) => setToast({ message, type });

//     // Logout Handler
//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         if (typeof logout === 'function') logout();
//         else window.location.reload();
//     };

//     // Data Fetching Logic
//     const fetchData = async () => {
//         if (!token) {
//             setError('No authentication token found.');
//             setLoading(false);
//             return;
//         }

//         try {
//             // 1. Fetch User Profile
//             let fetchedUser = null;
//             try {
//                 const userResp = await fetch(`${API_BASE_URL}/cooks/me`, {
//                     headers: { 'Authorization': `Bearer ${token}` },
//                 });
//                 if (userResp.ok) {
//                     const userData = await userResp.json();
//                     fetchedUser = {
//                         name: userData.name || userData.username || 'Cook User',
//                         email: userData.email,
//                         role: userData.role || 'cook',
//                         phone: userData.phone,
//                         location: userData.location
//                     };
//                     setUser(fetchedUser);
//                 } else {
//                     throw new Error('Failed to fetch user profile');
//                 }
//             } catch (err) {
//                 console.error(err);
//                 try {
//                     const payload = JSON.parse(atob(token.split('.')[1]));
//                     fetchedUser = { ...payload, role: payload.role || 'cook' };
//                     setUser(fetchedUser);
//                 } catch (e) { setError('Authentication failed'); }
//             }

//             if (!fetchedUser) return;

//             // 2. Role-Based Data Fetching
//             if (fetchedUser.role === 'coordinator') {
//                 const [appRes, cookRes] = await Promise.all([
//                     fetch(`${API_BASE_URL}/coordinator/applications`, { headers: { 'Authorization': `Bearer ${token}` } }),
//                     fetch(`${API_BASE_URL}/coordinator/cooks`, { headers: { 'Authorization': `Bearer ${token}` } })
//                 ]);
                
//                 if (appRes.ok) setApplications(await appRes.json());
//                 if (cookRes.ok) setCooks(await cookRes.json());

//             } else {
//                 // Fetch Cook Bookings
//                 const bookingResp = await fetch(`${API_BASE_URL}/cooks/bookings`, {
//                     headers: { 'Authorization': `Bearer ${token}` },
//                 });
//                 if (bookingResp.ok) {
//                     const data = await bookingResp.json();
//                     setBookings(Array.isArray(data) ? data : (data.bookings || []));
//                 }
//             }
//         } catch (err) {
//             console.error('Dashboard load error:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//         const interval = setInterval(fetchData, 30000);
//         return () => clearInterval(interval);
//     }, [token]);

//     if (loading) return <LoadingSpinner />;

//     if (error || !user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
//                 <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
//                     <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                         <AlertCircle className="h-8 w-8 text-red-600" />
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h2>
//                     <p className="text-slate-500 mb-6">{error || 'Unable to load your profile. Please log in again.'}</p>
//                     <button onClick={handleLogout} className="w-full py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
//                         Return to Login
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
//             {/* Header */}
//             <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-slate-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
//                     <div className="flex items-center">
//                         <div className="bg-amber-500 p-2 rounded-lg mr-3">
//                             <Briefcase className="h-6 w-6 text-white" />
//                         </div>
//                         <span className="text-xl font-extrabold text-slate-800 tracking-tight">ChefConnect</span>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition relative">
//                             <Bell className="h-5 w-5" />
//                             <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
//                         </button>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {user.role === 'coordinator' ? (
//                     <CoordinatorDashboardContent 
//                         user={user} 
//                         applications={applications} 
//                         cooks={cooks} 
//                         handleLogout={handleLogout} 
//                     />
//                 ) : (
//                     <CookDashboardContent 
//                         user={user} 
//                         bookings={bookings} 
//                         handleLogout={handleLogout}
//                         onRefresh={fetchData}
//                         onShowToast={showToast}
//                     />
//                 )}
//             </main>

//             {/* Toast Container */}
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//         </div>
//     );
// };

// export default App;