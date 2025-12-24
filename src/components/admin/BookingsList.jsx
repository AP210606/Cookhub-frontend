// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const BookingsList = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         console.log('Fetching bookings with token:', token);
//         const response = await axios.get('http://localhost:5000/api/bookings', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log('Bookings data:', response.data);
//         setBookings(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to fetch bookings. Please try again or check your authentication.');
//         console.error('Error fetching bookings:', err.response ? err.response.data : err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchBookings();
//     } else {
//       setError('Please log in to view your bookings.');
//       setLoading(false);
//     }
//   }, [token]);

//   const handleViewDetails = (id) => {
//     console.log('Navigating to details for ID:', id);
//     navigate(`/bookings/${id}`);
//   };

//   if (loading) return <div>Loading bookings...</div>;
//   if (error) return <div style={{ color: 'red' }}>{error}</div>;

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>My Bookings</h2>
//       {bookings.length === 0 ? (
//         <p>No bookings found.</p>
//       ) : (
//         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#f4f4f4' }}>
//               <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Cooking Service</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Time</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking) => (
//               <tr key={booking._id} style={{ borderBottom: '1px solid #ddd' }}>
//                 <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.cookingService}</td>
//                 <td style={{ padding: '10px', border: '1px solid #ddd' }}>
//                   {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
//                 </td>
//                 <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.bookingTime}</td>
//                 <td style={{ padding: '10px', border: '1px solid #ddd' }}>${booking.paymentAmount}</td>
//                 <td style={{ padding: '10px', border: '1px solid #ddd' }}>
//                   <button
//                     onClick={() => handleViewDetails(booking._id)}
//                     style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default BookingsList;