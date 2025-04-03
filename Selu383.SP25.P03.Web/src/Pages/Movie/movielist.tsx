import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

// Movie interfaces
interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate: string;
  youtubeUrl: string;
}

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

const styles = `
  :root {
    --primary-color: #000000;
    --accent-color: #ff0000;
    --text-light: #ffffff;
    --text-dark: #121212;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  body {
    color: var(--text-light);
    background-color: var(--primary-color);
    margin: 0;
    padding: 0;
  }

  header {
    background-color: #121212;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  header nav a {
    transition: color 0.3s ease;
  }

  header nav a:hover {
    color: var(--accent-color);
  }

  .ticket-button {
    background-color: var(--accent-color);
    color: var(--text-light);
    padding: 8px 20px; /* Reduced padding to make buttons less tall */
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    margin-right: 8px; /* Added margin to space buttons farther apart */
  }

  .ticket-button:hover {
    background-color: #cc0000;
    transform: translateY(-2px);
  }

  .movie-card {
    display: flex;
    background-color: #1e1e1e;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: transform 0.3s ease;
    width: 100%;
    max-width: 1000px;
  }

  .movie-card:hover {
    transform: translateY(-5px);
  }

  .movie-poster {
    width: 250px;
    height: auto;
    object-fit: cover;
    flex-shrink: 0;
  }

  .movie-details {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .movies-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  main {
    animation: fadeIn 0.5s ease-out forwards;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }

  .cinema-logo {
    color: var(--accent-color);
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    gap: 24px;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      text-align: center;
    }

    .nav-links {
      margin-top: 1rem;
    }

    .movie-card {
      flex-direction: column;
    }

    .movie-poster {
      width: 100%;
      height: auto;
    }
  }
  .create-button {
    background-color: var(--accent-color);
    color: var(--text-light);
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .create-button:hover {
    background-color: #cc0000;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

`;

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/authentication/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user info');
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchMovies();
  }, []);

  const isAdmin = user?.roles.includes('Admin');

  return (
    <>
      <style>{styles}</style>

      <div className="min-h-screen bg-black text-white w-full">
        <Navbar />
        <main className="py-16">
          <section className="movies-container">
            <div className="top-bar">
              <h2 className="text-3xl font-bold text-white">Now Showing</h2>
            </div>

            {loading && <p className="text-center text-gray-400">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {movies.map((movie) => (
              <div key={movie.id} className="movie-card mx-auto">
                <img
                  src={movie.posterUrl || 'https://via.placeholder.com/250x370?text=No+Image'}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-details">
                  <h3 className="text-2xl font-bold mb-2 text-white">{movie.title}</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    <span>Runtime: {movie.duration} mins</span> • <span>Rating: {movie.rating}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{movie.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-white font-medium">Select showtime:</span>
                    <div className="flex gap-4">
                      {["12:00PM", "3:00PM", "6:00PM", "9:00PM"].map((time) => (
                        <button
                          key={time}
                          className="ticket-button"
                          onClick={() => navigate(`/movies/${movie.id}/purchase?showtime=${time}`)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
};

export default MovieList;