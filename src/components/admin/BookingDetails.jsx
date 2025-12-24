// // import React, { useState, useEffect, useRef } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import { API_BASE_URL } from '../utils/constants';

// // const DetailsPage = ({ token: initialToken }) => {
// //   const { entityType, id } = useParams(); // entityType can be 'booking-details', 'user-details', or 'cook-details'
// //   const navigate = useNavigate();
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const token = useRef(initialToken || localStorage.getItem('authToken')).current;

// //   useEffect(() => {
// //     const fetchDetails = async () => {
// //       setLoading(true);
// //       setError('');
// //       try {
// //         let endpoint;
// //         switch (entityType) {
// //           case 'booking-details':
// //             endpoint = `${API_BASE_URL}/admin/bookings/${id}`;
// //             break;
// //           case 'user-details':
// //             endpoint = `${API_BASE_URL}/admin/users/${id}`;
// //             break;
// //           case 'cook-details':
// //             endpoint = `${API_BASE_URL}/cooks/${id}`;
// //             break;
// //           default:
// //             throw new Error('Invalid entity type');
// //         }

// //         const response = await fetch(endpoint, {
// //           headers: { 'Authorization': `Bearer ${token}` },
// //         });

// //         const result = await response.json();
// //         if (!response.ok) {
// //           throw new Error(result.message || 'Failed to fetch details');
// //         }

// //         setData(result);
// //       } catch (err) {
// //         console.error(`Error fetching ${entityType}:`, err);
// //         setError(err.message || 'Failed to load details.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (token && id && entityType) {
// //       fetchDetails();
// //     } else {
// //       setError('Authentication token or ID missing. Please log in or provide a valid ID.');
// //       setLoading(false);
// //     }
// //   }, [token, id, entityType]);

// //   const renderBookingDetails = (booking) => (
// //     <div className="space-y-4">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">User Name</h4>
// //           <p className="text-gray-200">{booking.userName}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Email</h4>
// //           <p className="text-gray-200">{booking.userEmail}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Phone</h4>
// //           <p className="text-gray-200">{booking.phone}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Address</h4>
// //           <p className="text-gray-200">{booking.address}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Dietary Preference</h4>
// //           <p className="text-gray-200">{booking.dietaryPreference}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Meal Preference</h4>
// //           <p className="text-gray-200">{booking.mealPreference}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Plan Duration</h4>
// //           <p className="text-gray-200">{booking.planDuration}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Number of People</h4>
// //           <p className="text-gray-200">{booking.numPeople}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Total Amount</h4>
// //           <p className="text-gray-200">₹{booking.totalAmount?.toLocaleString('en-IN') || 'N/A'}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Status</h4>
// //           <p className="text-gray-200">{booking.status}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Requested On</h4>
// //           <p className="text-gray-200">{new Date(booking.createdAt).toLocaleString()}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Assigned Cook</h4>
// //           <p className="text-gray-200">{booking.assignedCook?.name || 'Not Assigned'}</p>
// //         </div>
// //         <div className="md:col-span-2">
// //           <h4 className="text-lg font-semibold text-gray-100">Message</h4>
// //           <p className="text-gray-200">{booking.message || 'N/A'}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const renderUserDetails = (user) => (
// //     <div className="space-y-4">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Name</h4>
// //           <p className="text-gray-200">{user.name}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Email</h4>
// //           <p className="text-gray-200">{user.email}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Role</h4>
// //           <p className="text-gray-200">{user.role}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Registered On</h4>
// //           <p className="text-gray-200">{new Date(user.registeredAt).toLocaleString()}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const renderCookDetails = (cook) => (
// //     <div className="space-y-4">
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Name</h4>
// //           <p className="text-gray-200">{cook.name}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Email</h4>
// //           <p className="text-gray-200">{cook.email || 'N/A'}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Phone</h4>
// //           <p className="text-gray-200">{cook.phone}</p>
// //         </div>
// //         <div>
// //           <h4 className="text-lg font-semibold text-gray-100">Availability</h4>
// //           <p className="text-gray-200">{cook.isAvailable ? 'Available' : 'Booked'}</p>
// //         </div>
// //         <div className="md:col-span-2">
// //           <h4 className="text-lg font-semibold text-gray-100">Specialties</h4>
// //           <p className="text-gray-200">{cook.specialties.join(', ') || 'N/A'}</p>
// //         </div>
// //         <div className="md:col-span-2">
// //           <h4 className="text-lg font-semibold text-gray-100">Service Areas</h4>
// //           <p className="text-gray-200">{cook.serviceAreas.join(', ') || 'N/A'}</p>
// //         </div>
// //         <div className="md:col-span-2">
// //           <h4 className="text-lg font-semibold text-gray-100">Active Bookings</h4>
// //           <p className="text-gray-200">
// //             {cook.activeBookings && cook.activeBookings.length > 0
// //               ? cook.activeBookings.map(id => `Booking ID: ${id.substring(0, 6)}...`).join(', ')
// //               : 'None'}
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   if (loading) {
// //     return (
// //       <section className="py-16 text-center bg-zinc-900 rounded-xl shadow-lg border border-zinc-800">
// //         <p className="text-xl text-gray-400">Loading details...</p>
// //       </section>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <section className="py-16 text-center bg-red-800 text-red-100 rounded-xl shadow-lg border border-red-700">
// //         <p className="text-xl">{error}</p>
// //       </section>
// //     );
// //   }

// //   if (!data) {
// //     return (
// //       <section className="py-16 text-center bg-red-800 text-red-100 rounded-xl shadow-lg border border-red-700">
// //         <p className="text-xl">No data available.</p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="py-16 bg-gradient-to-br from-teal-950 to-teal-900 rounded-xl shadow-lg px-8 border border-teal-800">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="bg-zinc-800 p-8 rounded-xl shadow-md border border-zinc-700"
// //       >
// //         <h2 className="text-3xl font-bold text-teal-300 mb-6">
// //           {entityType === 'booking-details' ? 'Booking Details' : 
// //            entityType === 'user-details' ? 'User Details' : 
// //            'Cook Details'}
// //         </h2>
// //         {entityType === 'booking-details' && renderBookingDetails(data)}
// //         {entityType === 'user-details' && renderUserDetails(data)}
// //         {entityType === 'cook-details' && renderCookDetails(data)}
// //         <div className="mt-8">
// //           <button
// //             onClick={() => navigate('/admin')}
// //             className="bg-teal-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-teal-700 transition duration-300"
// //           >
// //             Back to Dashboard
// //           </button>
// //         </div>
// //       </motion.div>
// //     </section>
// //   );
// // };

// // export default DetailsPage;


// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const BookingDetails = () => {
//   const { id } = useParams();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchBookingDetails = async () => {
//       try {
//         setLoading(true);
//         console.log('Fetching booking details for ID:', id, 'with token:', token);
//         const response = await axios.get(`http://localhost:5000/api/bookings/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('Booking data:', response.data);
//         setBooking(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to fetch booking details. Please try again or check your authentication.');
//         console.error('Error fetching booking details:', err.response ? err.response.data : err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchBookingDetails();
//     } else {
//       setError('Please log in to view booking details.');
//       setLoading(false);
//     }
//   }, [id, token]);

//   if (loading) return <div>Loading booking details...</div>;
//   if (error) return <div style={{ color: 'red' }}>{error}</div>;
//   if (!booking) return <div>Booking not found.</div>;

//   return (
//     <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
//       <h2>Booking Details</h2>
//       <button
//         onClick={() => navigate('/bookings')}
//         style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginBottom: '20px' }}
//       >
//         Back to Bookings
//       </button>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Booking Information</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Cooking Service:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{booking.cookingService}</td></tr>
//             <tr><td>Booking Date:</td><td>{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td></tr>
//             <tr><td>Booking Time:</td><td>{booking.bookingTime}</td></tr>
//           </tbody>
//         </table>
//       </div>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Payment Receipt</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Amount:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>${booking.paymentAmount}</td></tr>
//             <tr><td>Transaction ID:</td><td>{booking.transactionId}</td></tr>
//             <tr><td>Payment Date:</td><td>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td></tr>
//           </tbody>
//         </table>
//         <p style={{ color: '#e74c3c', fontSize: '12px' }}>* This is a confirmation of your payment. Contact us if there are any discrepancies.</p>
//       </div>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Contact Information</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Mobile Number:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{booking.mobileNumber}</td></tr>
//             <tr><td>Name:</td><td>{booking.userId.name || 'N/A'}</td></tr>
//             <tr><td>Email:</td><td><a href={`mailto:${booking.userId.email}`}>{booking.userId.email || 'N/A'}</a></td></tr>
//           </tbody>
//         </table>
//       </div>
//       <div style={{ margin: '20px 0', textAlign: 'center', color: '#7f8c8d', fontSize: '12px' }}>
//         <p>Booking created on: {new Date(booking.createdAt).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
//         <p>&copy; {new Date().getFullYear()} Cookhub. All rights reserved.</p>
//       </div>
//     </div>
//   );
// };

// export default BookingDetails;