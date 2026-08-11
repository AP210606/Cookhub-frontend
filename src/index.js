// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


// src/index.js
// cookhub-app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/admin-dashboard" element={<App />} />
        <Route path="/admin/details/:entityType/:id" element={<App currentPage="details" />} />
        <Route path="/profile" element={<App currentPage="profile" />} />
        <Route path="/profile/edit" element={<App currentPage="profile/edit" />} />
        <Route path="/admin/profile" element={<App currentPage="admin-profile" />} />
        <Route path="/admin/profile/edit" element={<App currentPage="admin-profile/edit" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();