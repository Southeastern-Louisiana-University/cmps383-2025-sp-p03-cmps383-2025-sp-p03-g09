import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="p-4">
      <div className="container mx-auto flex justify-between items-center nav-container">
        <h1 className="cinema-logo">Lion's Den Cinema</h1>
        <nav className="nav-links">
          <Link to="/" className="text-red-500">Home</Link>
          <Link to="/movies" className="hover:text-red-500">Movies</Link>
          <a href="/food" className="hover:text-red-500">Food</a>
          <a href="/about" className="hover:text-red-500">About</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
