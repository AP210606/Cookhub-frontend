import React from 'react';

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  isDark = false,
  className = '',
}) => {
  const baseStyles = isDark
    ? 'bg-zinc-800 border-zinc-600 text-gray-100 focus:ring-teal-500 focus:border-teal-500'
    : 'bg-white border-gray-300 text-gray-900 focus:ring-teal-500 focus:border-teal-500';

  return (
    <div className="space-y-2">
      <label htmlFor={name} className={`block text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${baseStyles} ${className}`}
      >
        {options.map((option, index) => {
          if (typeof option === 'string') {
            return (
              <option key={index} value={option} className={isDark ? 'bg-zinc-800 text-gray-100' : 'bg-white text-gray-900'}>
                {option || 'Select an option'}
              </option>
            );
          }
          return (
            <option key={index} value={option.value} className={isDark ? 'bg-zinc-800 text-gray-100' : 'bg-white text-gray-900'}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectField;








// import React from 'react';

// const SelectField = ({ label, name, value, onChange, options, required, isDark = false }) => (
//   <div>
//     <label htmlFor={name} className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>
//       {label} {required && <span className="text-red-300">*</span>}
//     </label>
//     <select
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm sm:text-sm transition duration-200 ease-in-out
//         ${isDark ? 'bg-green-600 border-green-500 text-white focus:ring-white focus:border-white' : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'}`}
//     >
//       {options.map((option, index) => (
//         <option key={index} value={option}>{option || 'Select an option'}</option>
//       ))}
//     </select>
//   </div>
// );

// export default SelectField;