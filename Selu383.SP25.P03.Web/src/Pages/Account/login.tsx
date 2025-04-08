import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  body {
    font-family: 'Inter', sans-serif;
    background-image: url('https://images.wallpaperscraft.com/image/single/film_creative_minimalism_74358_1920x1080.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    backdrop-filter: blur(3px);
  }

  .login-container {
    background: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
    width: 100%;
    max-width: 400px;
    text-align: center;
    animation: fadeIn 0.8s ease-in-out;
  }

  .login-title {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #10b981;
  }

  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border-radius: 4px;
    border: none;
    background: #282828;
    color: #fff;
    font-size: 1rem;
  }

  .login-button {
    width: 100%;
    padding: 10px;
    background-color: #10b981;
    color: white;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .login-button:hover {
    background-color: #10b981;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/authentication/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password }),
      credentials: 'include'
    });

    if (response.ok) {
      const user = await response.json();
      console.log('Logged in:', user);
      navigate('/');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-container">
        <h1 className="login-title">Lion's Den Login</h1>
        <form onSubmit={handleLogin}>
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={userName}
            required
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
