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
  showtimes: Showtime[];
}

interface Showtime {
  id: number;
  time: string;
  date: string;
  theater: string;
  availableSeats: number;
}

// Mock data
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "This",
    posterUrl: "https://via.placeholder.com/250x370?text=Movie+Poster",
    description: "This.",
    duration: 142,
    rating: "PG-13",
    showtimes: []
  },
  {
    id: 2,
    title: "That",
    posterUrl: "https://via.placeholder.com/250x370?text=Movie+Poster",
    description: "That.",
    duration: 115,
    rating: "R",
    showtimes: []
  },
  {
    id: 3,
    title: "Something else",
    posterUrl: "https://via.placeholder.com/250x370?text=Movie+Poster",
    description: "It sucks dont watch it.",
    duration: 95,
    rating: "PG",
    showtimes: []
  }
];

// CSS styles (copied from Home.tsx)
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
    position: relative;
    transition: color 0.3s ease;
  }

  header nav a:hover {
    color: var(--accent-color);
  }

  .ticket-button {
    background-color: var(--accent-color);
    color: var(--text-light);
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .ticket-button:hover {
    background-color: #cc0000;
    transform: translateY(-2px);
  }

  .movie-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .movie-card:hover {
    transform: translateY(-5px);
  }

  .movies-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  main {
    animation: fadeIn 0.5s ease-out forwards;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
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
  }
`;

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    setMovies(mockMovies);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div className="min-h-screen bg-black text-white w-full">
        <Navbar />
        <main className="py-16">
          <section className="movies-container px-4">
            <h2 className="text-3xl font-bold section-title text-white text-center mb-8">Now Showing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card w-full max-w-sm">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-white">{movie.title}</h3>
                    <div className="flex justify-between mb-2 text-sm text-gray-400">
                      <span>Runtime: {movie.duration} mins</span>
                      <p>Rating: {movie.rating}</p>
                    </div>
                    <p className="text-gray-300 mb-4">{movie.description}</p>
                    <button
                      className="w-full ticket-button"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    >
                      Select Showtimes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MovieList;
