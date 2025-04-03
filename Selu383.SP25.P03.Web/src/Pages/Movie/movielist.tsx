import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

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

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  return (
    <>
      <style>{`
        :root {
          --primary-color: #000000;
          --accent-color: #10b981;
          --text-light: #ffffff;
          --text-dark: #121212;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        body {
          background-color: var(--primary-color);
          color: var(--text-light);
        }

        .ticket-button {
          background-color: var(--accent-color);
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .ticket-button:hover {
          background-color: #468973;
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
          object-fit: cover;
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

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .create-button {
          background-color: var(--accent-color);
          color: white;
          padding: 10px 16px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .create-button:hover {
          background-color: #468973;
        }

        .admin-buttons {
          display: flex;
          gap: 10px;
          margin-top: 1rem;
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
          background-color: #336353;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .delete-button:hover {
          background-color: #468973;
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
      `}</style>

      <div className="min-h-screen bg-black text-white w-full">
        <Navbar />
        <main className="py-16">
          <section className="movies-container">
            <div className="top-bar">
              <h2 className="text-3xl font-bold text-white">Now Showing</h2>
              {isAdmin && (
                <button className="create-button" onClick={() => navigate('/movies/create')}>
                  + Create Movie
                </button>
              )}
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
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="ticket-button" onClick={() => navigate(`/movies/${movie.id}`)}>
                      Select Showtimes
                    </button>

                    {isAdmin && (
                      <div className="admin-buttons">
                        <button className="edit-button" onClick={() => navigate(`/movies/${movie.id}/edit`)}>
                          Modify
                        </button>
                        <button className="delete-button" onClick={() => confirmDelete(movie)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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
              <button className="confirm" onClick={handleConfirmedDelete}>Confirm</button>
              <button className="cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieList;
