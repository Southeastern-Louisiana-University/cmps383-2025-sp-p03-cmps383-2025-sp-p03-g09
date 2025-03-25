import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// TypeScript interfaces
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
    posterUrl: "https://via.placeholder.com/250x370?text=This",
    description: "This.",
    duration: 142,
    rating: "PG-13",
    showtimes: []
  },
  {
    id: 2,
    title: "That",
    posterUrl: "https://via.placeholder.com/250x370?text=That",
    description: "That.",
    duration: 115,
    rating: "R",
    showtimes: []
  },
  {
    id: 3,
    title: "Something else",
    posterUrl: "https://via.placeholder.com/250x370?text=Something+Else",
    description: "It sucks don't watch it.",
    duration: 95,
    rating: "PG",
    showtimes: []
  }
];

// CSS Styles
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

  .hero-section {
    position: relative;
    background-color: #000000;
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 1;
  }

 .poster-scroll-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: max-content;
  display: flex;
  animation: scrollPosters 60s linear infinite;
  z-index: 0;
  opacity: 0.15;
}

@keyframes scrollPosters {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}


  .poster-scroll-bg img {
    height: 100%;
    object-fit: cover;
    margin-right: 10px;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
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
    max-width: 100%;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    margin-bottom: 2rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scrollPosters {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
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

  .hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
      text-align: center;
    }

    .nav-links {
      margin-top: 1rem;
    }

    .hero-title {
      font-size: 2rem;
    }
  }
`;

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMovies(mockMovies);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div className="min-h-screen bg-black w-full border-4 border-red-500">
        <Navbar />

        {/* Hero Section */}
        <div className="hero-section">
        <div className="poster-scroll-bg">
  {/* Original set */}
  <img src="https://m.media-amazon.com/images/I/716P1xCmnPL.jpg" alt="Interstellar" />
  <img src="https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg" alt="Forrest Gump" />
  <img src="https://m.media-amazon.com/images/I/81D+KJkO4SL.jpg" alt="Fight Club" />
  <img src="https://m.media-amazon.com/images/I/71sj8Yt20qL.jpg" alt="Gladiator" />
  <img src="https://m.media-amazon.com/images/I/71PfZFFz9yL._AC_UF894,1000_QL80_.jpg" alt="The Matrix" />
  <img src="https://m.media-amazon.com/images/I/51E+o6036kL._AC_UF894,1000_QL80_.jpg" alt="Joker" />
  <img src="https://www.yourdecoration.com/cdn/shop/files/grupo-erik-gpe5310-marvel-avengers-endgame-one-sheet-poster-61x91-5cm_4d72ce92-9678-4dc1-9e3f-dbb95b3f2c34.jpg?v=1721043138" alt="Avengers: Endgame" />

  {/* Duplicated set for seamless loop */}
  <img src="https://m.media-amazon.com/images/I/716P1xCmnPL.jpg" alt="Interstellar" />
  <img src="https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg" alt="Forrest Gump" />
  <img src="https://m.media-amazon.com/images/I/81D+KJkO4SL.jpg" alt="Fight Club" />
  <img src="https://m.media-amazon.com/images/I/71sj8Yt20qL.jpg" alt="Gladiator" />
  <img src="https://m.media-amazon.com/images/I/71PfZFFz9yL._AC_UF894,1000_QL80_.jpg" alt="The Matrix" />
  <img src="https://m.media-amazon.com/images/I/51E+o6036kL._AC_UF894,1000_QL80_.jpg" alt="Joker" />
  <img src="https://www.yourdecoration.com/cdn/shop/files/grupo-erik-gpe5310-marvel-avengers-endgame-one-sheet-poster-61x91-5cm_4d72ce92-9678-4dc1-9e3f-dbb95b3f2c34.jpg?v=1721043138" alt="Avengers: Endgame" />
</div>

          <div className="hero-content">
            <h2 className="hero-title">Welcome to Lion's Den Cinema</h2>
          </div>
        </div>

        {/* Main Content */}
        <main className="py-16">
          <section className="movies-container px-4">
            <h2 className="text-3xl font-bold section-title text-white">Featured Movies</h2>
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

export default Home;
