import React from 'react';
import Navbar from '../../components/Navbar';


interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate: string;
  posterUrl?: string; 
}


const movie: Movie = {
  id: 1,
  title: "This",
  description: "An epic journey into the unknown.",
  duration: 142,
  rating: "PG-13",
  releaseDate: "2025-03-12",
  posterUrl: "https://via.placeholder.com/250x370?text=Movie+Poster"
};

// Custom CSS
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

  .movie-detail-container {
    max-width: 1000px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0 1rem;
  }

  @media(min-width: 768px) {
    .movie-detail-container {
      flex-direction: row;
    }
  }

  .movie-poster {
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
  }

  .movie-info {
    flex: 1;
  }

  .info-label {
    font-weight: bold;
    color: var(--accent-color);
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

const MovieDetail: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="movie-detail-container">
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
          )}

          <div className="movie-info">
            <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
            <p className="mb-4 text-gray-300">{movie.description}</p>

            <p><span className="info-label">Duration:</span> {movie.duration} minutes</p>
            <p><span className="info-label">Rating:</span> {movie.rating}</p>
            <p>
              <span className="info-label">Release Date:</span>{" "}
              {new Date(movie.releaseDate).toDateString()}
            </p>

            <button className="ticket-button mt-6">Buy Tickets</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
