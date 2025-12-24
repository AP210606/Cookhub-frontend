// import React from 'react';

// const UserNavbar = ({ navigate, isMobileMenuOpen, setIsMobileMenuOpen, user, handleLogout, homeRef, servicesRef, cooksRef, pricingRef, rulesRef, contactRef, bookingRef }) => {
//   const handleNavigation = (page, ref = null) => {
//     navigate(page, { current: ref });
//     setIsMobileMenuOpen(false);
//   };

//   // Get initials or fallback if no name
//   const getInitials = () => {
//     if (!user?.name) return 'U';
//     const names = user.name.split(' ');
//     return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
//   };

//   return (
//     <nav className="fixed top-0 w-full bg-teal-600 text-white z-50 shadow-md">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <div className="flex items-center">
//           <img src="/assets/logo.png" alt="CookHub Logo" className="h-10 w-auto mr-2" />
//           <span className="text-2xl font-bold">CookHub</span>
//         </div>
//         <div className="hidden md:flex space-x-6">
//           <button onClick={() => handleNavigation('home', homeRef)} className="hover:text-teal-200">Home</button>
//           <button onClick={() => handleNavigation('home', servicesRef)} className="hover:text-teal-200">Services</button>
//           <button onClick={() => handleNavigation('home', cooksRef)} className="hover:text-teal-200">Our Cooks</button>
//           <button onClick={() => handleNavigation('home', pricingRef)} className="hover:text-teal-200">Pricing</button>
//           <button onClick={() => handleNavigation('home', rulesRef)} className="hover:text-teal-200">Rules</button>
//           <button onClick={() => handleNavigation('home', contactRef)} className="hover:text-teal-200">Contact</button>
//           {user ? (
//             <>
//               <button onClick={() => handleNavigation('booking')} className="hover:text-teal-200">Book Now</button>
//               <div className="relative group">
//                 <button className="flex items-center space-x-2 hover:text-teal-200 focus:outline-none">
//                   {user.profilePhoto ? (
//                     <img
//                       src={user.profilePhoto}
//                       alt="Profile"
//                       className="h-8 w-8 rounded-full object-cover"
//                       onError={(e) => { e.target.src = '/default-avatar.png'; }} // Fallback image
//                     />
//                   ) : (
//                     <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
//                       {getInitials()}
//                     </div>
//                   )}
//                   <span>{user.name || 'Profile'}</span>
//                 </button>
//                 <div className="absolute right-0 mt-2 w-48 bg-teal-700 rounded-md shadow-lg hidden group-hover:block">
//                   <a href="/profile" onClick={(e) => { e.preventDefault(); handleNavigation('/profile'); }} className="block px-4 py-2 text-white hover:bg-teal-600">View Profile</a>
//                   <a href="/profile/edit" onClick={(e) => { e.preventDefault(); handleNavigation('/profile/edit'); }} className="block px-4 py-2 text-white hover:bg-teal-600">Edit Profile</a>
//                   <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-white hover:bg-teal-600">Logout</button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <button onClick={() => handleNavigation('auth')} className="hover:text-teal-200">Login</button>
//           )}
//         </div>
//         <div className="md:hidden">
//           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
//             </svg>
//           </button>
//         </div>
//       </div>
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-teal-700 p-4 space-y-2">
//           <button onClick={() => handleNavigation('home', homeRef)} className="block w-full text-left hover:text-teal-200">Home</button>
//           <button onClick={() => handleNavigation('home', servicesRef)} className="block w-full text-left hover:text-teal-200">Services</button>
//           <button onClick={() => handleNavigation('home', cooksRef)} className="block w-full text-left hover:text-teal-200">Our Cooks</button>
//           <button onClick={() => handleNavigation('home', pricingRef)} className="block w-full text-left hover:text-teal-200">Pricing</button>
//           <button onClick={() => handleNavigation('home', rulesRef)} className="block w-full text-left hover:text-teal-200">Rules</button>
//           <button onClick={() => handleNavigation('home', contactRef)} className="block w-full text-left hover:text-teal-200">Contact</button>
//           {user ? (
//             <>
//               <button onClick={() => handleNavigation('booking')} className="block w-full text-left hover:text-teal-200">Book Now</button>
//               <button onClick={() => handleNavigation('/profile')} className="block w-full text-left hover:text-teal-200">View Profile</button>
//               <button onClick={() => handleNavigation('/profile/edit')} className="block w-full text-left hover:text-teal-200">Edit Profile</button>
//               <button onClick={handleLogout} className="block w-full text-left hover:text-teal-200">Logout</button>
//             </>
//           ) : (
//             <button onClick={() => handleNavigation('auth')} className="block w-full text-left hover:text-teal-200">Login</button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default UserNavbar;