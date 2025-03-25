import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/authentication/me', { credentials: 'include' })
      .then(response => response.ok ? response.json() : null)
      .then(setUser);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/authentication/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
    navigate('/');
  };

  return (
    <header className="p-4 bg-[#121212] shadow-md w-full">
      <div className="flex items-center justify-between w-full px-4 flex-wrap md:flex-nowrap">
        <h1 className="cinema-logo text-red-600 text-2xl font-bold">Lion's Den Cinema</h1>

        <nav className="nav-links flex gap-6 items-center text-white mx-auto">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/movies" className="hover:text-red-500">Movies</Link>
          <Link to="/food" className="hover:text-red-500">Food</Link>
          <Link to="/about" className="hover:text-red-500">About</Link>
        </nav>

        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white hover:text-red-500"
              >
                {user.userName}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-[#1e1e1e] rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="text-white hover:text-red-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
