import React from 'react';

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-dark-border bg-dark-bg py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Smart Waste Mapping Platform. Building Clean Smart Cities.</p>
        <div className="flex gap-6 font-semibold">
          <Link to="/privacy" className="hover:text-neon-teal transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-neon-teal transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-neon-teal transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
