import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

interface Location {
  id: number;
  name: string;
  address: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const navigate = useNavigate();

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Load user
  useEffect(() => {
    fetch('/api/authentication/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser);
  }, []);

  // Load locations
  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.ok ? res.json() : [])
      .then(setLocations);
  }, []);

  // Load selected location from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('selectedLocation');
    if (stored) {
      setSelectedLocation(JSON.parse(stored));
    }
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/authentication/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    navigate('/');
  };

  const handleLocationChange = (loc: Location) => {
    localStorage.setItem('selectedLocation', JSON.stringify(loc));
    setSelectedLocation(loc);
    setShowLocationDropdown(false);
  };

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
            <Link to="/food" className="nav-link">Menu</Link>
            <Link to="/about" className="nav-link">About</Link>
          </div>
        </nav>

        {/* Right: User & Location */}
        <div className="navbar-controls">
          {/* Cart Link */}
          <Link to="/cart" className="cart-link">
            Cart
          </Link>

          {/* Location Dropdown */}
          <div className="location-select" ref={locationDropdownRef}>
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="location-button"
            >
              {selectedLocation ? selectedLocation.name : 'No Location Selected'}
            </button>
            {showLocationDropdown && (
              <div className="dropdown">
                {locations.map(loc => (
                  <button
                    key={loc.id}
                    className="dropdown-item"
                    onClick={() => handleLocationChange(loc)}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User/Login Dropdown */}
          <div className="navbar-user" ref={userDropdownRef}>
            {user ? (
              <>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="user-button"
                >
                  {user.userName}
                </button>
                {showUserDropdown && (
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

      </div>
    </header>
  );
};

export default Navbar;
