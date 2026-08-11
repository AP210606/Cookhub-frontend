import React from 'react';

const NavButton = ({ icon, text, onClick, bgColor, hoverBgColor }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 text-white ${bgColor} px-4 py-2 rounded-full text-sm font-semibold shadow-md ${hoverBgColor} transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default NavButton;