import React from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
    />
  );
};

export default Input;
