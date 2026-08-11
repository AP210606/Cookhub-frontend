import React from 'react';

const TextAreaField = ({ label, name, value, onChange, rows, required, isDark = false }) => (
  <div>
    <label htmlFor={name} className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>
      {label} {required && <span className="text-red-300">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm sm:text-sm transition duration-200 ease-in-out
        ${isDark ? 'bg-green-600 border-green-500 text-white placeholder-green-200 focus:ring-white focus:border-white' : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'}`}
    ></textarea>
  </div>
);

export default TextAreaField;











// import React from 'react';

// const TextAreaField = ({
//   label,
//   name,
//   value,
//   onChange,
//   required = false,
//   placeholder,
//   rows = 4,
//   isDark = false,
//   className = '',
// }) => {
//   const baseStyles = isDark
//     ? 'bg-zinc-800 border-zinc-600 text-gray-100 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500'
//     : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500';

//   return (
//     <div className="space-y-2">
//       <label htmlFor={name} className={`block text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <textarea
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={placeholder}
//         rows={rows}
//         className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-vertical ${baseStyles} ${className}`}
//       />
//     </div>
//   );
// };

// export default TextAreaField;