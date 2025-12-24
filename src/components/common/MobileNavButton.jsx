import React from 'react';

const MobileNavButton = ({ icon, text, onClick, bgColor, hoverBgColor }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 text-white ${bgColor} px-6 py-3 rounded-full text-base font-semibold shadow-md w-3/4 justify-center ${hoverBgColor} transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default MobileNavButton;