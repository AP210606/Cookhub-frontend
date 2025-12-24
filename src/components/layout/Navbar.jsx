// Updated Navbar.jsx - No changes needed, but confirming the props are used correctly
import React from 'react';
import { Menu, X, LogOut, UserCircle, BookOpen } from 'lucide-react';
import cookhubLogo from '../../Cookhub-logo/CookHub2.png';
import NavLink from '../common/NavLink';
import NavButton from '../common/NavButton';
import MobileNavLink from '../common/MobileNavLink';
import MobileNavButton from '../common/MobileNavButton';

const Navbar = ({ navigate, isMobileMenuOpen, setIsMobileMenuOpen, user, handleLogout, homeRef, servicesRef, cooksRef, pricingRef, rulesRef, contactRef, bookingRef, isProfileOpen, setIsProfileOpen }) => {
  // Hide the global navbar when on the cook dashboard page to avoid duplicating headers
  try {
    const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    if (path.includes('cook-dashboard')) {
      return null;
    }
  } catch (e) {
    // If window is not available or any error occurs, continue rendering the navbar
    console.warn('Navbar: could not access window.location to determine route', e);
  }
  const handleNavLinkClick = (ref, page) => {
    if (page) {
      navigate(page); // For separate pages like auth or booking
    } else {
      navigate('home', ref); // For sections on the home page
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  // Define regular navigation items for non-admin users
  const regularNavItems = [
    { text: "Home", action: () => handleNavLinkClick(homeRef) },
    { text: "Services", action: () => handleNavLinkClick(servicesRef) },
    { text: "Our Cooks", action: () => handleNavLinkClick(cooksRef) },
    { text: "Pricing", action: () => handleNavLinkClick(pricingRef) },
    { text: "Rules", action: () => handleNavLinkClick(rulesRef) },
    { text: "Contact", action: () => handleNavLinkClick(contactRef) },
  ];

  // Safely get the first name for the logout button
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <nav className="bg-green-800 shadow-lg py-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          <button
            onClick={() => handleNavLinkClick(homeRef)}
            className="text-2xl font-bold text-white hover:text-green-200 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-0"
          >
            <img
              src={cookhubLogo}
              alt="Cookhub Logo"
              className="h-20 w-auto"
            />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {user?.role === 'admin' ? (
            // Admin navigation
            <>
              <NavLink text="Dashboard" onClick={() => navigate('admin-dashboard')} />
              <NavLink text="Manage Cooks" onClick={() => navigate('manageCooks')} />
              <NavButton
                icon={<LogOut size={18} />}
                text={`Logout (${firstName})`}
                bgColor="bg-red-600"
                hoverBgColor="hover:bg-red-700"
                onClick={handleLogout}
              />
            </>
          ) : user?.role === 'coordinator' ? (
            // Coordinator navigation
              <>
              <NavLink text="Coordinator Panel" onClick={() => navigate('coordinator-dashboard')} />
              <NavLink text="Assignments" onClick={() => navigate('assignments')} />
              <NavButton
                icon={<LogOut size={18} />}
                text={`Logout (${firstName})`}
                bgColor="bg-red-600"
                hoverBgColor="hover:bg-red-700"
                onClick={handleLogout}
              />
            </>
          ) : (
            // Regular user navigation
            <>
              {regularNavItems.map((item, index) => (
                <NavLink key={index} text={item.text} onClick={item.action} />
              ))}
              {user ? (
                <>
                  {/* Profile Avatar Button */}
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="relative p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                    title="Profile"
                  >
                    <UserCircle size={28} className="text-white" />
                  </button>
                  <NavButton
                    icon={<LogOut size={18} />}
                    text={`Logout (${firstName})`}
                    bgColor="bg-red-600"
                    hoverBgColor="hover:bg-red-700"
                    onClick={handleLogout}
                  />
                </>
              ) : (
                <NavButton
                  icon={<UserCircle size={18} />}
                  text="Login"
                  bgColor="bg-green-600"
                  hoverBgColor="hover:bg-green-700"
                  onClick={() => navigate('auth')}
                />
              )}
              <NavButton
                icon={<BookOpen size={18} />}
                text="Book Now"
                bgColor="bg-orange-500"
                hoverBgColor="hover:bg-orange-600"
                onClick={() => navigate('booking')}
              />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-2 transition duration-300 ease-in-out"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Rendered conditionally and

      {/* Mobile Navigation Menu - Rendered conditionally and fixed to avoid duplicate navbar */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-700 mt-16 py-4 shadow-inner">
          <div className="flex flex-col items-center space-y-4">
            {user?.role === 'admin' ? (
              <>
                <MobileNavButton
                  icon={<LogOut size={20} />}
                  text={`Logout (${firstName})`}
                  bgColor="bg-red-600"
                  hoverBgColor="hover:bg-red-700"
                  onClick={handleLogout}
                />
              </>
            ) : user?.role === 'coordinator' ? (
              <>
                <MobileNavLink text="Coordinator Panel" onClick={() => navigate('coordinator-dashboard')} />
                <MobileNavLink text="Assignments" onClick={() => navigate('assignments')} />
                <MobileNavButton
                  icon={<LogOut size={20} />}
                  text={`Logout (${firstName})`}
                  bgColor="bg-red-600"
                  hoverBgColor="hover:bg-red-700"
                  onClick={handleLogout}
                />
              </>
            ) : (
              <>
                {regularNavItems.map((item, index) => (
                  <MobileNavLink key={index} text={item.text} onClick={item.action} />
                ))}
                {user ? (
                  <>
                    {/* Mobile Profile Button */}
                    <MobileNavButton
                      icon={<UserCircle size={20} />}
                      text="Profile"
                      bgColor="bg-blue-600"
                      hoverBgColor="hover:bg-blue-700"
                      onClick={() => setIsProfileOpen(true)}
                    />
                    <MobileNavButton
                      icon={<LogOut size={20} />}
                      text={`Logout (${firstName})`}
                      bgColor="bg-red-600"
                      hoverBgColor="hover:bg-red-700"
                      onClick={handleLogout}
                    />
                  </>
                ) : (
                  <MobileNavButton
                    icon={<UserCircle size={20} />}
                    text="Login"
                    bgColor="bg-green-600"
                    hoverBgColor="hover:bg-green-700"
                    onClick={() => navigate('auth')}
                  />
                )}
                <MobileNavButton
                  icon={<BookOpen size={20} />}
                  text="Book Now"
                  bgColor="bg-orange-500"
                  hoverBgColor="hover:bg-orange-600"
                  onClick={() => navigate('booking')}
                />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;