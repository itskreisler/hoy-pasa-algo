import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
};

export default Button;
