// // D:\DNG\cookhub-app-anil\cookhub-frontend\src\components\profile\ProfileSection.js
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '../utils/animations'; // Adjust path based on your utils location
// import { User, Edit, Save, X } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext'; // Adjust path based on your context location

// const ProfileSection = () => {
//   const { user, updateUserProfile, logout } = useAuth();
//   const [editMode, setEditMode] = useState(false);
//   const [tempData, setTempData] = useState({});
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (user) {
//       setTempData({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         address: user.address || '',
//         dietPreference: user.dietPreference || 'Regular Vegetarian',
//         numPeople: user.numPeople || 1,
//         mealType: user.mealType || 'Lunch Only',
//         planDuration: user.planDuration || 'Monthly',
//         serviceArea: user.serviceArea || 'Delhi NCR',
//       });
//     }
//   }, [user]);

//   const handleEdit = () => {
//     setEditMode(true);
//     setError(null);
//   };

//   const handleCancel = () => {
//     setEditMode(false);
//     setError(null);
//   };

//   const handleSave = async () => {
//     try {
//       await updateUserProfile(tempData);
//       setEditMode(false);
//       setError(null);
//     } catch (err) {
//       setError('Failed to update profile. Please try again.');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTempData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleLogout = () => {
//     if (logout) {
//       logout();
//     }
//   };

//   if (!user) {
//     return <div className="text-center py-10 text-gray-700">Please log in to view your profile.</div>;
//   }

//   return (
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       variants={staggerContainer}
//       viewport={{ once: true, amount: 0.3 }}
//       className="py-10 bg-gray-50"
//     >
//       <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
//         Your Profile
//       </motion.h2>
//       <motion.p variants={fadeInUp} className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
//         View and edit your personal details, preferences, and subscription information.
//       </motion.p>
//       <motion.div
//         variants={staggerContainer}
//         className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8"
//       >
//         <motion.div variants={slideInLeft} className="bg-white p-8 rounded-xl shadow-md">
//           <div className="flex items-center mb-6">
//             <User size={48} className="text-green-600 mr-4" />
//             <h3 className="text-2xl font-bold text-gray-900">Profile Overview</h3>
//           </div>
//           <div className="space-y-4 text-gray-700">
//             <div>
//               <p className="font-semibold">Name:</p>
//               <p>{user.name || 'Not specified'}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Email:</p>
//               <p>{user.email || 'Not specified'}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Phone:</p>
//               <p>{user.phone || 'Not specified'}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Address:</p>
//               <p>{user.address || 'Not specified'}</p>
//             </div>
//             <div>
//               <p className="font-semibold">Service Area:</p>
//               <p>{user.serviceArea || 'Not specified'}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition duration-300 ease-in-out"
//             >
//               Logout
//             </button>
//           </div>
//         </motion.div>

//         <motion.div variants={slideInRight} className="bg-white p-8 rounded-xl shadow-md">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <Edit size={48} className="text-green-600 mr-4" />
//               <h3 className="text-2xl font-bold text-gray-900">Preferences & Subscription</h3>
//             </div>
//             {!editMode ? (
//               <button
//                 onClick={handleEdit}
//                 className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300 ease-in-out"
//               >
//                 <Edit size={16} className="inline-block mr-1" /> Edit
//               </button>
//             ) : (
//               <div className="space-x-4">
//                 <button
//                   onClick={handleSave}
//                   className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300 ease-in-out"
//                 >
//                   <Save size={16} className="inline-block mr-1" /> Save
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-400 transition duration-300 ease-in-out"
//                 >
//                   <X size={16} className="inline-block mr-1" /> Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//           {error && <p className="text-red-600 mb-4">{error}</p>}
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
//               {editMode ? (
//                 <select
//                   name="dietPreference"
//                   value={tempData.dietPreference}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
//                 >
//                   <option value="Regular Vegetarian">Regular Vegetarian</option>
//                   <option value="Jain">Jain</option>
//                   <option value="Swaminarayan">Swaminarayan</option>
//                 </select>
//               ) : (
//                 <p>{user.dietPreference || 'Not specified'}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
//               {editMode ? (
//                 <select
//                   name="numPeople"
//                   value={tempData.numPeople}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
//                 >
//                   <option value="1">1 Person</option>
//                   <option value="2">2 People</option>
//                   <option value="3">3 People</option>
//                   <option value="4">4 People</option>
//                   <option value="5">5+ People (Contact Us)</option>
//                 </select>
//               ) : (
//                 <p>{user.numPeople || 1} {user.numPeople > 1 ? 'People' : 'Person'}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
//               {editMode ? (
//                 <div className="flex flex-col space-y-2">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="mealType"
//                       value="Lunch Only"
//                       checked={tempData.mealType === 'Lunch Only'}
//                       onChange={handleChange}
//                       className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
//                     />
//                     <span className="ml-2 text-gray-700">Lunch Only</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="mealType"
//                       value="Dinner Only"
//                       checked={tempData.mealType === 'Dinner Only'}
//                       onChange={handleChange}
//                       className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
//                     />
//                     <span className="ml-2 text-gray-700">Dinner Only</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="mealType"
//                       value="Both Lunch & Dinner"
//                       checked={tempData.mealType === 'Both Lunch & Dinner'}
//                       onChange={handleChange}
//                       className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
//                     />
//                     <span className="ml-2 text-gray-700">Both Lunch & Dinner</span>
//                   </label>
//                 </div>
//               ) : (
//                 <p>{user.mealType || 'Not specified'}</p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Plan Duration</label>
//               {editMode ? (
//                 <div className="flex space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setTempData((prev) => ({ ...prev, planDuration: 'Monthly' }))}
//                     className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
//                       tempData.planDuration === 'Monthly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setTempData((prev) => ({ ...prev, planDuration: 'Quarterly' }))}
//                     className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
//                       tempData.planDuration === 'Quarterly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     Quarterly
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setTempData((prev) => ({ ...prev, planDuration: 'Yearly' }))}
//                     className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
//                       tempData.planDuration === 'Yearly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     Yearly
//                   </button>
//                 </div>
//               ) : (
//                 <p>{user.planDuration || 'Not specified'}</p>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ProfileSection;