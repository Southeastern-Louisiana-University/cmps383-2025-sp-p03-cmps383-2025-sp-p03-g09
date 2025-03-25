import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // 👈 Make sure you import this!

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/authentication/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/authentication/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
    <div className="navbar-container">
      {/* Left: Logo */}
      <Link to="/" className="navbar-logo">Lion's Den Cinema</Link>
  
      {/* Center: Nav Links */}
      <nav className="navbar-links-wrapper">
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
          <Link to="/food" className="nav-link">Food</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
      </nav>
  
      {/* Right: User or Login */}
      <div className="navbar-user" ref={dropdownRef}>
        {user ? (
          <>
            <button onClick={() => setShowDropdown(!showDropdown)} className="user-button">
              {user.userName}
            </button>
            {showDropdown && (
              <div className="dropdown">
                <button className="dropdown-item" onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </div>
    </div>
  </header>
  );
};

export default Navbar;
