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
  .signup-container {
    background: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
    width: 100%;
    max-width: 400px;
    text-align: center;
    animation: fadeIn 0.8s ease-in-out;
  }
  .signup-title {
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
  .signup-button {
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
  .signup-button:hover {
    background-color: #0e9e6e;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
          roles: ['User']
        })
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log('✅ Account created:', newUser);
        navigate('/login');
      } else {
        const errorResponse = await response.json().catch(() => ({})); // Catch if backend returns non-JSON error
        console.error('❌ Signup failed. Full error:', errorResponse);

        // Try to extract a better error message if possible
        if (errorResponse.errors) {
          setError('Signup failed: ' + Object.values(errorResponse.errors).join(', '));
        } else if (errorResponse.title) {
          setError('Signup failed: ' + errorResponse.title);
        } else {
          setError('Signup failed. Please check your input.');
        }
      }
    } catch (err) {
      console.error('❌ Unexpected error during signup:', err);
      setError('Unexpected error occurred during signup.');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-container">
        <h1 className="signup-title">Create an Account</h1>
        <form onSubmit={handleSignup}>
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="signup-button">Sign Up</button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Signup;
