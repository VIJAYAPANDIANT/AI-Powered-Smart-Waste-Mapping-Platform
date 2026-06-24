import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-dark-border py-8 text-center text-xs text-gray-500">
      <p>&copy; {new Date().getFullYear()} Smart Waste Mapping Platform. Building Clean Smart Cities.</p>
    </footer>
  );
};

export default Footer;
