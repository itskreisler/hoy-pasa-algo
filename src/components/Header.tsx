import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4">
      <nav className="flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">
          Hoy Pasa Algo
        </a>
        <ul className="flex items-center space-x-4">
          <li>
            <a href="/explore">Explore</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/register">Register</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
