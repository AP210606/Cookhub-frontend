// file: cookhub-frontend/src/components/ui/ProfileCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Edit, Mail, Phone, MapPin, ClipboardList, User, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

// General helper for displaying profile details
const renderProfileDetails = (user, iconColor) => (
  <div className="text-left text-sm space-y-3">
    <p className="flex items-center text-slate-700">
      <Mail className={`h-4 w-4 mr-3 text-${iconColor}-500 flex-shrink-0`} />
      <span className="font-semibold text-slate-900 mr-2">Email:</span>
      <span className="truncate">{user.email || 'N/A'}</span>
    </p>
    <p className="flex items-center text-slate-700">
      <Phone className={`h-4 w-4 mr-3 text-${iconColor}-500 flex-shrink-0`} />
      <span className="font-semibold text-slate-900 mr-2">Phone:</span>
      <span className="truncate">{user.phone || 'N/A'}</span>
    </p>
    <p className="flex items-center text-slate-700">
      <MapPin className={`h-4 w-4 mr-3 text-${iconColor}-500 flex-shrink-0`} />
      <span className="font-semibold text-slate-900 mr-2">Base Location:</span>
      <span className="truncate">{user.location || 'N/A'}</span>
    </p>
  </div>
);

const ProfileCard = ({ user, handleLogout, themeColor = 'amber' }) => {
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const profileImageInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleImageChangeClick = () => profileImageInputRef.current?.click();

  const handleProfileImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file.');
        return;
      }

      setUploading(true);
      setUploadError('');

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', user._id); // Assume user has _id

        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/upload/profile-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setProfileImage(data.imageUrl); // Assume backend returns { imageUrl: '...' }
        localStorage.setItem('cookhubUser', JSON.stringify({ ...user, profileImageUrl: data.imageUrl })); // Update stored user
        console.log('Profile image uploaded:', data.imageUrl);
      } catch (err) {
        console.error('Upload error:', err);
        setUploadError(err.message || 'Failed to upload image.');
      } finally {
        setUploading(false);
        // Create temp URL for preview (revoke later if needed)
        objectUrlRef.current = URL.createObjectURL(file);
      }
    }
  };

  const headerIcon = themeColor === 'amber' ? ClipboardList : User;
  const headerTitle = themeColor === 'amber' ? 'My Details' : 'Cook Details';
  const roleColor = user?.role === 'cook' ? 'emerald' : 'amber'; // Role-specific color

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-4 transition-all duration-300">
      <div className="flex flex-col items-center text-center mb-8">
        {/* PROFILE IMAGE SECTION (with Upload Option) */}
        <div 
          className="relative w-28 h-28 mb-6 group cursor-pointer" 
          onClick={handleImageChangeClick}
          role="button"
          tabIndex={0}
          aria-label="Change profile image"
          onKeyDown={(e) => e.key === 'Enter' && handleImageChangeClick()}
        >
          <div className={`w-full h-full rounded-full overflow-hidden border-4 border-${themeColor}-500 shadow-xl flex items-center justify-center bg-slate-100 ring-4 ring-${themeColor}-100`}>
            {profileImage ? (
              <img src={profileImage} alt={`${user.name} Profile`} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className={`h-12 w-12 text-${themeColor}-600`} />
            )}
          </div>
          <input 
            type="file" 
            ref={profileImageInputRef} 
            onChange={handleProfileImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus-within:opacity-100"
            title="Change Profile Image"
          >
            <Edit className="h-6 w-6 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          {user.name || 'User Name'}
        </h3>
        <p className={`text-sm ${user?.role === 'cook' ? 'text-emerald-600' : 'text-amber-600'} font-medium`}>
          {user.role || 'Role N/A'}
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center">
          {React.createElement(headerIcon, { className: 'h-4 w-4 mr-2 text-slate-400' })}
          {headerTitle}
        </h4>
        {renderProfileDetails(user, roleColor)}
      </div>

      {uploadError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {uploadError}
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;