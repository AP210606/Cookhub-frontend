// Updated LocationCoordinator.jsx with applications tab matched to admin bookings
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Filter, Users, ClipboardList, MapPin,
  AlertCircle, CheckCircle, LogOut, Edit, Trash2, X, Save, Clock, Mail, Phone, Check, PieChart, BarChart,
  Settings, BarChart3, ArrowLeft, Calendar
} from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// const states = ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'];

// const hierarchy = {
//   Gujarat: {
//     cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
//     areas: {
//       Ahmedabad: ['Navrangpura', 'Satellite', 'Maninagar', 'Vastrapur'],
//       Surat: ['Adajan', 'Athwalines', 'Vesu', 'Udhna'],
//       Vadodara: ['Alkapuri', 'Fatehgunj', 'Akota', 'Manjalpur'],
//       Rajkot: ['Rajkot City', 'Kote Chowk', 'Yagnik Road', 'Kalawad Road']
//     }
//   }
//   // Add more hierarchies as needed
// };

/**
 * A utility function to get a status color for Tailwind CSS.
 * @param {string} status The status string (e.g., 'approved', 'rejected', 'pending').
 * @returns {string} The corresponding Tailwind CSS class.
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'demo_scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * ApplicationTable component displays a table of cook applications with pagination.
 * @param {object} props The component props.
 * @param {Array<object>} props.applications An array of application objects.
 * @param {Function} props.onAction The function to call when an action button is clicked.
 */
const ApplicationTable = ({ applications, onAction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = useMemo(() => 
    applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), 
    [applications, currentPage]
  );

  if (applications.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border border-slate-200 p-12 text-center">
        <Clock className="h-16 w-16 text-slate-400 mx-auto mb-6 animate-pulse" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No Applications Yet</h3>
        <p className="text-slate-500">Keep an eye out – great cooks are on their way!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedApplications.map((application, index) => (
                <tr key={application._id} className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-amber-50 transition-colors duration-200`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{application.applicantName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex items-center space-x-3 mb-1">
                      <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{application.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-700">{application.experience} years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 capitalize">{application.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {application.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => onAction(application._id, 'approved')}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-all duration-200 transform hover:scale-105"
                          title="Approve application"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => onAction(application._id, 'rejected')}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-all duration-200 transform hover:scale-105"
                          title="Reject application"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                    {application.status !== 'pending' && (
                      <span className="text-slate-400 text-xs italic">Actions complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'} rounded`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </>
  );
};

/**
 * CookTable component displays a table of cooks with pagination.
 * @param {object} props The component props.
 * @param {Array<object>} props.cooks An array of cook objects.
 * @param {Function} props.onEdit The function to call when the edit button is clicked.
 * @param {Function} props.onDelete The function to call when the delete button is clicked.
 */
const CookTable = ({ cooks, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(cooks.length / itemsPerPage);
  const paginatedCooks = useMemo(() => 
    cooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), 
    [cooks, currentPage]
  );

  return (
    <>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-slate-200">
        <table className="min-w-full bg-white divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Specialties</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Service Areas</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedCooks.map((cook, index) => (
              <tr key={cook._id} className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-amber-50 transition-colors duration-200`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{cook.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{cook.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{cook.phone}</td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {(cook.specialties || []).map((spec, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{(cook.serviceAreas || []).join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    cook.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cook.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(cook)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Edit cook"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cook._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Delete cook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'} rounded`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </>
  );
};

/**
 * CookForm component displays a form for adding or editing a cook.
 * @param {object} props The component props.
 * @param {object | null} props.cook The cook object to edit, or null for a new cook.
 * @param {Function} props.onSave The function to call when the form is submitted.
 * @param {Function} props.onCancel The function to call when the form is canceled.
 * @param {boolean} props.isOpen A boolean to control the form's visibility.
 */
const CookForm = ({ cook, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    experience: 0,
    specialties: '',
    serviceAreas: '',
    email: '',
    phone: '',
    password: '',
    isAvailable: 'true',
    rating: 5,
    location: 'India',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cook) {
      setFormData({
        name: cook.name || '',
        experience: cook.experience || 0,
        specialties: (cook.specialties || []).join(', ') || '',
        serviceAreas: (cook.serviceAreas || []).join(', ') || '',
        email: cook.email || '',
        phone: cook.phone || '',
        password: '',
        isAvailable: cook.isAvailable ? 'true' : 'false',
        rating: cook.rating || 5,
        location: cook.location || 'India',
      });
    } else {
      setFormData({
        name: '',
        experience: 0,
        specialties: '',
        serviceAreas: '',
        email: '',
        phone: '',
        password: '',
        isAvailable: 'true',
        rating: 5,
        location: 'India',
      });
    }
    setErrors({});
  }, [cook, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    // Password required for new cook (when creating), optional when editing
    if (!cook && !formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length > 0 && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const cookData = {
        ...(cook ? { _id: cook._id } : {}),
        name: formData.name,
        experience: formData.experience,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        serviceAreas: formData.serviceAreas.split(',').map(s => s.trim()).filter(s => s),
        email: formData.email,
        phone: formData.phone,
        ...(formData.password ? { password: formData.password } : {}),
        isAvailable: formData.isAvailable === 'true',
        rating: parseFloat(formData.rating),
        location: formData.location,
      };
      onSave(cookData);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onCancel} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{cook ? 'Edit Chef Profile' : 'Add New Chef'}</h3>
          <p className="text-sm text-slate-500 mt-1">{cook ? 'Update details below' : 'Let\'s get cooking!'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              placeholder="Enter chef's name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> {errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all"
                placeholder="chef@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                }`}
                placeholder="+91 12345 67890"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> {errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              placeholder="Enter password (min 6 chars)"
              minLength={6}
              required={!cook}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> {errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="specialties" className="block text-sm font-semibold text-slate-700">Specialties (comma-separated)</label>
            <input
              type="text"
              id="specialties"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all"
              placeholder="e.g., Italian, Vegan, Desserts"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="serviceAreas" className="block text-sm font-semibold text-slate-700">Service Areas (comma-separated)</label>
            <input
              type="text"
              id="serviceAreas"
              name="serviceAreas"
              value={formData.serviceAreas}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all"
              placeholder="e.g., Mumbai, Pune, Thane"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="isAvailable" className="block text-sm font-semibold text-slate-700">Availability Status</label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={formData.isAvailable}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all bg-white"
            >
              <option value="true">Ready to Cook! 🔥</option>
              <option value="false">Booked Out</option>
            </select>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="h-4 w-4" />
              {cook ? 'Update Chef' : 'Add Chef'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * BookingsTable component displays a table of bookings for a specific status with pagination.
 * @param {object} props The component props.
 * @param {Array<object>} props.bookingsData An array of booking objects with populated user data.
 * @param {string} props.status The booking status.
 * @param {Function} props.onStatusChange The function to call when status changes.
 * @param {Function} props.onAssignCook The function to call when assigning a cook.
 * @param {Function} props.onViewDetails The function to call when viewing details.
 */
const BookingsTable = ({ bookingsData, status, onStatusChange, onAssignCook, onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(bookingsData.length / itemsPerPage);
  const paginatedBookings = useMemo(() => 
    bookingsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), 
    [bookingsData, currentPage]
  );

  if (bookingsData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border border-slate-200 p-12 text-center">
        <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-6 animate-pulse" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No {status} Bookings</h3>
        <p className="text-slate-500">Bookings will appear here as users request services.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedBookings.map((booking, index) => (
                <tr key={booking._id} className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-amber-50 transition-colors duration-200`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.userName || booking.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex items-center space-x-3 mb-1">
                      <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{booking.userEmail || booking.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span>{booking.phone || booking.user?.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{booking.planDuration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-700">₹{booking.totalAmount?.toLocaleString('en-IN') || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {booking.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => onStatusChange(booking._id, e.target.value)}
                      className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 text-xs bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="demo_scheduled">Demo Scheduled</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onAssignCook(booking)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all duration-200 transform hover:scale-105"
                        title="Assign Cook"
                        disabled={booking.assignedCook?._id}
                      >
                        {booking.assignedCook?._id ? 'Assigned' : 'Assign Cook'}
                      </button>
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                        title="View Details"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 ${page === currentPage ? 'bg-blue-700 text-white' : 'bg-gray-200'} rounded`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </>
  );
};

// The rest of the code remains the same, including the main LocationCoordinator component and other definitions.
// Replace the original table components with these paginated versions in the file.
// Note: The truncated part of the code (API calls, state management, etc.) is assumed to remain unchanged.

  /**
   * AssignCookModal component for assigning a cook to a booking.
   * @param {object} props The component props.
   */
  const AssignCookModal = ({ booking, cooks, onAssign, onClose, assignStatus }) => {
    const [assignCookId, setAssignCookId] = useState('');
    const [serviceStartTime, setServiceStartTime] = useState('');
    const [serviceEndTime, setServiceEndTime] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!assignCookId) {
        return;
      }
      onAssign(booking._id, assignCookId, serviceStartTime, serviceEndTime);
    };

    if (!booking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Assign Cook to Booking</h3>
            <p className="text-sm text-slate-500 mt-1">Booking ID: {booking._id}</p>
            <p className="text-sm text-slate-500">User: {booking.userName || booking.user?.name || 'N/A'}</p>
          </div>
          {assignStatus && (
            <div className={`p-3 rounded-xl mb-4 text-center font-medium text-sm ${
              assignStatus.includes('successfully') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {assignStatus}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Select Available Cook</label>
              <select
                value={assignCookId}
                onChange={(e) => setAssignCookId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-slate-300 transition-all bg-white"
                required
              >
                <option value="">Choose a cook...</option>
                {cooks.filter(c => c.isAvailable).map(cook => (
                  <option key={cook._id} value={cook._id}>{cook.name} ({cook.specialties.join(', ')})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Service Start Time</label>
                <input
                  type="datetime-local"
                  value={serviceStartTime}
                  onChange={(e) => setServiceStartTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-slate-300 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Service End Time</label>
                <input
                  type="datetime-local"
                  value={serviceEndTime}
                  onChange={(e) => setServiceEndTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-slate-300 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={!assignCookId}
              >
                <Check className="h-4 w-4" />
                Assign Cook
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  /**
   * BookingDetailsModal component for viewing booking details.
   * @param {object} props The component props.
   */
  const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const renderDetailFields = (item) => {
      return Object.entries(item).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value, null, 2);
        }
        return (
          <div key={key} className="mb-3 p-3 bg-slate-50 rounded-lg">
            <strong className="text-slate-700 block text-sm uppercase tracking-wide">{key}:</strong> 
            <span className="text-slate-900 block mt-1 text-sm">{value}</span>
          </div>
        );
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Booking Details</h3>
            <p className="text-sm text-slate-500 mt-1">ID: {booking._id}</p>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {renderDetailFields(booking)}
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all duration-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Analytics components with Chart.js
   */
  const ApplicationStatusPie = ({ applications }) => {
    const statusCounts = useMemo(() => {
      const counts = { pending: 0, approved: 0, rejected: 0 };
      applications.forEach(app => counts[app.status]++ || counts.pending++);
      return counts;
    }, [applications]);

    const data = {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [
        {
          label: 'Applications',
          data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)', // amber
            'rgba(34, 197, 94, 0.8)', // emerald
            'rgba(239, 68, 68, 0.8)', // red
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed}%`,
          },
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          console.log(`Clicked on ${data.labels[index]}`);
        }
      },
    };

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center"><PieChart className="h-5 w-5 mr-2 text-amber-600" /> Applications by Status</h3>
        <Pie data={data} options={options} />
      </div>
    );
  };

  const CooksByExperienceBar = ({ cooks }) => {
    const experienceGroups = useMemo(() => {
      const groups = { '0-2': 0, '3-5': 0, '6-10': 0, '10+': 0 };
      cooks.forEach(cook => {
        const exp = cook.experience || 0;
        if (exp <= 2) groups['0-2']++;
        else if (exp <= 5) groups['3-5']++;
        else if (exp <= 10) groups['6-10']++;
        else groups['10+']++;
      });
      return groups;
    }, [cooks]);

    const data = {
      labels: ['0-2 years', '3-5 years', '6-10 years', '10+ years'],
      datasets: [
        {
          label: 'Number of Cooks',
          data: [experienceGroups['0-2'], experienceGroups['3-5'], experienceGroups['6-10'], experienceGroups['10+']],
          backgroundColor: 'rgba(251, 191, 36, 0.8)', // amber
          borderColor: 'rgba(251, 191, 36, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Cooks by Experience Level',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          console.log(`Clicked on ${data.labels[index]}`);
        }
      },
    };

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center"><BarChart className="h-5 w-5 mr-2 text-amber-600" /> Cooks by Experience</h3>
        <Bar data={data} options={options} />
      </div>
    );
  };

  const TopSpecialties = ({ cooks }) => {
    const topSpecialties = useMemo(() => {
      const specialtyCount = {};
      cooks.forEach(cook => {
        (cook.specialties || []).forEach(spec => {
          specialtyCount[spec] = (specialtyCount[spec] || 0) + 1;
        });
      });
      return Object.entries(specialtyCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([spec, count]) => ({ spec, count }));
    }, [cooks]);

    const data = {
      labels: topSpecialties.map(item => item.spec),
      datasets: [
        {
          label: 'Number of Cooks',
          data: topSpecialties.map(item => item.count),
          backgroundColor: Array(topSpecialties.length).fill('rgba(251, 191, 36, 0.8)'), // amber
          borderColor: Array(topSpecialties.length).fill('rgba(251, 191, 36, 1)'),
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Top Specialties',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          console.log(`Clicked on ${topSpecialties[index].spec}`);
        }
      },
    };

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Specialties</h3>
        {topSpecialties.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p className="text-center text-slate-500 py-8">No specialties data yet.</p>
        )}
      </div>
    );
  };

  /**
   * Main App component to manage the dashboard view.
   * This component handles data fetching, state management, and user interactions.
   * It renders the appropriate tables and forms based on user actions.
   */
  export default function App({ location: propLocation, token }) {
    const [activeTab, setActiveTab] = useState('cooks');
    const [cooks, setCooks] = useState([]);
    const [applications, setApplications] = useState([]); // Now used for cook applications
    const [bookings, setBookings] = useState([]); // For bookings data from admin endpoint
    const [notification, setNotification] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCook, setEditingCook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
    const [bookingsTab, setBookingsTab] = useState('pending');
    const [selectedBookingToAssign, setSelectedBookingToAssign] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [assignStatus, setAssignStatus] = useState('');
    const [locationPath, setLocationPath] = useState('');

    const effectiveLocation = useMemo(() => {
      if (locationPath.length === 3) {
        return `${locationPath[0]}, ${locationPath[1]}, ${locationPath[2]}`;
      } else if (locationPath.length === 2) {
        return `${locationPath[0]}, ${locationPath[1]}`;
      } else if (locationPath.length === 1) {
        return locationPath[0];
      }
      return 'India';
    }, [locationPath]);

    const filteredCooks = useMemo(() => {
      let filtered = cooks.filter(cook =>
        cook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cook.specialties || []).some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (availabilityFilter !== 'all') {
        filtered = filtered.filter(cook => (cook.isAvailable ? 'available' : 'unavailable') === availabilityFilter);
      }
      return filtered;
    }, [cooks, searchTerm, availabilityFilter]);

    // For applications tab, use bookings data matched from admin
    const filteredBookingsForApplications = useMemo(() => {
      let filtered = bookings;
      if (applicationStatusFilter !== 'all') {
        filtered = filtered.filter(booking => booking.status === applicationStatusFilter);
      }
      return filtered;
    }, [bookings, applicationStatusFilter]);

    const pendingBookingsForApp = useMemo(() => filteredBookingsForApplications.filter(b => b.status === 'pending'), [filteredBookingsForApplications]);
    const demoScheduledBookingsForApp = useMemo(() => filteredBookingsForApplications.filter(b => b.status === 'demo_scheduled'), [filteredBookingsForApplications]);
    const approvedBookingsForApp = useMemo(() => filteredBookingsForApplications.filter(b => b.status === 'approved'), [filteredBookingsForApplications]);
    const rejectedBookingsForApp = useMemo(() => filteredBookingsForApplications.filter(b => b.status === 'rejected'), [filteredBookingsForApplications]);

    const showNotification = (type, message) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 5000);
    };

    const headers = { 'Authorization': `Bearer ${token}` };

    useEffect(() => {
      const fetchData = async () => {
        if (!token) return;
        try {
          // Fetch cooks
          const cooksRes = await fetch(`${API_BASE_URL}/cooks?location=${effectiveLocation}`, { headers });
          const cooksData = await cooksRes.json();
          if (cooksRes.ok) {
            setCooks(cooksData);
          } else {
            throw new Error(cooksData.message || 'Failed to fetch cooks');
          }

          // Fetch cook applications
          const appsRes = await fetch(`${API_BASE_URL}/applications?location=${effectiveLocation}`, { headers });
          const appsData = await appsRes.json();
          if (appsRes.ok) {
            setApplications(appsData);
          } else {
            throw new Error(appsData.message || 'Failed to fetch applications');
          }

          // Fetch bookings from admin endpoint to match
          const bookingsRes = await fetch(`${API_BASE_URL}/admin/bookings`, { headers });
          const bookingsData = await bookingsRes.json();
          if (bookingsRes.ok) {
            setBookings(bookingsData);
          } else {
            throw new Error(bookingsData.message || 'Failed to fetch bookings');
          }

        } catch (err) {
          console.error('API Error:', err.message);
          showNotification('error', 'Failed to load data. Check console for details.');
        }
      };
      fetchData();
    }, [effectiveLocation, token]);

    // Handle saving a new or existing cook
    const handleSaveCook = async (cookData) => {
      try {
        // Client-side guard: new cooks must include a password to satisfy backend validation
        if (!cookData._id && !cookData.password) {
          showNotification('error', 'Password is required when creating a new cook.');
          return;
        }

        // Prepare payload: do not send an empty password when updating existing cook
        const payload = { ...cookData };
        if (cookData._id && (!payload.password || payload.password === '')) {
          delete payload.password;
        }
        let response;
        if (cookData._id) {
          // Update existing cook
          response = await fetch(`${API_BASE_URL}/cooks/${cookData._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // Add new cook
          response = await fetch(`${API_BASE_URL}/cooks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to save cook');
        }

        // Update local state
        if (cookData._id) {
          setCooks(cooks.map(c => c._id === data.cook?._id || c._id === data._id ? data.cook || data : c));
          showNotification('success', 'Chef updated successfully!');
        } else {
          setCooks([...cooks, data]);
          showNotification('success', 'New chef added – welcome aboard!');
        }

        setIsFormOpen(false);
        setEditingCook(null);
      } catch (err) {
        console.error('Error saving cook:', err);
        showNotification('error', err.message || 'Failed to save chef.');
      }
    };

    // Handle deleting a cook
    const handleDeleteCook = async (cookId) => {
      if (!window.confirm("Are you sure you want to remove this chef? This can't be undone.")) {
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/cooks/${cookId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete cook');
        }
        setCooks(cooks.filter(c => c._id !== cookId));
        showNotification('success', 'Chef removed successfully.');
      } catch (err) {
        console.error('Error deleting cook:', err);
        showNotification('error', err.message || 'Failed to remove chef.');
      }
    };

    // Handle application approval/rejection for cook applications
    const handleApplicationAction = async (applicationId, status) => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update application status');
        }

        setApplications(applications.map(app =>
          app._id === applicationId ? { ...app, status } : app
        ));
        if (status === 'approved') {
          // Optionally refetch cooks as new cook might be added
          const cooksRes = await fetch(`${API_BASE_URL}/cooks?location=${effectiveLocation}`, { headers });
          const cooksData = await cooksRes.json();
          if (cooksRes.ok) setCooks(cooksData);
        }
        showNotification('success', `Application ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      } catch (err) {
        console.error('Error updating application status:', err);
        showNotification('error', err.message || 'Failed to update application status.');
      }
    };

    // Handle booking status change for applications tab (matched to bookings)
    const handleBookingStatusChange = async (bookingId, newStatus) => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update booking status');
        }

        setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        showNotification('success', `Booking status updated to ${newStatus}!`);
      } catch (err) {
        console.error('Error updating booking status:', err);
        showNotification('error', err.message || 'Failed to update booking status.');
      }
    };

    // Handle assign cook to booking for applications tab
    const handleAssignCookForApp = async (bookingId, cookId, startTime, endTime) => {
      try {
  const response = await fetch(`${API_BASE_URL}/cooks/bookings/${bookingId}/assign-cook`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cookId,
            serviceStartTime: startTime,
            serviceEndTime: endTime,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to assign cook');
        }

        setBookings(bookings.map(b => b._id === bookingId ? { ...b, ...data.booking } : b));
        // Update cook availability if needed
        setCooks(cooks.map(c => c._id === cookId ? { ...c, isAvailable: false } : c));
        setAssignStatus('Cook assigned successfully!');
        setTimeout(() => {
          setAssignStatus('');
          setSelectedBookingToAssign(null);
        }, 3000);
        showNotification('success', 'Cook assigned to booking!');
      } catch (err) {
        console.error('Error assigning cook:', err);
        setAssignStatus(err.message || 'Failed to assign cook.');
      }
    };

    // Logout
    const handleLogout = () => {
      // token key standardized to 'authToken'
      localStorage.removeItem('authToken');
      localStorage.removeItem('cookhubUser');
      window.location.href = '/';
    };

    // Dashboard stats - pendingApplications now uses pendingBookingsForApp
    const stats = useMemo(() => ({
      totalCooks: cooks.length,
      availableCooks: cooks.filter(cook => cook.isAvailable).length,
      pendingApplications: pendingBookingsForApp.length,
      approvedApplications: approvedBookingsForApp.length,
    }), [cooks, pendingBookingsForApp, approvedBookingsForApp]);

    const getButtonClass = (isActive) => 
      `px-4 py-2 rounded-md font-semibold transition-all duration-200 transform ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
      }`;

    if (!token) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-400 to-red-500 rounded-full mb-6 shadow-lg">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Access Required</h2>
            <p className="text-slate-600 mb-6">Log in as a coordinator to spice up your dashboard.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
        {/* 🔹 Sidebar Navigation */}
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-slate-200 z-40 hidden lg:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">CookHub Coord</h2>
                <p className="text-sm text-slate-500">{effectiveLocation}</p>
              </div>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('cooks')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'cooks'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Cooks ({stats.totalCooks})</span>
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'applications'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                <span>Bookings ({stats.pendingApplications})</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 🔹 Mobile Topbar */}
        <div className="lg:hidden bg-white shadow-lg border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-bold text-slate-900">Coord Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="lg:ml-64">
          {/* 🔹 Hero Welcome */}
          {/* <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white py-12 px-6 lg:px-8">
            <div className="w-full px-6 lg:px-8 text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome, Coordinator!</h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">Manage top chefs and bookings in {effectiveLocation} – let's make magic in the kitchen.</p>
            </div>
          </div> */}

         

          {/* 🔹 Notifications */}
          {notification && (
            <div className="w-full px-6 lg:px-8 pt-4">
              <div className={`p-4 rounded-2xl flex items-center space-x-3 shadow-lg ${
                notification.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          )}

          {/* 🔹 Stats Grid */}
          <div className="w-full px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Chefs</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalCooks}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Ready to Cook</p>
                <p className="text-3xl font-bold text-slate-900">{stats.availableCooks}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-slate-900">{stats.pendingApplications}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Approved Bookings</p>
                <p className="text-3xl font-bold text-slate-900">{stats.approvedApplications}</p>
              </div>
            </div>
          </div>

          {/* 🔹 Main Content */}
          <div className="w-full px-6 lg:px-8 py-8">
            {activeTab === 'cooks' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search chefs by name, specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-slate-500" />
                      <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all bg-white"
                      >
                        <option value="all">All Chefs</option>
                        <option value="available">Hot & Ready</option>
                        <option value="unavailable">Booked</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingCook(null); setIsFormOpen(true); }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-200 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full lg:w-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" /> Add New Chef
                  </button>
                </div>

                <CookTable cooks={filteredCooks} onEdit={setEditingCook} onDelete={handleDeleteCook} />
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                {/* <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center"><ClipboardList className="h-6 w-6 mr-2 text-amber-600" /> Booking Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-slate-500" />
                    <select
                      value={applicationStatusFilter}
                      onChange={(e) => setApplicationStatusFilter(e.target.value)}
                      className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 hover:border-slate-300 transition-all bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="demo_scheduled">Demo Scheduled</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div> */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setBookingsTab('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      bookingsTab === 'pending' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    Pending ({pendingBookingsForApp.length})
                  </button>
                  <button
                    onClick={() => setBookingsTab('demo_scheduled')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      bookingsTab === 'demo_scheduled' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    Demo Scheduled ({demoScheduledBookingsForApp.length})
                  </button>
                  <button
                    onClick={() => setBookingsTab('approved')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      bookingsTab === 'approved' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    Approved ({approvedBookingsForApp.length})
                  </button>
                  <button
                    onClick={() => setBookingsTab('rejected')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      bookingsTab === 'rejected' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                    }`}
                  >
                    Rejected ({rejectedBookingsForApp.length})
                  </button>
                </div>
                {bookingsTab === 'pending' && (
                  <BookingsTable 
                    bookingsData={pendingBookingsForApp} 
                    status="pending" 
                    onStatusChange={handleBookingStatusChange}
                    onAssignCook={setSelectedBookingToAssign}
                    onViewDetails={setSelectedBooking}
                  />
                )}
                {bookingsTab === 'demo_scheduled' && (
                  <BookingsTable 
                    bookingsData={demoScheduledBookingsForApp} 
                    status="demo_scheduled" 
                    onStatusChange={handleBookingStatusChange}
                    onAssignCook={setSelectedBookingToAssign}
                    onViewDetails={setSelectedBooking}
                  />
                )}
                {bookingsTab === 'approved' && (
                  <BookingsTable 
                    bookingsData={approvedBookingsForApp} 
                    status="approved" 
                    onStatusChange={handleBookingStatusChange}
                    onAssignCook={setSelectedBookingToAssign}
                    onViewDetails={setSelectedBooking}
                  />
                )}
                {bookingsTab === 'rejected' && (
                  <BookingsTable 
                    bookingsData={rejectedBookingsForApp} 
                    status="rejected" 
                    onStatusChange={handleBookingStatusChange}
                    onAssignCook={setSelectedBookingToAssign}
                    onViewDetails={setSelectedBooking}
                  />
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center"><BarChart3 className="h-6 w-6 mr-2 text-amber-600" /> Analytics Dashboard</h2>
                  <span className="text-sm text-slate-500">Updated: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ApplicationStatusPie applications={applications} />
                  <CooksByExperienceBar cooks={cooks} />
                  <TopSpecialties cooks={cooks} />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center"><Settings className="h-6 w-6 mr-2 text-amber-600" /> Settings</h2>
                <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
                  <Settings className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">Customization Coming Soon</h3>
                  <p className="text-slate-500">Manage your preferences, notifications, and account settings right here.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Cook Form */}
        <CookForm
          cook={editingCook}
          onSave={handleSaveCook}
          onCancel={() => { setIsFormOpen(false); setEditingCook(null); }}
          isOpen={isFormOpen}
        />

        {/* 🔹 Assign Cook Modal */}
        <AssignCookModal
          booking={selectedBookingToAssign}
          cooks={cooks}
          onAssign={handleAssignCookForApp}
          onClose={() => setSelectedBookingToAssign(null)}
          assignStatus={assignStatus}
        />

        {/* 🔹 Booking Details Modal */}
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      </div>
    );
  }