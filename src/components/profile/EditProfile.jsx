// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const EditProfile = ({ user, onUpdateUser, onClose }) => {
//   const navigate = useNavigate();
//   const [name, setName] = useState(user?.name || '');
//   const [email, setEmail] = useState(user?.email || '');
//   const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const validateForm = () => {
//     if (!name.trim()) {
//       setError('Name is required');
//       return false;
//     }
//     if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
//       setError('Valid email is required');
//       return false;
//     }
//     setError('');
//     return true;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     const updatedUser = {
//       ...user,
//       name: name.trim(),
//       email: email.trim(),
//       profilePhoto: profilePhoto || user.profilePhoto,
//     };

//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/users/me`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedUser),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update profile');
//       }

//       const apiUser = await response.json();
//       updatedUser._id = apiUser._id;

//       localStorage.setItem('cookhubUser', JSON.stringify(updatedUser));

//       if (typeof onUpdateUser === 'function') {
//         onUpdateUser(updatedUser);
//       }

//       if (onClose) {
//         onClose();
//       } else {
//         navigate('/profile');
//       }
//     } catch (err) {
//       console.error('Update error:', err);
//       setError(err.message || 'Failed to save changes. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="text-center p-4">
//         <h3 className="text-xl font-bold text-slate-800 mb-4">Profile Not Found</h3>
//         <button
//           onClick={() => navigate('/')}
//           className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
//         >
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100 max-w-md mx-auto">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-2xl font-bold text-slate-800">Edit Profile</h3>
//         <button
//           onClick={onClose || (() => navigate('/profile'))}
//           className="text-slate-500 hover:text-teal-600 text-sm"
//         >
//           ×
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo</label>
//           <div className="relative">
//             <img
//               src={profilePhoto || '/default-avatar.png'}
//               alt="Profile Preview"
//               className="h-20 w-20 rounded-full object-cover border-2 border-teal-200 mx-auto mb-2"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handlePhotoChange}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             />
//           </div>
//           <p className="text-xs text-slate-500 text-center">Click to change photo</p>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
//             placeholder="Enter your full name"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
//             placeholder="Enter your email"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 mt-6">
//         <button
//           onClick={handleSave}
//           disabled={isLoading}
//           className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
//         >
//           {isLoading ? 'Saving...' : 'Save Changes'}
//         </button>
//         <button
//           onClick={onClose || (() => navigate('/profile'))}
//           className="w-full py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;











// 19-11-2025
// cookhub-frontend/src/components/profile/EditProfile.jsx
import React, { useState } from 'react';

const EditProfile = ({ user, onUpdateUser, onClose }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Cloudinary upload (free & instant)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'cookhub'); // ← Ye preset bana lo Cloudinary me (free)

    const res = await fetch('https://api.cloudinary.com/v1_1/dob2sglr6/image/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo max 5MB allowed');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProfilePhoto(url);
      alert('Photo uploaded successfully! Now save changes.');
    } catch (err) {
      alert('Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Name & Email required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const payload = { name: name.trim(), email: email.trim() };

      // Sirf tabhi photo bhejo jab user ne nayi photo dali ho
      if (profilePhoto && profilePhoto !== user.profilePhoto) {
        payload.profilePhoto = profilePhoto;
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Update failed');
      }

      const updatedUser = await res.json();
      localStorage.setItem('cookhubUser', JSON.stringify(updatedUser));
      onUpdateUser?.(updatedUser);
      onClose?.();
      alert('Profile updated successfully! 🎉');
    } catch (err) {
      setError(err.message || 'Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-6 text-gray-500 hover:text-gray-900 text-3xl font-light">
        ×
      </button>

      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Profile</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5 text-center font-medium">
          {error}
        </div>
      )}

      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={profilePhoto || '/default-avatar.png'}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-green-200 shadow-lg"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">Click to change (max 5MB)</p>
      </div>

      {/* Name & Email */}
      <div className="space-y-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition text-lg"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;