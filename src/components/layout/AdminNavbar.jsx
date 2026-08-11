import React from 'react';

const AdminNavbar = ({ navigate, isMobileMenuOpen, setIsMobileMenuOpen, user, handleLogout }) => {
  const handleNavigation = (page) => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };

  // Get initials or fallback if no name
  const getInitials = () => {
    if (!user?.name) return 'A';
    const names = user.name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
  };

  return (
    <nav className="fixed top-0 w-full bg-teal-800 text-white z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="CookHub Admin Logo" className="h-10 w-auto mr-2" />
          <span className="text-2xl font-bold">CookHub Admin</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => handleNavigation('admin-dashboard')} className="hover:text-teal-200">Dashboard</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="hover:text-teal-200">Bookings</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="hover:text-teal-200">Users</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="hover:text-teal-200">Settings</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="hover:text-teal-200">Messages</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="hover:text-teal-200">Cooks</button>
          <div className="relative group">
            <button className="flex items-center space-x-2 hover:text-teal-200 focus:outline-none">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => { e.target.src = '/default-avatar.png'; }} // Fallback image
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>
              )}
              <span>{user.name || 'Admin Profile'}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-teal-900 rounded-md shadow-lg hidden group-hover:block">
              <a href="/admin/profile" onClick={(e) => { e.preventDefault(); handleNavigation('/admin/profile'); }} className="block px-4 py-2 text-white hover:bg-teal-700">View Profile</a>
              <a href="/admin/profile/edit" onClick={(e) => { e.preventDefault(); handleNavigation('/admin/profile/edit'); }} className="block px-4 py-2 text-white hover:bg-teal-700">Edit Profile</a>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-white hover:bg-teal-700">Logout</button>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-teal-900 p-4 space-y-2">
          <button onClick={() => handleNavigation('admin-dashboard')} className="block w-full text-left hover:text-teal-200">Dashboard</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="block w-full text-left hover:text-teal-200">Bookings</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="block w-full text-left hover:text-teal-200">Users</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="block w-full text-left hover:text-teal-200">Settings</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="block w-full text-left hover:text-teal-200">Messages</button>
          <button onClick={() => handleNavigation('admin-dashboard')} className="block w-full text-left hover:text-teal-200">Cooks</button>
          <button onClick={() => handleNavigation('/admin/profile')} className="block w-full text-left hover:text-teal-200">View Profile</button>
          <button onClick={() => handleNavigation('/admin/profile/edit')} className="block w-full text-left hover:text-teal-200">Edit Profile</button>
          <button onClick={handleLogout} className="block w-full text-left hover:text-teal-200">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;