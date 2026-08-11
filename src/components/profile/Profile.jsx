// // cookhub-frontend/src/components/profile/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Star, Clock, MapPin, Utensils, CalendarDays, UserCheck, RefreshCw, Send } from 'lucide-react';

// const Profile = ({ user, setIsProfileOpen, onClose }) => {
//   const navigate = useNavigate();
//   const [bookings, setBookings] = useState([]);
//   const [loadingBookings, setLoadingBookings] = useState(true);
//   const [errorBookings, setErrorBookings] = useState('');
//   const [userRating, setUserRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);
//   const [tempRating, setTempRating] = useState(0);
//   const [ratingComment, setRatingComment] = useState('');
//   const [submittingRating, setSubmittingRating] = useState(false);
//   const [showRatingForm, setShowRatingForm] = useState(false);
//   const [selectedBookingForRating, setSelectedBookingForRating] = useState(null); // Track which booking to rate

//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

//   const fetchBookings = async () => {
//     if (!user) return;
//     setLoadingBookings(true);
//     setErrorBookings('');
//     try {
//       const token = localStorage.getItem('authToken');
//       const headers = {};
//       if (token) headers['Authorization'] = `Bearer ${token}`;

//       const response = await fetch(`${API_BASE_URL}/bookings/my`, {
//         method: 'GET',
//         headers,
//       });

//       if (!response.ok) {
//         const errData = await response.json().catch(() => ({}));
//         throw new Error(errData.message || 'Failed to fetch bookings');
//       }

//       const data = await response.json();
//       const bookingsArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
//       setBookings(bookingsArray);
//     } catch (err) {
//       console.error('Bookings fetch error:', err);
//       setErrorBookings(err.message || 'Failed to load bookings');
//       setBookings([]);
//     } finally {
//       setLoadingBookings(false);
//     }
//   };

//   const fetchUserRating = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE_URL}/users/${user._id}/ratings`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const { averageRating, count } = await response.json();
//         setUserRating(averageRating || 0);
//         setRatingCount(count || 0);
//       }
//     } catch (err) {
//       console.warn('Rating fetch error:', err);
//     }
//   };

//   const handleSubmitRating = async () => {
//     if (tempRating === 0) return;
//     setSubmittingRating(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE_URL}/ratings/cooks`, { // Specific endpoint for cook ratings
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           rating: tempRating,
//           comment: ratingComment.trim() || undefined,
//           userId: user._id,
//           bookingId: selectedBookingForRating?._id, // Associate with booking
//           cookId: selectedBookingForRating?.assignedCook, // Rate the specific cook
//           cookName: selectedBookingForRating?.assignedCookName,
//         }),
//       });
//       if (!response.ok) {
//         const errData = await response.json().catch(() => ({}));
//         throw new Error(errData.message || 'Failed to submit rating');
//       }
//       // Success: Refresh ratings and bookings
//       fetchUserRating();
//       fetchBookings();
//       setTempRating(0);
//       setRatingComment('');
//       setShowRatingForm(false);
//       setSelectedBookingForRating(null);
//       alert('Thank you for rating the cook! Your feedback helps us improve.');
//     } catch (err) {
//       console.error('Rating submit error:', err);
//       alert(err.message || 'Failed to submit rating');
//     } finally {
//       setSubmittingRating(false);
//     }
//   };

//   // Show rating form for a specific booking
//   const handleRateCook = (booking) => {
//     if (booking.status === 'completed' || booking.status === 'approved') { // Only for completed/approved
//       setSelectedBookingForRating(booking);
//       setTempRating(0);
//       setRatingComment('');
//       setShowRatingForm(true);
//     } else {
//       alert('You can rate the cook after the booking is completed.');
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchBookings();
//       fetchUserRating();
//     }
//   }, [user]);

//   const handleRetry = () => {
//     fetchBookings();
//   };

//   const handleEdit = () => {
//     if (setIsProfileOpen) {
//       setIsProfileOpen(false);
//     }
//     navigate('/profile/edit');
//   };

//   const handleBookDemo = () => {
//     navigate('/booking');
//   };

//   if (!user) {
//     return (
//       <div className="text-center p-4 bg-white rounded-2xl shadow-xl">
//         <h3 className="text-xl font-bold text-slate-800 mb-4">Profile Not Found</h3>
//         <button
//           onClick={() => navigate('/')}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//         >
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             {user.profilePhoto ? (
//               <img
//                 src={user.profilePhoto}
//                 alt="Profile"
            // <h5 className="text-sm font-semibold text-green-800 mb-2">Rate Cook: {selectedBookingForRating.assignedCookName}</h5>
            // <p className="text-xs text-slate-600 mb-3">For Booking {formatBookingLabel(selectedBookingForRating)}</p>
//               />
//             ) : (
                  // <h5 className="font-semibold text-slate-800 text-sm">Booking {formatBookingLabel(booking)}</h5>
//                 {user.name ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : 'U'}
//               </div>
                // <div className="text-xs text-slate-600">Booking {formatBookingLabel(selectedBookingForRating)}</div>
//           </div>
//           <div>
                  // <div className="text-sm font-semibold text-slate-800">Booking {formatBookingLabel(b)}</div>
//             <p className="text-green-600 text-sm">{user.email || 'N/A'}</p>
//           </div>
                  // <div className="font-semibold text-slate-800">{formatBookingLabel(selectedBookingDetails)}</div>
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="text-slate-500 hover:text-green-600 text-lg font-bold p-2"
//           >
//             ×
//           </button>
//         )}
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="flex items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-200">
//           <span className="text-xs font-medium text-slate-600 mr-2">Role</span>
//           <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
//             {user.role || 'User'}
//           </span>
//         </div>
//         <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
//           <span className="text-xs font-medium text-slate-600 block">Joined</span>
//           <span className="text-xs text-slate-500">
//             {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//           </span>
//         </div>
//         <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200 relative">
//           <div className="flex items-center space-x-1 mr-2">
//             {[...Array(5)].map((_, i) => (
//               <Star 
//                 key={i} 
//                 className={`h-4 w-4 ${i < Math.floor(userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-400'}`} 
//               />
//             ))}
//           </div>
//           <span className="text-sm font-semibold text-green-700">{userRating.toFixed(1)}/5</span>
//           <span className="text-xs text-slate-500 ml-1">({ratingCount}+)</span>
//         </div>
//       </div>

//       {/* Dynamic Rating Form (for Cook) */}
//       {showRatingForm && selectedBookingForRating && (
//         <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
//           <h5 className="text-sm font-semibold text-green-800 mb-2">Rate Cook: {selectedBookingForRating.assignedCookName}</h5>
//           <p className="text-xs text-slate-600 mb-3">For Booking #{selectedBookingForRating._id?.slice(-6).toUpperCase()}</p>
//           <div className="flex items-center space-x-2 mb-3">
//             {[...Array(5)].map((_, i) => (
//               <button
//                 key={i}
//                 type="button"
//                 onClick={() => setTempRating(i + 1)}
//                 className={`h-6 w-6 rounded transition-colors ${
//                   i < tempRating ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-300'
//                 } hover:text-yellow-400`}
//               >
//                 <Star className="h-6 w-6" />
//               </button>
//             ))}
//           </div>
//           <textarea
//             value={ratingComment}
//             onChange={(e) => setRatingComment(e.target.value)}
//             placeholder="Share your experience with the cook (optional)..."
//             className="w-full p-2 border border-green-300 rounded text-sm mb-3 resize-none"
//             rows={3}
//             maxLength={500}
//           />
//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={handleSubmitRating}
//               disabled={submittingRating || tempRating === 0}
//               className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <Send className="h-3 w-3" />
//               <span>{submittingRating ? 'Submitting...' : 'Submit Rating'}</span>
//             </button>
//             <button
//               onClick={() => {
//                 setTempRating(0);
//                 setRatingComment('');
//                 setShowRatingForm(false);
//                 setSelectedBookingForRating(null);
//               }}
//               className="px-3 py-1 bg-slate-300 text-slate-700 rounded text-sm hover:bg-slate-400 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <button
//           onClick={handleEdit}
//           className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold transition-all duration-200 shadow-md"
//         >
//           Edit Profile
//         </button>
//         {setIsProfileOpen && (
//           <button
//             onClick={() => setIsProfileOpen(false)}
//             className="py-3 px-6 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors"
//           >
//             Close
//           </button>
//         )}
//       </div>

//       {/* Bookings */}
//       <div className="border-t border-slate-200 pt-6">
//         <div className="flex items-center justify-between mb-4">
//           <h4 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
//             <Utensils className="h-5 w-5 text-green-600" />
//             <span>My Bookings</span>
//           </h4>
//           <button
//             onClick={handleBookDemo}
//             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all duration-200 shadow-md"
//           >
//             <span>Book Demo Day</span>
//           </button>
//         </div>

//         {loadingBookings ? (
//           <div className="text-center py-8 text-slate-500 flex items-center justify-center space-x-2">
//             <RefreshCw className="h-5 w-5 animate-spin text-green-600" />
//             <span>Loading bookings...</span>
//           </div>
//         ) : errorBookings ? (
//           <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
//             <div className="flex items-center justify-center space-x-2 mb-2">
//               <RefreshCw className="h-4 w-4 text-red-600" />
//               <span>{errorBookings}</span>
//             </div>
//             <button
//               onClick={handleRetry}
//               className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         ) : bookings.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg p-4">
//             <Utensils className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//             <p>No bookings yet.</p>
//             <button 
//               onClick={handleBookDemo} 
//               className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
//             >
//               Book Now
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto space-y-4">
//             {bookings.map((booking) => (
//               <div key={booking._id} className="p-4 bg-gradient-to-br from-slate-50 to-green-50 rounded-xl border border-green-200 shadow-sm">
//                 <div className="flex justify-between items-start mb-3">
//                   <h5 className="font-semibold text-slate-800 text-sm">Booking #{booking._id?.slice(-6).toUpperCase() || 'N/A'}</h5>
//                   <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
//                     booking.status === 'approved' ? 'bg-green-100 text-green-800' :
//                     booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-slate-100 text-slate-800'
//                   }`}>
//                     {booking.status?.toUpperCase() || 'N/A'}
//                   </span>
//                 </div>
//                 <div className="space-y-2 text-xs text-slate-600">
//                   <div className="flex items-center space-x-2">
//                     <CalendarDays className="h-3 w-3 text-green-600 flex-shrink-0" />
//                     <span className="font-medium min-w-0 flex-1">Date:</span>
//                     <span className="truncate">{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Clock className="h-3 w-3 text-green-600 flex-shrink-0" />
//                     <span className="font-medium min-w-0 flex-1">Time:</span>
//                     <span className="truncate">{booking.time || booking.serviceStartTime ? new Date(booking.serviceStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <MapPin className="h-3 w-3 text-green-600 flex-shrink-0" />
//                     <span className="font-medium min-w-0 flex-1">Location:</span>
//                     <span className="truncate font-medium text-slate-800">{booking.address || 'N/A'}</span> {/* Bold for visibility */}
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Utensils className="h-3 w-3 text-green-600 flex-shrink-0" />
//                     <span className="font-medium min-w-0 flex-1">Meal Preference:</span>
//                     <span className="truncate font-medium text-slate-800">{booking.mealPreference || 'N/A'}</span> {/* Bold for visibility */}
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium min-w-0 flex-1">Plan Duration:</span>
//                     <span className="truncate">{booking.planDuration || 'N/A'}</span>
//                   </div>
//                   {booking.assignedCookName && (
//                     <div className="flex items-center space-x-2 pt-1 border-t border-slate-300 mt-1">
//                       <UserCheck className="h-3 w-3 text-green-600 flex-shrink-0" />
//                       <span className="font-semibold text-green-700 min-w-0 flex-1">Cook Coming Home: {booking.assignedCookName}</span>
//                     </div>
//                   )}
//                   {booking.notes && (
//                     <div className="pt-1 mt-1 bg-white rounded p-2">
//                       <span className="font-medium text-xs block text-slate-700">Notes:</span>
//                       <span className="text-xs italic text-slate-500">{booking.notes}</span>
//                     </div>
//                   )}
//                   {/* Rate Cook Button - Only for completed/approved bookings with assigned cook */}
//                   {booking.assignedCookName && (booking.status === 'completed' || booking.status === 'approved') && (
//                     <button
//                       onClick={() => handleRateCook(booking)}
//                       className="mt-2 w-full py-1 px-2 bg-yellow-100 text-yellow-800 rounded text-xs font-medium hover:bg-yellow-200 transition-colors"
//                     >
//                       Rate This Cook
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

























// // cookhub-frontend/src/components/profile/Profile.jsx
// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   Star,
//   Clock,
//   MapPin,
//   Utensils,
//   CalendarDays,
//   UserCheck,
//   RefreshCw,
//   Send,
//   Eye,
// } from 'lucide-react';

// const DEFAULT_AVATAR = '/default-avatar.png'; // ensure this exists in public folder

// const Profile = ({ user: fetchInitialProfile, setIsProfileOpen, onClose }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // local states
//   const [user, setUser] = useState(fetchInitialProfile || null);
//   const [editMode, setEditMode] = useState(false);
//   const [editForm, setEditForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     bio: '',
//   });
//   const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
//   const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editError, setEditError] = useState('');

//   const [bookings, setBookings] = useState([]);
//   const [loadingBookings, setLoadingBookings] = useState(false);
//   const [errorBookings, setErrorBookings] = useState('');

//   const [userRating, setUserRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);

//   // rating form state
//   const [showRatingForm, setShowRatingForm] = useState(false);
//   const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
//   const [tempRating, setTempRating] = useState(0);
//   const [ratingComment, setRatingComment] = useState('');
//   const [submittingRating, setSubmittingRating] = useState(false);
//   const [myRatings, setMyRatings] = useState([]);

//   // booking details modal
//   const [showBookingDetails, setShowBookingDetails] = useState(false);
//   const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

//   const isModal = !!setIsProfileOpen || !!onClose;
//   const isPathEditMode = location.pathname.includes('/profile/edit');
//   const effectiveEditMode = editMode || isPathEditMode;

//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
//   const abortControllerRef = useRef(null);
//   const isFetchingProfileRef = useRef(false); // New: Prevent concurrent/infinite fetches

//   // Initial fetch on mount (replaces the old useEffect)
//   useEffect(() => {
//     const fetchInitialProfile = async () => {
//       if (isFetchingProfileRef.current) return; // Prevent overlap
//       isFetchingProfileRef.current = true;
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;
//         const res = await fetch(`${API_BASE_URL}/users/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const profile = await res.json();
//           setUser(profile);
//           if (!effectiveEditMode) { // Only set form if not editing
//             setEditForm({
//               name: profile.name || "",
//               email: profile.email || "",
//               phone: profile.phone || "",
//               bio: profile.bio || "",
//             });
//           }
//           if (profile.profilePhoto) setPhotoPreviewUrl(profile.profilePhoto);
//           try { localStorage.setItem('user', JSON.stringify(profile)); } catch (e) {}
//         }
//       } catch (err) {
//         // Optionally fallback to localStorage
//         try {
//           const stored = localStorage.getItem("user");
//           if (stored) {
//             const parsed = JSON.parse(stored);
//             setUser(parsed);
//             if (!effectiveEditMode) {
//               setEditForm({
//                 name: parsed.name || "",
//                 email: parsed.email || "",
//                 phone: parsed.phone || "",
//                 bio: parsed.bio || "",
//               });
//             }
//             if (parsed.profilePhoto) setPhotoPreviewUrl(parsed.profilePhoto);
//           }
//         } catch (e) {}
//       } finally {
//         isFetchingProfileRef.current = false;
//       }
//     };
//     fetchInitialProfile();
//   }, []); // Empty deps: Only on mount

//   // cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (abortControllerRef.current) abortControllerRef.current.abort();
//     };
//   }, []);

//   // Fetch bookings
//   const fetchBookings = async () => {
//     if (!user) return;
//     setLoadingBookings(true);
//     setErrorBookings('');
//     if (abortControllerRef.current) abortControllerRef.current.abort();
//     abortControllerRef.current = new AbortController();
//     try {
//       const token = localStorage.getItem('authToken');
//       const res = await fetch(`${API_BASE_URL}/bookings/my`, {
//         method: 'GET',
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         signal: abortControllerRef.current.signal,
//       });
//       if (!res.ok) {
//         const text = await res.text().catch(() => '');
//         throw new Error(text || `Failed to fetch bookings (${res.status})`);
//       }
//       const data = await res.json();
//       const arr = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
//       setBookings(arr);
//     } catch (err) {
//       if (err.name !== 'AbortError') {
//         console.error('fetchBookings error', err);
//         setErrorBookings(err.message || 'Failed to load bookings');
//         setBookings([]);
//       }
//     } finally {
//       setLoadingBookings(false);
//     }
//   };

//   // Fetch latest profile from backend (try cook endpoint first, then users/me, then users/:id, then /me)
//   const fetchProfileFromServer = async () => {
//     if (isFetchingProfileRef.current) return; // Prevent concurrent calls
//     isFetchingProfileRef.current = true;
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) return;

//       // abort previous
//       if (abortControllerRef.current) abortControllerRef.current.abort();
//       abortControllerRef.current = new AbortController();
//       const signal = abortControllerRef.current.signal;

//       // Try multiple possible endpoints (cook-specific, users, generic)
//       const tryUrls = [];
//       tryUrls.push(`${API_BASE_URL}/cooks/me`);
//       tryUrls.push(`${API_BASE_URL}/users/me`);
//       // if we have a user id locally, try that too
//       const stored = localStorage.getItem('user');
//       let localId = user?._id;
//       if (!localId && stored) {
//         try { localId = JSON.parse(stored)._id; } catch (e) { /* ignore */ }
//       }
//       if (localId) tryUrls.push(`${API_BASE_URL}/users/${localId}`);
//       tryUrls.push(`${API_BASE_URL}/me`);

//       for (const url of tryUrls) {
//         try {
//           const res = await fetch(url, {
//             method: 'GET',
//             headers: { Authorization: `Bearer ${token}` },
//             signal,
//           });
//           if (!res) continue;
//           if (res.status === 404 || res.status === 401) {
//             // try next
//             continue;
//           }
//           if (!res.ok) {
//             // try next endpoint
//             continue;
//           }
//           const json = await res.json();
//           if (json) {
//             // normalize: some endpoints return { user: {...} }
//             const profile = json.user || json || null;
//             if (profile) {
//               setUser(profile);
//               // Only update editForm if NOT in edit mode (protects typing)
//               if (!effectiveEditMode) {
//                 setEditForm({
//                   name: profile.name || '',
//                   email: profile.email || '',
//                   phone: profile.phone || '',
//                   bio: profile.bio || '',
//                 });
//               }
//               if (profile.profilePhoto) setPhotoPreviewUrl(profile.profilePhoto);
//               try { localStorage.setItem('user', JSON.stringify(profile)); } catch (e) {}
//               break; // stop after successful fetch
//             }
//           }
//         } catch (err) {
//           if (err.name === 'AbortError') break;
//           // continue to next endpoint
//           console.warn('Profile fetch attempt failed for', url, err && err.message ? err.message : err);
//         }
//       }
//     } catch (err) {
//       console.warn('fetchProfileFromServer', err);
//     } finally {
//       isFetchingProfileRef.current = false;
//     }
//   };

//   const fetchUserRating = async () => {
//     if (!user) return;
//     try {
//       const token = localStorage.getItem('authToken');
//       const res = await fetch(`${API_BASE_URL}/users/${user._id}/ratings`, {
//         method: 'GET',
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!res.ok) {
//         // ignore silently
//         return;
//       }
//       const json = await res.json();
//       setUserRating(json.averageRating || 0);
//       setRatingCount(json.count || 0);
//     } catch (err) {
//       console.warn('fetchUserRating', err);
//     }
//   };

//   const fetchMyRatings = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       const res = await fetch(`${API_BASE_URL}/ratings/my`, {
//         method: 'GET',
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       if (!res.ok) {
//         setMyRatings([]);
//         return;
//       }
//       const arr = await res.json();
//       setMyRatings(Array.isArray(arr) ? arr : []);
//     } catch (err) {
//       console.warn('fetchMyRatings', err);
//       setMyRatings([]);
//     }
//   };

//   // Refresh data when entering/leaving edit mode (no user dep to avoid loop)
//   useEffect(() => {
//     // Fetch profile only when NOT in edit mode (or on mode change)
//     if (!effectiveEditMode) {
//       fetchProfileFromServer();
//     }

//     if (user && !effectiveEditMode) {
//       fetchBookings();
//       fetchUserRating();
//       fetchMyRatings();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [effectiveEditMode]); // Only dep: effectiveEditMode

//   // Edit handlers
//   const openEdit = () => {
//     if (isModal) {
//       setEditMode(true);
//     } else {
//       navigate('/profile/edit');
//     }
//   };

//   const cancelEdit = () => {
//     // reset form to current user
//     setEditForm({
//       name: user?.name || '',
//       email: user?.email || '',
//       phone: user?.phone || '',
//       bio: user?.bio || '',
//     });
//     setSelectedPhotoFile(null);
//     if (user?.profilePhoto) setPhotoPreviewUrl(user.profilePhoto);
//     setEditError('');
//     if (isModal) setEditMode(false);
//     else navigate('/profile');
//   };

//   const handlePhotoSelect = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('image/')) return alert('Please pick an image file');
//     if (file.size > 5 * 1024 * 1024) return alert('Please select image smaller than 5MB');
//     setSelectedPhotoFile(file);
//     const url = URL.createObjectURL(file);
//     setPhotoPreviewUrl(url);
//   };

// const submitEdit = async (e) => {
//   e.preventDefault();
//   if (!editForm.phone?.trim()) {
//     setEditError('Mobile number is required.');
//     return;
//   }
//   setEditing(true);
//   setEditError('');
//   try {
//     const token = localStorage.getItem('authToken');
//     const fd = new FormData();
//     fd.append('name', editForm.name || '');
//     fd.append('email', editForm.email || '');
//     fd.append('phone', editForm.phone || '');
//     if (editForm.bio) fd.append('bio', editForm.bio);
//     if (selectedPhotoFile) fd.append('profilePhoto', selectedPhotoFile);

//     const res = await fetch(`${API_BASE_URL}/users/me`, {  // Changed: Use /me instead of /:id
//       method: 'PUT',  // Or 'PATCH' if that works better
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//       body: fd,
//     });
//     if (!res.ok) {
//       const text = await res.text().catch(() => '');
//       let msg = `Failed to update (${res.status})`;
//       try {
//         const j = JSON.parse(text);
//         msg = j.message || msg;
//       } catch (err) {
//         if (text) msg = text;
//       }
//       throw new Error(msg);
//     }
//     const updated = await res.json();
//     setUser(updated);
//     // update localStorage if present
//     try {
//       localStorage.setItem('user', JSON.stringify(updated));
//     } catch (e) {}
//     alert('Profile updated successfully');
//     cancelEdit();
//   } catch (err) {
//     console.error('submitEdit', err);
//     setEditError(err.message || 'Failed to update profile');
//   } finally {
//     setEditing(false);
//   }
// };

//   // Booking details
//   const openBookingDetails = (booking) => {
//     setSelectedBookingDetails(booking);
//     setShowBookingDetails(true);
//   };
//   const closeBookingDetails = () => {
//     setSelectedBookingDetails(null);
//     setShowBookingDetails(false);
//   };

//   // Ratings
//   const isRated = (bookingId) => myRatings.some(r => r.bookingId === bookingId);

//   const openRateForm = (booking) => {
//     if (booking.status !== 'completed') {
//       return alert('You can rate only after booking is completed.');
//     }
//     if (isRated(booking._id)) {
//       return alert('You already rated this booking.');
//     }
//     setSelectedBookingForRating(booking);
//     setTempRating(0);
//     setRatingComment('');
//     setShowRatingForm(true);
//   };

//   const submitRating = async () => {
//     if (!selectedBookingForRating) return;
//     if (!tempRating) return alert('Please select a rating (1-5).');
//     setSubmittingRating(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       const body = {
//         rating: tempRating,
//         comment: ratingComment?.trim() || undefined,
//         userId: user._id,
//         bookingId: selectedBookingForRating._id,
//         cookId: selectedBookingForRating.assignedCook,
//         cookName: selectedBookingForRating.assignedCookName,
//       };
//       const res = await fetch(`${API_BASE_URL}/ratings/cooks`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) {
//         const text = await res.text().catch(() => '');
//         let msg = `Failed to submit rating (${res.status})`;
//         try {
//           const j = JSON.parse(text);
//           msg = j.message || msg;
//         } catch (e) {
//           if (text) msg = text;
//         }
//         throw new Error(msg);
//       }
//       // refresh
//       await fetchUserRating();
//       await fetchMyRatings();
//       alert('Thanks for your feedback!');
//       setShowRatingForm(false);
//       setSelectedBookingForRating(null);
//       await fetchBookings();
//     } catch (err) {
//       console.error('submitRating', err);
//       alert(err.message || 'Failed to submit rating');
//     } finally {
//       setSubmittingRating(false);
//     }
//   };

//   const handleBookDemo = () => navigate('/booking');

//   // ---------- Render ----------
//   if (!user) {
//     return (
//       <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
//         <h3 className="text-xl font-bold mb-4 text-slate-800">Profile not found</h3>
//         <p className="text-sm text-slate-600 mb-4">Please login or go to home.</p>
//         <div className="flex gap-2">
//           <button
//             onClick={() => navigate('/')}
//             className="px-4 py-2 bg-green-600 text-white rounded-md"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // If in edit mode (modal or path), show edit form
//   if (effectiveEditMode) {
//     return (
//       <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-green-50">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
//           <button
//             className="text-slate-500 hover:text-green-600 text-2xl"
//             onClick={cancelEdit}
//             aria-label="Close edit"
//           >
//             ×
//           </button>
//         </div>

//         <form onSubmit={submitEdit} className="space-y-4">
//           {/* <div className="flex items-center gap-4">
//             <div className="flex-shrink-0">
//               <img
//                 src={photoPreviewUrl || user.profilePhoto || DEFAULT_AVATAR}
//                 alt="avatar preview"
//                 onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
//                 className="h-20 w-20 rounded-full object-cover border"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-slate-700">Profile Photo</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePhotoSelect}
//                 className="mt-2 text-sm"
//               />
//               <p className="text-xs text-slate-500 mt-1">Max 5MB. JPG/PNG/GIF.</p>
//             </div>
//           </div> */}

//           <div>
//             <label className="block text-sm font-medium text-slate-700">Name</label>
//             <input
//               key="name-input" // Helps React track during resets
//               type="text"
//               value={editForm.name}
//               onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-300"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700">Email</label>
//             <input
//               key="email-input"
//               type="email"
//               value={editForm.email}
//               onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-300"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700">Mobile Number *</label>
//             <input
//               key="phone-input" // Helps React track during resets
//               type="tel"
//               value={editForm.phone}
//               onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-300"
//               placeholder="Enter mobile number"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700">Bio (optional)</label>
//             <textarea
//               key="bio-input"
//               value={editForm.bio}
//               onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
//               rows={4}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-300 resize-none"
//               maxLength={500}
//             />
//           </div>

//           {editError && <div className="text-red-600 bg-red-50 p-2 rounded">{editError}</div>}

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={editing}
//               className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg"
//             >
//               {editing ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               type="button"
//               onClick={cancelEdit}
//               className="py-3 px-5 bg-slate-200 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   // Normal profile view
//   return (
//     <>
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-green-50">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             {/* <div className="relative">
//               <img
//                 src={user.profilePhoto || photoPreviewUrl || DEFAULT_AVATAR}
//                 alt="profile"
//                 onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
//                 className="h-16 w-16 rounded-full object-cover border-4 border-green-100 shadow-sm"
//               />
//             </div> */}
//             <div>
//               <h3 className="text-xl font-bold text-slate-800">{user.name || 'N/A'}</h3>
//               <p className="text-sm text-green-600">{user.email || 'N/A'}</p>
//               <p className="text-sm text-slate-600 font-medium">{user.phone || 'N/A'}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={openEdit}
//               className="py-2 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg"
//             >
//               Edit Profile
//             </button>
//             {isModal && (
//               <button
//                 onClick={() => setIsProfileOpen ? setIsProfileOpen(false) : onClose?.()}
//                 className="py-2 px-4 bg-slate-200 rounded-lg"
//               >
//                 Close
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="p-3 border rounded-lg flex items-center justify-between">
//             <div>
//               <div className="text-xs text-slate-500">Role</div>
//               <div className="text-sm font-semibold text-green-700">{user.role || 'user'}</div>
//             </div>
//             <div/>
//           </div>

//           <div className="p-3 border rounded-lg text-center">
//             <div className="text-xs text-slate-500">Joined</div>
//             <div className="text-sm text-slate-600">
//               {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//             </div>
//           </div>

//           <div className="p-3 border rounded-lg flex items-center justify-center gap-3">
//             <div className="flex items-center gap-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`h-4 w-4 ${i < Math.round(userRating) ? 'text-yellow-400' : 'text-yellow-300'}`}
//                 />
//               ))}
//             </div>
//             <div className="text-sm font-semibold text-green-700">{userRating.toFixed(1)}/5</div>
//             <div className="text-xs text-slate-500">({ratingCount})</div>
//           </div>
//         </div>

//         {/* Rating form (inline) */}
//         {showRatingForm && selectedBookingForRating && (
//           <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <div>
//                 <div className="text-sm font-semibold text-green-800">Rate cook: {selectedBookingForRating.assignedCookName}</div>
//                 <div className="text-xs text-slate-600">Booking #{selectedBookingForRating._id?.slice(-6).toUpperCase()}</div>
//               </div>
//               <button
//                 className="text-slate-600"
//                 onClick={() => { setShowRatingForm(false); setSelectedBookingForRating(null); }}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="flex items-center gap-2 mb-3">
//               {[...Array(5)].map((_, i) => (
//                 <button
//                   key={i}
//                   type="button"
//                   onClick={() => setTempRating(i + 1)}
//                   className={`p-1 rounded ${i < tempRating ? 'text-yellow-400' : 'text-yellow-300'}`}
//                 >
//                   <Star className="h-6 w-6" />
//                 </button>
//               ))}
//             </div>

//             <textarea
//               value={ratingComment}
//               onChange={(e) => setRatingComment(e.target.value)}
//               rows={3}
//               placeholder="Share a quick review (optional)..."
//               className="w-full p-2 border rounded mb-3"
//               maxLength={500}
//             />

//             <div className="flex gap-2">
//               <button
//                 onClick={submitRating}
//                 disabled={submittingRating}
//                 className="px-3 py-2 bg-green-600 text-white rounded"
//               >
//                 {submittingRating ? 'Submitting...' : 'Submit Rating'}
//               </button>
//               <button
//                 onClick={() => { setShowRatingForm(false); setSelectedBookingForRating(null); }}
//                 className="px-3 py-2 bg-slate-200 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Bookings area */}
//         <div className="border-t pt-6">
//           <div className="flex items-center justify-between mb-4">
//             <h4 className="text-lg font-semibold flex items-center gap-2">
//               <Utensils className="h-5 w-5 text-green-600" /> My Bookings
//             </h4>
//             <div className="flex gap-2">
//               <button
//                 onClick={handleBookDemo}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md"
//               >
//                 Book Demo Day
//               </button>
//             </div>
//           </div>

//           {loadingBookings ? (
//             <div className="text-center py-8 text-slate-500">
//               <RefreshCw className="h-6 w-6 animate-spin mx-auto text-green-600" />
//               <div>Loading bookings...</div>
//             </div>
//           ) : errorBookings ? (
//             <div className="p-4 bg-red-50 rounded border border-red-100 text-red-700">
//               <div className="flex items-center justify-between">
//                 <div>{errorBookings}</div>
//                 <button onClick={fetchBookings} className="px-3 py-1 bg-red-600 text-white rounded">Retry</button>
//               </div>
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="text-center p-6 bg-slate-50 rounded">
//               <Utensils className="h-12 w-12 text-slate-400 mx-auto mb-3" />
//               <div className="text-sm text-slate-600 mb-3">No bookings yet.</div>
//               <button onClick={handleBookDemo} className="px-4 py-2 bg-green-600 text-white rounded">Book Now</button>
//             </div>
//           ) : (
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {bookings.map((b) => (
//                 <div key={b._id} className="p-4 bg-white border rounded-lg flex items-center justify-between shadow-sm">
//                   <div>
//                     <div className="text-sm font-semibold text-slate-800">Booking #{b._id?.slice(-6).toUpperCase()}</div>
//                     <div className="text-xs text-slate-500">
//                       {b.date ? new Date(b.date).toLocaleDateString() : 'Date N/A'} • {b.planDuration || 'Plan N/A'}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {b.status === 'approved' && <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">APPROVED</span>}
//                     {b.status === 'pending' && <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">PENDING</span>}
//                     {b.status === 'rejected' && <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-semibold">REJECTED</span>}

//                     <button
//                       onClick={() => openBookingDetails(b)}
//                       className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded"
//                     >
//                       <Eye className="inline h-4 w-4 mr-1" /> Details
//                     </button>

//                     {/* Rate button */}
//                     {b.status === 'completed' && !isRated(b._id) && (
//                       <button
//                         onClick={() => openRateForm(b)}
//                         className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded"
//                       >
//                         Rate Cook
//                       </button>
//                     )}
//                     {b.status === 'completed' && isRated(b._id) && (
//                       <div className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded">Rated</div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Booking details modal */}
//       {showBookingDetails && selectedBookingDetails && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
//           <div className="max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-xl">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Booking Details</h3>
//               <button onClick={closeBookingDetails} className="text-2xl text-slate-600">×</button>
//             </div>
//             <div className="p-6 space-y-3">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <div className="text-sm text-slate-500">Booking</div>
//                   <div className="font-semibold text-slate-800">#{selectedBookingDetails._id?.slice(-6).toUpperCase()}</div>
//                 </div>
//                 <div>
//                   <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
//                     selectedBookingDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
//                     selectedBookingDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-slate-100 text-slate-800'
//                   }`}>{(selectedBookingDetails.status || 'N/A').toUpperCase()}</span>
//                 </div>
//               </div>

//               <div className="space-y-2 text-sm text-slate-700">
//                 <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-green-600" /> {selectedBookingDetails.date ? new Date(selectedBookingDetails.date).toLocaleDateString() : 'N/A'}</div>
//                 <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-green-600" /> {selectedBookingDetails.time || selectedBookingDetails.serviceStartTime ? (selectedBookingDetails.serviceStartTime ? new Date(selectedBookingDetails.serviceStartTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : selectedBookingDetails.time) : 'N/A'}</div>
//                 <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-green-600" /><div>{selectedBookingDetails.address || 'N/A'}</div></div>
//                 <div className="flex items-start gap-2"><Utensils className="h-4 w-4 text-green-600" /><div>{selectedBookingDetails.mealPreference || 'N/A'}</div></div>
//                 {selectedBookingDetails.assignedCookName && <div className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-green-600" /> <div className="font-semibold text-green-700">Cook: {selectedBookingDetails.assignedCookName}</div></div>}
//                 {selectedBookingDetails.notes && <div><div className="text-xs text-slate-500">Notes</div><div className="italic text-slate-600">{selectedBookingDetails.notes}</div></div>}
//               </div>

//               {/* Rate from modal */}
//               {selectedBookingDetails.assignedCookName && selectedBookingDetails.status === 'completed' && !isRated(selectedBookingDetails._id) && (
//                 <div className="pt-4">
//                   <button
//                     onClick={() => { closeBookingDetails(); openRateForm(selectedBookingDetails); }}
//                     className="w-full py-2 bg-yellow-100 text-yellow-800 rounded"
//                   >
//                     Rate this cook
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Profile;











// 19-11-2025
// cookhub-frontend/src/components/profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, Clock, MapPin, Utensils, CalendarDays,
  UserCheck, X, Edit3
} from 'lucide-react';

import EditProfile from './EditProfile';

const Profile = ({ user, setIsProfileOpen, onClose, onUpdateUser }) => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [userRating, setUserRating] = useState(0);

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tempRating, setTempRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const [showEditProfile, setShowEditProfile] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const handleClose = () => {
    if (setIsProfileOpen) setIsProfileOpen(false);
    if (onClose) onClose();
  };

  const fetchBookings = async () => {
    if (!user?._id) return;
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoadingBookings(false); }
  };

  const fetchUserRating = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/users/${user._id}/ratings`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const { averageRating = 0 } = await res.json();
        setUserRating(averageRating);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchUserRating();
    }
  }, [user]);

  const openRatingForm = (booking) => {
    if (!booking.assignedCook || !['completed', 'approved'].includes(booking.status)) {
      alert('You can only rate completed services');
      return;
    }
    setSelectedBooking(booking);
    setTempRating(0);
    setHoveredRating(0);
    setRatingComment('');
    setShowRatingForm(true);
  };

  const handleSubmitRating = async () => {
    if (!tempRating) return;
    setSubmittingRating(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/ratings/cooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          rating: tempRating,
          comment: ratingComment.trim() || null,
          cookId: selectedBooking.assignedCook,
          bookingId: selectedBooking._id
        })
      });
      if (!res.ok) throw new Error('Failed');
      alert('Rating submitted! ⭐');
      setShowRatingForm(false);
      setSelectedBooking(null);
      setTempRating(0);
      setRatingComment('');
      fetchUserRating();
    } catch (err) {
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A';
  const formatTime = (t) => t ? new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const formatBookingLabel = (booking) => {
    if (!booking) return 'N/A';
    if (booking.displayId || booking.displayId === 0) return `#${booking.displayId}`;
    return booking._id ? `#${booking._id.slice(-6).toUpperCase()}` : 'N/A';
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile-First Perfect Modal */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto pt-4 pb-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row min-h-0">

          {/* Close Button - Always visible & working */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2.5 shadow-xl transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Profile Sidebar (Top on mobile, Left on desktop) */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 md:p-8 flex-shrink-0 w-full md:w-96">
            <div className="text-center">
              <div className="relative inline-block">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-4 border-white/30 shadow-2xl" />
                ) : (
                  <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-white/30 flex items-center justify-center text-4xl md:text-5xl font-bold shadow-2xl">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg">
                  <Star className="h-5 w-5 fill-current" /> {userRating.toFixed(1)}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mt-6">{user.name}</h2>
              <p className="text-green-100 text-sm md:text-lg break-all mt-1">{user.email}</p>

              <div className="mt-6 space-y-4">
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-md">
                  <p className="text-sm opacity-90">Role</p>
                  <p className="font-bold text-lg">{user.role === 'cook' ? '🍳 Chef' : '👤 Customer'}</p>
                </div>
                <p className="text-xs md:text-sm text-center opacity-90">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-lg transition-all backdrop-blur flex items-center justify-center gap-3"
                >
                  <Edit3 className="h-6 w-6" /> Edit Profile
                </button>
                <button
                  onClick={() => { handleClose(); navigate('/booking'); }}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <Utensils className="h-6 w-6" /> Book a Demo Day
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Section - Perfect scroll on mobile */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Utensils className="h-8 w-8 text-green-600" /> My Bookings
            </h3>

            {/* Rating Form */}
            {showRatingForm && selectedBooking && (
              <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
                <h4 className="text-xl font-bold mb-2">Rate: <span className="text-green-700">{selectedBooking.assignedCookName}</span></h4>
                <div className="flex justify-center gap-4 mb-5">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setTempRating(star)}>
                      <Star className={`h-12 w-12 transition-all ${star <= (hoveredRating || tempRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} placeholder="Your experience..." className="w-full p-4 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 outline-none resize-none" rows="3" />
                <div className="flex gap-3 mt-5">
                  <button onClick={handleSubmitRating} disabled={submittingRating || tempRating === 0} className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl disabled:opacity-50 transition">
                    {submittingRating ? 'Submitting...' : 'Submit Rating'}
                  </button>
                  <button onClick={() => { setShowRatingForm(false); setSelectedBooking(null); setTempRating(0); setRatingComment(''); }} className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-medium transition">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Bookings List */}
            {loadingBookings ? (
              <div className="grid grid-cols-1 gap-5">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <Utensils className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <p className="text-2xl text-gray-600">No bookings yet!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-mono text-gray-500">{formatBookingLabel(booking)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${['completed','approved'].includes(booking.status) ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-green-600" /> {formatDate(booking.date)}</div>
                      <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-green-600" /> {formatTime(booking.time || booking.serviceStartTime)}</div>
                      <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-green-600" /> <span className="truncate">{booking.address || 'N/A'}</span></div>
                      <div className="flex items-center gap-3"><Utensils className="h-5 w-5 text-green-600" /> {booking.mealPreference}</div>
                      {booking.assignedCookName && (
                        <div className="pt-3 border-t flex items-center gap-2 text-green-700 font-semibold">
                          <UserCheck className="h-5 w-5" /> {booking.assignedCookName}
                        </div>
                      )}
                      {['completed','approved'].includes(booking.status) && booking.assignedCookName && (
                        <button onClick={() => openRatingForm(booking)} className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition">
                          ⭐ Rate This Cook
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <EditProfile user={user} onUpdateUser={(u) => { onUpdateUser?.(u); setShowEditProfile(false); }} onClose={() => setShowEditProfile(false)} />
        </div>
      )}
    </>
  );
};

export default Profile;