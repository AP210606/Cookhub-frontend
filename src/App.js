// import React, { useState, useEffect, useRef } from 'react';
// import Navbar from './components/layout/Navbar';
// import Footer from './components/layout/Footer';
// import HomeSection from './components/sections/HomeSection';
// import ServicesSectionContent from './components/sections/ServicesSectionContent';
// import MeetOurCertifiedCooks from './components/sections/MeetOurCertifiedCooks';
// import TransparentPricingSection from './components/sections/TransparentPricingSection';
// import RulesAndRegulationsSection from './components/sections/RulesAndRegulationsSection';
// import GetInTouchSection from './components/sections/GetInTouchSection';
// import BookingFormSection from './components/forms/BookingFormSection';
// import AuthSection from './components/forms/AuthSection';
// import AdminDashboard from './components/admin/AdminDashboard';
// import PaymentSection from './components/payment/PaymentSection';
// import DetailsPage from './components/admin/DetailsPage';
// // import Home from './components/Home';
// import { useNavigate } from 'react-router-dom';

// const App = () => {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState('home');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
  
//   const homeRef = useRef(null);
//   const servicesRef = useRef(null);
//   const cooksRef = useRef(null);
//   const pricingRef = useRef(null);
//   const rulesRef = useRef(null);
//   const contactRef = useRef(null);
//   const bookingRef = useRef(null);
  
//   const [paymentDetails, setPaymentDetails] = useState(null);

//   useEffect(() => {
//     // token key standardized to 'authToken'
//     const storedToken = localStorage.getItem('authToken');
//     const storedUser = localStorage.getItem('cookhubUser');
//     if (storedToken && storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//         setToken(storedToken);
//         if (parsedUser?.role === 'admin') {
//           navigate('/admin-dashboard');
//           setCurrentPage('admin-dashboard');
//         }
//       } catch (error) {
//         console.error("Failed to parse stored user data:", error);
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('cookhubUser');
//       }
//     }
//   }, [navigate]);

//   const handleLogin = (userData, userToken) => {
//     setUser(userData);
//     setToken(userToken);
//     localStorage.setItem('cookhubUser', JSON.stringify(userData));
//     localStorage.setItem('authToken', userToken);
//     if (userData?.role === 'admin') {
//       navigate('/admin-dashboard');
//       setCurrentPage('admin-dashboard');
//     } else {
//       navigate('/');
//       setCurrentPage('home');
//       setTimeout(() => {
//         homeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }, 100);
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('cookhubUser');
//     localStorage.removeItem('authToken');
//     setCurrentPage('home');
//     navigate('/');
//     setTimeout(() => {
//       homeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   const navigateTo = (page, params = null) => {
//     setIsMobileMenuOpen(false);
//     if (page === 'home' && params && params.current) {
//       setCurrentPage('home');
//       setTimeout(() => {
//         params.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }, 100);
//     } else {
//       setCurrentPage(page);
//       setPaymentDetails(params);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const renderPage = () => {
//     if (currentPage === 'auth') {
//       return <AuthSection handleLogin={handleLogin} />;
//     }
//     if (currentPage === 'admin-dashboard' && user?.role === 'admin') {
//       return <AdminDashboard token={token} />;
//     }
//     if (currentPage === 'booking') {
//       return <BookingFormSection token={token} user={user} navigate={navigateTo} />;
//     }
//     if (currentPage === 'payment') {
//       return <PaymentSection navigate={navigateTo} bookingDetails={paymentDetails} />;
//     }
//     // Inside renderPage in App.js
//     if (currentPage === 'details' && user?.role === 'admin') {
//       return <DetailsPage token={token} />;
//     }
//     return (
//       <>
//         <HomeSection navigate={navigateTo} homeRef={homeRef} pricingRef={pricingRef} servicesRef={servicesRef} cooksRef={cooksRef} rulesRef={rulesRef} contactRef={contactRef} />
//         <section ref={servicesRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
//           <ServicesSectionContent />
//         </section>
//         <section ref={cooksRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
//           <MeetOurCertifiedCooks />
//         </section>
//         <section ref={pricingRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
//           <TransparentPricingSection navigate={navigateTo} bookingRef={bookingRef} />
//         </section>
//         <section ref={rulesRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
//           <RulesAndRegulationsSection />
//         </section>
//         <section ref={contactRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
//           <GetInTouchSection />
//         </section>
//       </>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-inter text-gray-800 antialiased flex flex-col">
//       <Navbar
//         navigate={navigateTo}
//         isMobileMenuOpen={isMobileMenuOpen}
//         setIsMobileMenuOpen={setIsMobileMenuOpen}
//         user={user}
//         handleLogout={handleLogout}
//         homeRef={homeRef}
//         servicesRef={servicesRef}
//         cooksRef={cooksRef}
//         pricingRef={pricingRef}
//         rulesRef={rulesRef}
//         contactRef={contactRef}
//         bookingRef={bookingRef}
//       />
//       <main className="flex-grow container mx-auto px-0 sm:px-0 lg:px-0 py-0 pt-20">
//         {renderPage()}
//       </main>
//       <Footer navigate={navigateTo} servicesRef={servicesRef} cooksRef={cooksRef} contactRef={contactRef} />
//     </div>
//   );
// };

// export default App;









// 21-8-2025
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeSection from './components/profile/sections/HomeSection';
import ServicesSectionContent from './components/profile/sections/ServicesSectionContent';
import MeetOurCertifiedCooks from './components/profile/sections/MeetOurCertifiedCooks';
import TransparentPricingSection from './components/profile/sections/TransparentPricingSection';
import RulesAndRegulationsSection from './components/profile/sections/RulesAndRegulationsSection';
import GetInTouchSection from './components/profile/sections/GetInTouchSection';
import BookingFormSection from './components/forms/BookingFormSection';
import AuthSection from './components/forms/AuthSection';
import ForgotPassword from './components/forms/ForgotPassword';
import ResetPassword from './components/forms/ResetPassword';
import AdminDashboard from './components/admin/AdminDashboard';
import PaymentSection from './components/payment/PaymentSection';
import DetailsPage from './components/admin/DetailsPage';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import AdminProfile from './components/profile/AdminProfile';
import AdminEditProfile from './components/profile/AdminEditProfile';
import LocationCoordinator  from './components/admin/LocationCoordinator';
import Login from './components/admin/Login';
import CookDashboard from './components/dashboards/CookDashboard';
// import LocationCoordinatorWrapper from './components/coordinator/LocationCoordinatorWrapper'; // Assuming this exists
// import ProfileSection from './components/profile/ProfileSection';
import { useNavigate, useParams, Routes, Route, Navigate } from 'react-router-dom';
// D:\DNG\cookhub-app-anil\cookhub-frontend\src\profile\ProfileSection.js

const App = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const cooksRef = useRef(null);
  const pricingRef = useRef(null);
  const rulesRef = useRef(null);
  const contactRef = useRef(null);
  const bookingRef = useRef(null);
  
  const [paymentDetails, setPaymentDetails] = useState(null);
  

  useEffect(() => {
    // token key standardized to 'authToken'
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('cookhubUser');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        if (parsedUser?.role === 'admin') {
          navigate('/admin-dashboard');
          setCurrentPage('admin-dashboard');
        } else if (parsedUser?.role === 'coordinator') {
          navigate('/coordinator-dashboard');
          setCurrentPage('coordinator-dashboard');
        }else if (parsedUser?.role === 'cook') {
          navigate('/cook-dashboard');
          setCurrentPage('cook-dashboard');
        } else {
          setCurrentPage('home');
        }
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('cookhubUser');
      }
    }
  }, [navigate]);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('cookhubUser', JSON.stringify(userData));
    localStorage.setItem('authToken', userToken);
    if (userData?.role === 'admin') {
      navigate('/admin-dashboard');
      setCurrentPage('admin-dashboard');
    } else if (userData?.role === 'coordinator') {
      navigate('/coordinator-dashboard');
      setCurrentPage('coordinator-dashboard');
    }else if (userData?.role === 'cook') {
          navigate('/cook-dashboard');
          setCurrentPage('cook-dashboard');
    }else {
      navigate('/');
      setCurrentPage('home');
      setTimeout(() => {
        homeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cookhubUser');
    localStorage.removeItem('authToken');
    setCurrentPage('home');
    navigate('/');
    setTimeout(() => {
      homeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const navigateTo = (page, params = null) => {
    setIsMobileMenuOpen(false);
    // Keep SPA state in sync with router URL so direct Routes (eg: /booking) update correctly.
    // Map common page keys to router paths when available.
    const pageToPath = {
      home: '/',
      booking: '/booking',
      payment: '/payment',
      profile: '/profile',
      'admin-dashboard': '/admin-dashboard',
      'coordinator-dashboard': '/coordinator-dashboard',
      'cook-dashboard': '/cook-dashboard',
    };

    // If navigating to home with a ref (scroll behavior), handle that specially.
    if (page === 'home' && params && params.current) {
      setCurrentPage('home');
      // update URL to root so Route changes and renderPage() is used
      if (pageToPath.home) navigate(pageToPath.home);
      setTimeout(() => {
        params.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    // Update current page state and router path if mapped.
    setCurrentPage(page);
    setPaymentDetails(params);
    if (pageToPath[page]) navigate(pageToPath[page]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wrapper function to handle LocationCoordinator with params
  const LocationCoordinatorWrapper = () => {
    const { location } = useParams();
    return <LocationCoordinator location={location} token={token} />;
  };

  const isDashboardPage = ['admin-dashboard', 'coordinator-dashboard', 'cook-dashboard', 'admin-location'].includes(currentPage);

  const renderPage = () => {
    if (currentPage === 'auth') {
      return <AuthSection handleLogin={handleLogin} />;
    }
    if (currentPage === 'admin-dashboard' && user?.role === 'admin') {
      return <AdminDashboard token={token} handleLogout={handleLogout} />;
    }
    if (currentPage === 'coordinator-dashboard' && user?.role === 'coordinator') {
      return <LocationCoordinatorWrapper />;
    }
    if (currentPage === 'booking') {
      return <BookingFormSection token={token} user={user} navigate={navigateTo} />;
    }
    if (currentPage === 'payment') {
      return <PaymentSection navigate={navigateTo} bookingDetails={paymentDetails} />;
    }
    if (currentPage === 'details' && user?.role === 'admin') {
      return <DetailsPage token={token} />;
    }
    if (currentPage === 'profile' && user && user.role !== 'admin' && user.role !== 'coordinator') {
      return <Profile user={user} navigate={navigate} />;
    }
    if (currentPage === 'profile/edit' && user && user.role !== 'admin' && user.role !== 'coordinator') {
      return <EditProfile user={user} navigate={navigate} onUpdateUser={setUser} />;
    }
    if (currentPage === 'admin-profile' && user?.role === 'admin') {
      return <AdminProfile user={user} navigate={navigateTo} />;
    }
    if (currentPage === 'admin-profile/edit' && user?.role === 'admin') {
      return <AdminEditProfile user={user} navigate={navigateTo} />;
    }
    // New condition for LocationCoordinator
    if (currentPage === 'admin-location' && user?.role === 'admin') {
      return <LocationCoordinatorWrapper />;
    }
    if (currentPage === 'cook-dashboard' && user?.role === 'cook') {
      return <CookDashboard logout={handleLogout} />;
    }
    return (
      <>
        <HomeSection navigate={navigateTo} homeRef={homeRef} pricingRef={pricingRef} servicesRef={servicesRef} cooksRef={cooksRef} rulesRef={rulesRef} contactRef={contactRef} />
        <section ref={servicesRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
          <ServicesSectionContent />
        </section>
        <section ref={cooksRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
          <MeetOurCertifiedCooks />
        </section>
        <section ref={pricingRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
          <TransparentPricingSection navigate={navigateTo} bookingRef={bookingRef} />
        </section>
        <section ref={rulesRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
          <RulesAndRegulationsSection />
        </section>
        <section ref={contactRef} className="py-16 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8 mt-16">
          <GetInTouchSection />
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800 antialiased flex flex-col">
      {currentPage !== 'admin-dashboard' && currentPage !== 'coordinator-dashboard' && (
        <Navbar
          navigate={navigateTo}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          user={user}
          handleLogout={handleLogout}
          homeRef={homeRef}
          servicesRef={servicesRef}
          cooksRef={cooksRef}
          pricingRef={pricingRef}
          rulesRef={rulesRef}
          contactRef={contactRef}
          bookingRef={bookingRef}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
      )}

      {/* Profile modal (opens when Navbar triggers setIsProfileOpen) */}
      {isProfileOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              aria-label="Close profile"
            >
              ✕
            </button>
            <Profile user={user} navigate={navigate} setIsProfileOpen={setIsProfileOpen} />
          </div>
        </div>
      )}

      <main
        className={`flex-grow ${isDashboardPage ? 'w-full px-0' : 'container mx-auto px-4 sm:px-6 lg:px-8'} ${
          isDashboardPage ? 'pt-4' : 'pt-20'
        }`}
      >
        <Routes>
          <Route path="/" element={renderPage()} />
          <Route path="/auth" element={<AuthSection handleLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard token={token} handleLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/coordinator-dashboard" element={user?.role === 'coordinator' ? <LocationCoordinatorWrapper /> : <Navigate to="/" />} />
          <Route path="/booking" element={<BookingFormSection token={token} user={user} navigate={navigateTo} />} />
          <Route path="/payment" element={<PaymentSection navigate={navigateTo} bookingDetails={paymentDetails} />} />
          <Route path="/details" element={user?.role === 'admin' ? <DetailsPage token={token} /> : <Navigate to="/" />} />
          <Route path="/profile" element={user && user.role !== 'admin' && user.role !== 'coordinator' ? <Profile user={user} navigate={navigate} /> : <Navigate to="/" />} />
          <Route path="/profile/edit" element={user && user.role !== 'admin' && user.role !== 'coordinator' ? <EditProfile user={user} navigate={navigate} onUpdateUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/admin-profile" element={user?.role === 'admin' ? <AdminProfile user={user} navigate={navigate} /> : <Navigate to="/" />} />
          <Route path="/admin-profile/edit" element={user?.role === 'admin' ? <AdminEditProfile user={user} navigate={navigate} /> : <Navigate to="/" />} />
          <Route path="/admin/location/:location" element={user?.role === 'admin' ? <LocationCoordinatorWrapper /> : <Navigate to="/" />} />
          <Route path="/coordinator-dashboard/:location?" element={user?.role === 'coordinator' ? <LocationCoordinatorWrapper /> : <Navigate to="/" />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/dashboard"
            element={
              localStorage.getItem('authToken') ? (
                (() => {
                  try {
                    const storedUserStr = localStorage.getItem('cookhubUser');
                    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : {};
                    if (storedUser.role === 'cook' || storedUser.role === 'coordinator') {
                      return (
                        <CookDashboard 
                          user={storedUser} // Pass initial user as fallback
                          logout={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('cookhubUser');
                            window.location.href = '/login';
                          }} 
                        />
                      );
                    } else {
                      return <Navigate to="/" />;
                    }
                  } catch (error) {
                    console.error('Invalid stored user data:', error);
                    localStorage.removeItem('cookhubUser');
                    return <Navigate to="/login" />;
                  }
                })()
              ) : (
                <Navigate to="/login" />
              )
            }
          />

<Route
  path="/cook-dashboard"
  element={
    (() => {
      const token = localStorage.getItem('authToken');
      if (!token) return <Navigate to="/login" />;
      try {
        const storedUserStr = localStorage.getItem('cookhubUser');
        const storedUser = storedUserStr ? JSON.parse(storedUserStr) : {};
        if (storedUser.role === 'cook' || storedUser.role === 'coordinator') {
          return (
            <CookDashboard 
              user={storedUser} // Pass initial user as fallback
              logout={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('cookhubUser');
                window.location.href = '/login';
              }} 
            />
          );
        } else {
          return <Navigate to="/" />;
        }
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem('cookhubUser');
        return <Navigate to="/login" />;
      }
    })()
  }
/>






          {/* <Route path="/" element={<HomeSection />} />
          <Route path="/profile" element={<ProfileSection />} /> */}
          {/* Redirect unauthorized users or handle other routes */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          {/* <Route path="/coordinator-dashboard" element={user?.role === 'coordinator' ? <LocationCoordinatorWrapper /> : <Navigate to="/" />} />
  <Route path="/admin/location/:location" element={user?.role === 'admin' ? <LocationCoordinatorWrapper /> : <Navigate to="/" />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer navigate={navigateTo} servicesRef={servicesRef} cooksRef={cooksRef} contactRef={contactRef} />
    </div>
  );
};

export default App;