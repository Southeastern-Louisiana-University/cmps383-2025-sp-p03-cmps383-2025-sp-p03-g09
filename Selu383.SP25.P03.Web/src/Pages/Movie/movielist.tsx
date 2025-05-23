import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { showtimeSchedule } from '../../Data/showtimeSchedule';

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
    --accent-color: #10b981;
    --text-light: #ffffff;
    --text-dark: #121212;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  * {
    color: var(--text-light);
    font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: geometricPrecision;
  }

  body {
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
    color: #ffffff;
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    margin-right: 8px;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.3);
  }

  .ticket-button:hover {
    background-color: #10b981;
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

  main {
    animation: fadeIn 0.5s ease-out forwards;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
    color: #ffffff;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.3);
  }

  .create-button:hover {
    background-color: #10b981;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .description {
  font-size: .92rem; 
  font-weight: 400;
  color: #ffffff !important; 
  line-height: 1.5;
  text-shadow: none;
}


  .admin-buttons {
    display: flex;
    gap: 10px;
    margin-top: 1rem;
  }

  .edit-button, .delete-button {
    font-weight: bold;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.25);
  }

  .edit-button {
    background-color: #555;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .edit-button:hover {
    background-color: #777;
  }

  .delete-button {
    background-color: #990000;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .delete-button:hover {
    background-color: #cc0000;
  }

  .modal-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #1e1e1e;
    padding: 2rem;
    border-radius: 10px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
    color: #ffffff !important;
    font-weight: 500;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .modal-buttons {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .modal-buttons button {
    padding: 10px 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .modal-buttons .confirm {
    background-color: #ff0000;
    color: white;
    border: none;
  }

  .modal-buttons .cancel {
    background-color: #333;
    color: white;
    border: none;
  }

  .view-link {
    font-size: 1.875rem;
    font-weight: 700;
    color: #ffffff;
    margin-left: 1rem;
    cursor: pointer;
    transition: color 0.3s ease;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .view-link:hover,
  .view-link.active {
    color: var(--accent-color);
  }
`;


const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [view, setView] = useState<'now' | 'upcoming'>('now');

  const navigate = useNavigate();
  const isAdmin = user?.roles.includes('Admin');

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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const confirmDelete = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const handleConfirmedDelete = async () => {
    if (!selectedMovie) return;
    try {
      const res = await fetch(`/api/movies/${selectedMovie.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m.id !== selectedMovie.id));
        setShowConfirmModal(false);
        setSelectedMovie(null);
      } else {
        alert('Failed to delete movie.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting.');
    }
  };

  const nowShowing = movies.filter((m) => new Date(m.releaseDate) <= new Date());
  const upcoming = movies.filter((m) => new Date(m.releaseDate) > new Date());

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-white w-full">
        <Navbar />
        <main className="py-16">
          <section className="movies-container">
          <div className="top-bar">
          <div>
            <h2 className="text-3xl font-bold inline">
              <span
                className={`view-link ${view === 'now' ? 'active' : ''}`}
                onClick={() => setView('now')}
              >
                Now Showing
              </span>
              <span
                className={`view-link ${view === 'upcoming' ? 'active' : ''}`}
                onClick={() => setView('upcoming')}
              >
                Upcoming
              </span>
            </h2>
          </div>

          {isAdmin && (
            <button className="create-button" onClick={() => navigate('/movies/create')}>
              + Add Movie
            </button>
          )}
        </div>


            {loading && <p className="text-center text-gray-400">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {(view === 'now' ? nowShowing : upcoming).map((movie) => (
              <div key={movie.id} className="movie-card mx-auto">
                <img
                  src={movie.posterUrl || 'https://via.placeholder.com/250x370?text=No+Image'}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-details">
                  <h3 className="text-2xl font-bold mb-2 text-white">{movie.title}</h3>
                  <div className="description">
                  <div className="text-sm text-gray-400 mb-2">
                    <span>Runtime: {movie.duration} mins</span> • <span>Rating: {movie.rating}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{movie.description}</p>
                  </div>
                  {view === 'now' ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-white font-medium">Select showtime:</span>
                      <div className="flex gap-4">
                        {(() => {
                          const loc = localStorage.getItem('selectedLocation');
                          let locationId = null;
                          try {
                            locationId = JSON.parse(loc ?? '{}').id;
                          } catch {
                            console.warn('Failed to parse selectedLocation');
                          }

                          if (!locationId) {
                            return (
                              <p className="text-red-400 font-bold">
                                Please select a location and refresh.
                              </p>
                            );
                          }

                          const matchedShowtimes = showtimeSchedule.filter(
                            (entry) =>
                              Number(entry.movieId) === Number(movie.id) &&
                              Number(entry.locationId) === Number(locationId)
                          );

                          return matchedShowtimes.map((entry, idx) => (
                            <button
                              key={idx}
                              className="ticket-button"
                              onClick={() =>
                                navigate(
                                  `/seat-test?movieId=${movie.id}&showtime=${encodeURIComponent(
                                    entry.time
                                  )}&locationId=${entry.locationId}&theaterId=${entry.theaterId}`
                                )
                              }
                            >
                              {new Date(entry.time).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-yellow-400 mt-2 font-semibold">
                      Releases on {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="admin-buttons">
                      <button
                        className="edit-button"
                        onClick={() => navigate(`/movies/${movie.id}/edit`)}
                      >
                        Modify
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => confirmDelete(movie)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>

      {showConfirmModal && selectedMovie && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Delete "{selectedMovie.title}"?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="confirm" onClick={handleConfirmedDelete}>
                Confirm
              </button>
              <button className="cancel" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieList;
