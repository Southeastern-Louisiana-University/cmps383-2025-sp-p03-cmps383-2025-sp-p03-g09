import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="p-4 bg-[#121212] shadow-md w-full">
  <div className="flex flex-col md:flex-row justify-between items-center w-full px-4">
    <h1 className="cinema-logo text-white text-2xl font-bold mb-2 md:mb-0">Lion's Den Cinema</h1>
    <nav className="nav-links flex gap-6 text-white">
      <Link to="/" className="hover:text-red-500">Home</Link>
      <Link to="/movies" className="hover:text-red-500">Movies</Link>
      <Link to="/food" className="hover:text-red-500">Food</Link>
      <Link to="/about" className="hover:text-red-500">About</Link>
    </nav>
  </div>
</header>

  );
};

export default Navbar;
