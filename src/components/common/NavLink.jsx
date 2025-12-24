import React from 'react';

const NavLink = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="text-white hover:text-green-200 font-medium transition duration-300 ease-in-out px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <span>{text}</span>
  </button>
);

export default NavLink;