import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';


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

interface Location {
  id: number;
  name: string;
  address: string;
}

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ').reduce((acc: any, cookie) => {
    const [key, val] = cookie.split('=');
    acc[key] = val;
    return acc;
  }, {});
  return cookies[name] ? decodeURIComponent(cookies[name]) : null;
};

const styles = `
  :root {
    --primary-color: #000000;
    --accent-color: #10b981;
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
    background-color: #468973;
    transform: translateY(-2px);
  }

  .movie-card {
    display: flex;
    background-color: #1e1e1e;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .movie-card:hover {
    transform: translateY(-5px);
  }

  .movie-poster {
    width: 250px;
    height: 100%;
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

  main {
    animation: fadeIn 0.5s ease-out forwards;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
  }

  .hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: #1e1e1e;
    padding: 2rem;
    border-radius: 10px;
    color: white;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: var(--card-shadow);
  }

  .modal-content ul li {
    margin-bottom: 1rem;
  }

  .modal-content ul li:last-child {
    margin-bottom: 0;
  }
`;

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [posterUrls, setPosterUrls] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data.slice(0, 3));
        setPosterUrls(data.map((m: Movie) => m.posterUrl).filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        console.error(err);
      }
    };

    const stored = getCookie('selectedLocation');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedLocation(parsed);
      setShowLocationModal(false);
    }

    fetchMovies();
    fetchLocations();
  }, []);

  return (
    <>
      <style>{styles}</style>

      {showLocationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold mb-4">Choose The Location You Will Be Visiting:</h2>
            <ul>
              {locations.map((loc) => (
                <li key={loc.id}>
                  <button
                    className="ticket-button w-full"
                    onClick={() => {
                      setSelectedLocation(loc);
                      localStorage.setItem('selectedLocation', JSON.stringify(loc)); // optional
                      setCookie('selectedLocation', JSON.stringify(loc), 30); // expires in 30 days
                      setShowLocationModal(false);
                    }}
                  >
                    {loc.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black w-full border-4 border-red-500">
        <Navbar />

        <div className="hero-section">
          <div className="poster-scroll-bg">
            {[...posterUrls, ...posterUrls].map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Poster ${idx}`}
                onError={(e) => {
                  e.currentTarget.src = "/fallback.jpg";
                }}
              />
            ))}
          </div>

          <div className="hero-content">
            <h2 className="hero-title">Welcome to Lion's Den Cinema</h2>
          </div>
        </div>

        <main className="py-16">
          <section className="movies-container px-4">
            <h2 className="text-3xl font-bold section-title text-white">Featured Movies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card w-full max-w-4xl mx-auto">
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                  <div className="movie-details">
                    <h3 className="text-xl font-bold mb-2 text-white">{movie.title}</h3>
                    <div className="text-sm text-gray-400 mb-2">
                      <span>Runtime: {movie.duration} mins</span> • <span>Rating: {movie.rating}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{movie.description}</p>
                    <button
                      className="ticket-button mt-auto w-max"
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
