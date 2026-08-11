// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ChevronLeft, ChefHat, User, Calendar } from 'lucide-react';
// import { API_BASE_URL } from '../utils/constants';
// import Navbar from '../layout/Navbar';
// import Footer from '../layout/Footer';

// const DetailsPage = () => {
//   const { entity, id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           throw new Error('Authentication token missing. Please log in.');
//         }

//         let endpoint;
//         switch (entity) {
//           case 'booking-details':
//             endpoint = `/admin/bookings/${id}`;
//             break;
//           case 'user-details':
//             endpoint = `/admin/users/${id}`;
//             break;
//           case 'cook-details':
//             endpoint = `/admin/cooks/${id}`;
//             break;
//           default:
//             throw new Error('Invalid entity type');
//         }

//         const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to fetch data');
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         console.error(`Error fetching ${entity}:`, err);
//         setError(err.message || 'Failed to load data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [entity, id]);

//   const handleBack = () => {
//     navigate('/admin');
//   };

//   const renderDetails = () => {
//     if (!data) return null;

//     switch (entity) {
//       case 'booking-details':
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-700"
//           >
//             <h3 className="text-3xl font-bold text-teal-300 mb-6 flex items-center">
//               <Calendar className="mr-2" /> Booking Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-gray-300"><strong>User:</strong> {data.userName}</p>
//                 <p className="text-gray-300"><strong>Email:</strong> {data.userEmail}</p>
//                 <p className="text-gray-300"><strong>Phone:</strong> {data.phone}</p>
//                 <p className="text-gray-300"><strong>Address:</strong> {data.address}</p>
//                 <p className="text-gray-300"><strong>Dietary Preference:</strong> {data.dietaryPreference}</p>
//               </div>
//               <div>
//                 <p className="text-gray-300"><strong>Meal Preference:</strong> {data.mealPreference}</p>
//                 <p className="text-gray-300"><strong>Plan Duration:</strong> {data.planDuration}</p>
//                 <p className="text-gray-300"><strong>Number of People:</strong> {data.numPeople}</p>
//                 <p className="text-gray-300"><strong>Total Amount:</strong> ₹{data.totalAmount?.toLocaleString('en-IN') || 'N/A'}</p>
//                 <p className="text-gray-300"><strong>Status:</strong> {data.status}</p>
//                 <p className="text-gray-300"><strong>Created:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//             {data.message && (
//               <div className="mt-6">
//                 <p className="text-gray-300"><strong>Message:</strong></p>
//                 <p className="text-gray-400 bg-zinc-800 p-4 rounded mt-2">{data.message}</p>
//               </div>
//             )}
//             {data.assignedCook && (
//               <div className="mt-6">
//                 <p className="text-gray-300"><strong>Assigned Cook:</strong> {data.assignedCook.name}</p>
//               </div>
//             )}
//           </motion.div>
//         );

//       case 'user-details':
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-700"
//           >
//             <h3 className="text-3xl font-bold text-teal-300 mb-6 flex items-center">
//               <User className="mr-2" /> User Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-gray-300"><strong>Name:</strong> {data.name}</p>
//                 <p className="text-gray-300"><strong>Email:</strong> {data.email}</p>
//                 <p className="text-gray-300"><strong>Role:</strong> {data.role}</p>
//                 <p className="text-gray-300"><strong>Registered:</strong> {new Date(data.registeredAt).toLocaleDateString()}</p>
//               </div>
//               <div>
//                 <p className="text-gray-300"><strong>Last Login:</strong> {data.lastLogin || 'Never'}</p>
//                 <p className="text-gray-300"><strong>Total Bookings:</strong> {data.totalBookings || 0}</p>
//                 <p className="text-gray-300"><strong>Active Bookings:</strong> {data.activeBookings || 0}</p>
//               </div>
//             </div>
//           </motion.div>
//         );

//       case 'cook-details':
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-700"
//           >
//             <h3 className="text-3xl font-bold text-teal-300 mb-6 flex items-center">
//               <ChefHat className="mr-2" /> Cook Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-gray-300"><strong>Name:</strong> {data.name}</p>
//                 <p className="text-gray-300"><strong>Email:</strong> {data.email}</p>
//                 <p className="text-gray-300"><strong>Phone:</strong> {data.phone}</p>
//                 <p className="text-gray-300"><strong>Rating:</strong> {data.rating || 'Not rated'}</p>
//               </div>
//               <div>
//                 <p className="text-gray-300"><strong>Experience:</strong> {data.experience || 'Not specified'}</p>
//                 <p className="text-gray-300"><strong>Total Jobs:</strong> {data.totalJobs || 0}</p>
//                 <p className="text-gray-300"><strong>Success Rate:</strong> {data.successRate || 'N/A'}%</p>
//               </div>
//             </div>
//             <div className="mt-6">
//               <p className="text-gray-300"><strong>Specialties:</strong></p>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {(data.specialties || []).map((specialty, index) => (
//                   <span key={index} className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
//                     {specialty}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div className="mt-6">
//               <p className="text-gray-300"><strong>Service Areas:</strong></p>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {(data.serviceAreas || []).map((area, index) => (
//                   <span key={index} className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
//                     {area}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         );

//       default:
//         return <p className="text-red-400">Invalid entity type.</p>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <Navbar
//           navigate={() => navigate('/admin')}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//         />
//         <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <p className="text-xl text-gray-600 text-center">Loading...</p>
//         </main>
//         <Footer navigate={() => navigate('/')} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <Navbar
//           navigate={() => navigate('/admin')}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//         />
//         <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <p className="text-xl text-red-600 text-center">{error}</p>
//         </main>
//         <Footer navigate={() => navigate('/')} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Navbar
//         navigate={() => navigate('/admin')}
//         isMobileMenuOpen={isMobileMenuOpen}
//         setIsMobileMenuOpen={setIsMobileMenuOpen}
//       />
//       <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <button
//           onClick={handleBack}
//           className="mb-8 flex items-center text-teal-600 hover:text-teal-700 transition duration-200"
//         >
//           <ChevronLeft className="w-5 h-5 mr-2" />
//           Back to Admin Dashboard
//         </button>
//         {renderDetails()}
//       </main>
//       <Footer navigate={() => navigate('/')} />
//     </div>
//   );
// };

// export default DetailsPage;