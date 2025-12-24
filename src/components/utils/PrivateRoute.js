import React from 'react';
import { Navigate } from 'react-router-dom';

// Assume you have an auth check function (replace with your logic, e.g., check localStorage token)
const isAuthenticated = () => !!localStorage.getItem('authToken');

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default PrivateRoute;