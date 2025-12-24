import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/constants';
import InputField from '../common/InputField';
import { useNavigate } from 'react-router-dom';

const AuthSection = ({ handleLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setMessage('');
    setIsError(false);
  };

  useEffect(() => {
    resetForm();
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const endpoint = isLogin
      ? `${API_BASE_URL}/auth/login`
      : `${API_BASE_URL}/auth/register`;

    const payload = isLogin
      ? { email: email.trim(), password }
      : { name, email: email.trim(), password, assignedLocations: ['India'] };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data = text ? JSON.parse(text) : {};

      if (response.ok) {
        setMessage(data.message);
        setIsError(false);

        if (isLogin && data.token) {
          handleLogin(data.user, data.token);

          // ✅ Redirect based on user role (use hyphenated routes)
          const role = data.user?.role;
          if (role === 'cook') navigate('/cook-dashboard');
          else if (role === 'admin') navigate('/admin-dashboard');
          else navigate('/user-dashboard');
        }

        if (!isLogin) {
          // If registration returned a token, auto-login and redirect
          if (data.token) {
            handleLogin(data.user, data.token);
            const role = data.user?.role;
            if (role === 'cook') navigate('/cook-dashboard');
            else if (role === 'admin') navigate('/admin-dashboard');
            else navigate('/user-dashboard');
          } else {
            // Fall back to switching to login view
            setIsLogin(true);
            setPassword('');
          }
        } else {
          resetForm();
        }
      } else {
        setMessage(data.message || data.error || 'Invalid credentials');
        setIsError(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage(error.message || 'Network error: Could not connect to the server.');
      setIsError(true);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg px-8">
      <h2 className="text-4xl font-bold text-indigo-800 text-center mb-10">
        {isLogin ? 'Login to Cookhub' : 'Register for Cookhub'}
      </h2>

      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        {message && (
          <div
            className={`text-center py-3 rounded-md mb-6 ${
              isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <InputField
              label="Full Name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              if (value.startsWith(' ')) {
                alert('Email cannot start with a space');
                return;
              }
              setEmail(value);
            }}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
        {isLogin && (
          <p className="mt-4 text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
            >
              Forgot Password?
            </button>
          </p>
        )}

      </div>
    </section>
  );
};

export default AuthSection;



















// import React, { useState, useEffect } from 'react';
// import { API_BASE_URL } from '../utils/constants';
// import InputField from '../common/InputField';

// const AuthSection = ({ handleLogin }) => {
//   const [isLogin, setIsLogin] = useState(true); // true for login, false for register
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   // Clears form fields and messages
//   const resetForm = () => {
//     setName('');
//     setEmail('');
//     setPassword('');
//     setMessage('');
//     setIsError(false);
//   };

//   }, [isLogin]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(''); // Clear previous messages
//     setIsError(false);

//     const endpoint = isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;
//     const payload = isLogin ? { email: email.trim(), password } : { name, email: email.trim(), password };

//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message || (isLogin ? 'Login successful!' : 'Registration successful! Please login.'));
//         setIsError(false);
//         if (isLogin || data.token) { // If login or successful registration with token
//           handleLogin(data.user, data.token); // Log in the user
//         }
//         // For registration, we don't clear email/password immediately
//         // so user can easily switch to login with the same details
//         if (isLogin) {
//           resetForm(); // Clear form only on successful login
//         } else {
//           // After successful registration, switch to login view
//           setIsLogin(true);
//           // Keep email pre-filled for easy login after registration
//           setPassword(''); // Clear password after registration
//         }
//       } else {
//         setMessage(data.message || 'An unexpected error occurred.');
//         setIsError(true);
//       }
//     } catch (error) {
//       console.error('Auth error:', error);
//       setMessage('Network error: Could not connect to the server. Please ensure the backend is running and accessible.');
//       setIsError(true);
//     }
//   };

//   return (
//     <section className="py-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg px-8">
// export default AuthSection;
//         {isLogin ? 'Login to Cookhub' : 'Register for Cookhub'}
//       </h2>
//       <p className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
//         {isLogin ? 'Access your personalized services.' : 'Join Cookhub today and get access to homemade meals!'}
//       </p>

//       <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
//         {message && (
//           <div className={`text-center py-3 rounded-md mb-6 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isLogin && (
//             <InputField label="Full Name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
//           )}
//           <InputField 
//             label="Email Address" 
//             type="email" 
//             name="email" 
//             value={email} 
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value.startsWith(" ")) {
//                 alert("Email cannot start with a space");
//                 return;
//               }
//               setEmail(value);
//             }} 
//             required 
//           />
//           <InputField label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
//           >
//             {isLogin ? 'Login' : 'Register'}
//           </button>
//         </form>
//         <p className="mt-6 text-center text-gray-600">
//           {isLogin ? "Don't have an account? " : "Already have an account? "}
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
//           >
//             {isLogin ? 'Register here' : 'Login here'}
//           </button>
//         </p>
//       </div>
//     </section>
//   );
// };

// export default AuthSection;