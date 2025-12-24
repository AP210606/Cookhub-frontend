import React from 'react';

const MobileNavLink = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-3 text-white hover:text-green-200 font-medium w-full justify-center py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out"
  >
    <span>{text}</span>
  </button>
);

export default MobileNavLink;