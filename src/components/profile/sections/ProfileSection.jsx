// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '../utils/animations'; // Assuming this is the same utils file
// import { User, Edit, Save, X } from 'lucide-react'; // Icons for user, edit, save, cancel
// import { useAuth } from '../contexts/AuthContext'; // Assuming an AuthContext for user authentication

// const ProfileSection = () => {
//   const { user, updateUserProfile, logout } = useAuth(); // Get user data and update function from AuthContext
//   const [editMode, setEditMode] = useState(false);
//   const [tempData, setTempData] = useState({});

//   // Update tempData when user data changes
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
//   };

//   const handleCancel = () => {
//     setEditMode(false);
//   };

//   const handleSave = async () => {
//     if (user && updateUserProfile) {
//       await updateUserProfile(tempData); // Call API or context method to update profile
//     }
//     setEditMode(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTempData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleLogout = () => {
//     if (logout) {
//       logout(); // Call logout function from AuthContext
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
//         {/* Left Column: Profile Overview */}
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

//         {/* Right Column: Preferences and Edit Form */}
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












// Updated ProfileSection.jsx as Popup Modal
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '../../utils/animations'; // Assuming this is the same utils file
import { User, Edit, Save, X, Star, Send } from 'lucide-react'; // Icons for user, edit, save, cancel
import { useAuth } from '../contexts/AuthContext'; // Assuming an AuthContext for user authentication

const ProfileSection = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, logout } = useAuth(); // Get user data and update function from AuthContext
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({});
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Update tempData when user data changes
  useEffect(() => {
    if (user) {
      setTempData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dietPreference: user.dietPreference || 'Regular Vegetarian',
        numPeople: user.numPeople || 1,
        mealType: user.mealType || 'Lunch Only',
        planDuration: user.planDuration || 'Monthly',
        serviceArea: user.serviceArea || 'Delhi NCR',
      });
    }
  }, [user]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    if (user && updateUserProfile) {
      await updateUserProfile(tempData); // Call API or context method to update profile
    }
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    if (logout) {
      logout(); // Call logout function from AuthContext
    }
    onClose(); // Close the profile popup
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (feedbackData) => {
    // Mock API call - replace with actual submission logic
    console.log('Feedback submitted:', feedbackData);
    // You can add a notification here if needed
  };

  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.3 }}
          className="p-6"
        >
          <motion.p variants={fadeInUp} className="text-lg text-gray-700 mb-6">
            View and edit your personal details, preferences, and subscription information.
          </motion.p>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left Column: Profile Overview */}
            <motion.div variants={slideInLeft} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <User size={48} className="text-green-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-900">Profile Overview</h3>
              </div>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{user.name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{user.email || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{user.phone || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-semibold">Address:</p>
                  <p>{user.address || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-semibold">Service Area:</p>
                  <p>{user.serviceArea || 'Not specified'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition duration-300 ease-in-out mt-4"
                >
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Right Column: Preferences and Edit Form */}
            <motion.div variants={slideInRight} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Edit size={48} className="text-green-600 mr-4" />
                  <h3 className="text-xl font-bold text-gray-900">Preferences & Subscription</h3>
                </div>
                {!editMode ? (
                  <button
                    onClick={handleEdit}
                    className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300 ease-in-out"
                  >
                    <Edit size={16} className="inline-block mr-1" /> Edit
                  </button>
                ) : (
                  <div className="space-x-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300 ease-in-out"
                    >
                      <Save size={16} className="inline-block mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-400 transition duration-300 ease-in-out"
                    >
                      <X size={16} className="inline-block mr-1" /> Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
                  {editMode ? (
                    <select
                      name="dietPreference"
                      value={tempData.dietPreference}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                    >
                      <option value="Regular Vegetarian">Regular Vegetarian</option>
                      <option value="Jain">Jain</option>
                      <option value="Swaminarayan">Swaminarayan</option>
                    </select>
                  ) : (
                    <p>{user.dietPreference || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                  {editMode ? (
                    <select
                      name="numPeople"
                      value={tempData.numPeople}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5+ People (Contact Us)</option>
                    </select>
                  ) : (
                    <p>{user.numPeople || 1} {user.numPeople > 1 ? 'People' : 'Person'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  {editMode ? (
                    <div className="flex flex-col space-y-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mealType"
                          value="Lunch Only"
                          checked={tempData.mealType === 'Lunch Only'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-gray-700">Lunch Only</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mealType"
                          value="Dinner Only"
                          checked={tempData.mealType === 'Dinner Only'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-gray-700">Dinner Only</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mealType"
                          value="Both Lunch & Dinner"
                          checked={tempData.mealType === 'Both Lunch & Dinner'}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-gray-700">Both Lunch & Dinner</span>
                      </label>
                    </div>
                  ) : (
                    <p>{user.mealType || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Duration</label>
                  {editMode ? (
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setTempData((prev) => ({ ...prev, planDuration: 'Monthly' }))}
                        className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
                          tempData.planDuration === 'Monthly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempData((prev) => ({ ...prev, planDuration: 'Quarterly' }))}
                        className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
                          tempData.planDuration === 'Quarterly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Quarterly
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempData((prev) => ({ ...prev, planDuration: 'Yearly' }))}
                        className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
                          tempData.planDuration === 'Yearly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  ) : (
                    <p>{user.planDuration || 'Not specified'}</p>
                  )}
                </div>
                {!editMode && (
                  <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="w-full mt-4 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-amber-600 transition duration-300 ease-in-out flex items-center justify-center gap-2"
                  >
                    <Star size={16} />
                    Provide Feedback
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* FeedbackForm Modal */}
      {isFeedbackOpen && (
        <FeedbackForm
          onSubmit={handleFeedbackSubmit}
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}
    </div>
  );
};

/**
 * FeedbackForm component for user feedback.
 * @param {object} props The component props.
 * @param {Function} props.onSubmit The function to call when the form is submitted.
 * @param {boolean} props.isOpen A boolean to control the form's visibility.
 * @param {Function} props.onClose The function to call when the form is closed.
 */
const FeedbackForm = ({ onSubmit, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: '',
    suggestions: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-4 mx-auto">
            <Star className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Feedback</h3>
          <p className="text-sm text-slate-500">Help us improve the dashboard!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rate the Dashboard (1-5)</label>
            <div className="flex justify-center space-x-1">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl transition-colors ${
                    star <= formData.rating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="feedback" className="block text-sm font-semibold text-slate-700">What you liked?</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 resize-none"
              placeholder="Share your positive experiences..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="suggestions" className="block text-sm font-semibold text-slate-700">Suggestions for improvement?</label>
            <textarea
              id="suggestions"
              name="suggestions"
              value={formData.suggestions}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-200 resize-none"
              placeholder="What features would you like to see?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Feedback
          </button>
        </form>
        {submitted && (
          <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg text-center">
            Thank you! Your feedback has been submitted.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;