import React, { useState } from 'react';

const AdminEditProfile = ({ user, navigate }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    // Placeholder for API call to update admin profile
    console.log('Saving admin profile:', { name, email });
    navigate('/admin/profile');
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Edit Admin Profile</h1>
        {user ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => navigate('/admin/profile')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <p className="text-red-500">Admin data not available. Please log in.</p>
        )}
      </div>
    </section>
  );
};

export default AdminEditProfile;