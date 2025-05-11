import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark-lighter shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-primary transition">
          Sydney Events
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-300 hover:text-primary transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/#about" className="text-gray-300 hover:text-primary transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="text-gray-300 hover:text-primary transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 