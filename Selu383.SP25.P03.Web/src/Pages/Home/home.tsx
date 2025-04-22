import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { showtimeSchedule } from '../../Data/showtimeSchedule';

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
    background-color: #000000;
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0 0.25rem;
  }

  .hero-content {
    text-align: center;
  }

  .ticket-button {
    background-color: var(--accent-color);
    color: var(--text-light);
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    margin-right: 8px;
  }

  .ticket-button:hover {
    background-color: #10b981;
    transform: translateY(-2px);
  }

  .movie-poster {
    width: 240px;
    height: 360px;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .movie-poster:hover {
    transform: scale(1.03);
  }

  .movie-details {
    margin-top: 0.5rem;
    text-align: center;
  }

  .carousel-wrapper {
    position: relative;
    padding: 0 2rem;
  }

  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(30, 30, 30, 0.8);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
    cursor: pointer;
    z-index: 10;
  }

  .carousel-arrow.left {
    left: 0;
  }

  .carousel-arrow.right {
    right: 0;
  }

  .scroll-container {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding: 1rem 0;
    scrollbar-width: none;
  }

  .scroll-container::-webkit-scrollbar {
    display: none;
  }

  .scroll-snap-align-center {
    scroll-snap-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
  }

  .section-title {
    text-align: center;
    margin: 1rem 0 0.5rem;
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    .section-title {
      font-size: 1.5rem;
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        setLocations(data);

        const stored = localStorage.getItem("selectedLocation");
        if (stored) {
          const parsed = JSON.parse(stored);
          const valid = data.find((loc: Location) => loc.id === parsed.id);
          if (valid) {
            setSelectedLocation(valid);
            setShowLocationModal(false);
          } else {
            localStorage.removeItem("selectedLocation");
            setShowLocationModal(true);
          }
        } else {
          setShowLocationModal(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
    fetchLocations();
  }, []);

  // Infinite Scroll Setup
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || movies.length === 0) return;

    const cardWidth = 260; // poster + margin
    const initialScroll = cardWidth * 2; // skip 2 clones
    container.scrollLeft = initialScroll;

    const handleScroll = () => {
      const maxScroll = cardWidth * (movies.length + 2); // extended size

      if (container.scrollLeft <= 0) {
        container.scrollLeft = cardWidth * movies.length;
      } else if (container.scrollLeft >= maxScroll - cardWidth) {
        container.scrollLeft = cardWidth * 2;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [movies]);

  // Clone movies on both ends
  const extendedMovies = [
    ...movies.slice(-1),
    ...movies,
    ...movies.slice(0, -1),
  ];

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
                      localStorage.setItem('selectedLocation', JSON.stringify(loc));
                      setShowLocationModal(false);
                      window.dispatchEvent(new Event('storage'));
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

      <div className="min-h-screen bg-black w-full">
        <Navbar />

        <div className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Welcome to Lion's Den Cinema</h2>
          </div>
        </div>

        <main className="pb-10">
          <section className="movies-container">
            <h2 className="section-title text-white">🎬 Featured Movies</h2>
            <div className="carousel-wrapper">
              <button
                className="carousel-arrow left"
                onClick={() => {
                  const container = scrollRef.current;
                  if (container) container.scrollBy({ left: -260, behavior: 'smooth' });
                }}
              >
                ←
              </button>

              <div id="movie-scroll" ref={scrollRef} className="scroll-container">
                {extendedMovies.map((movie, idx) => (
                  <div key={idx} className="scroll-snap-align-center">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="movie-poster"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    />
                    <div className="movie-details">
                      <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                      <p className="text-sm text-gray-400">{movie.duration} mins • {movie.rating}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-arrow right"
                onClick={() => {
                  const container = scrollRef.current;
                  if (container) container.scrollBy({ left: 260, behavior: 'smooth' });
                }}
              >
                →
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
