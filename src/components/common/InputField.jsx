import React from 'react';

const InputField = ({ label, type, name, value, onChange, required, isDark = false }) => (
  <div>
    <label htmlFor={name} className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>
      {label} {required && <span className="text-red-300">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm sm:text-sm transition duration-200 ease-in-out
        ${isDark ? 'bg-green-600 border-green-500 text-white placeholder-green-200 focus:ring-white focus:border-white' : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'}`}
    />
  </div>
);

export default InputField;