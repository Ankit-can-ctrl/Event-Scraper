import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-lighter text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Sydney Events</h3>
            <p className="mb-4">
              Discover the best events happening in Sydney. From concerts to art exhibitions,
              we've got you covered.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition">Home</Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-primary transition">About</Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-primary transition">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition">Facebook</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">Twitter</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Sydney Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 