import React from 'react';

const AdminProfile = ({ user, navigate }) => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Admin Profile</h1>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role || 'N/A'}</p>
            <button
              onClick={() => navigate('/admin/profile/edit')}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <p className="text-red-500">Admin data not available. Please log in.</p>
        )}
      </div>
    </section>
  );
};

export default AdminProfile;