import React, { useState, useEffect } from 'react';

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
    posterUrl: "/api/placeholder/250/370",
    description: "This.",
    duration: 142,
    rating: "PG-13",
    showtimes: [
      { id: 101, time: "14:30", date: "2025-03-12", theater: "Theater 1", availableSeats: 45 },
      { id: 102, time: "17:00", date: "2025-03-12", theater: "Theater 3", availableSeats: 30 },
      { id: 103, time: "20:15", date: "2025-03-12", theater: "Theater 1", availableSeats: 60 }
    ]
  },
  {
    id: 2,
    title: "That",
    posterUrl: "/api/placeholder/250/370",
    description: "That.",
    duration: 115,
    rating: "R",
    showtimes: [
      { id: 201, time: "15:45", date: "2025-03-12", theater: "Theater 2", availableSeats: 25 },
      { id: 202, time: "18:30", date: "2025-03-12", theater: "Theater 4", availableSeats: 40 },
      { id: 203, time: "21:00", date: "2025-03-12", theater: "Theater 2", availableSeats: 55 }
    ]
  },
  {
    id: 3,
    title: "Something else",
    posterUrl: "/api/placeholder/250/370",
    description: "It sucks dont watch it.",
    duration: 95,
    rating: "PG",
    showtimes: [
      { id: 301, time: "13:15", date: "2025-03-12", theater: "Theater 5", availableSeats: 35 },
      { id: 302, time: "16:00", date: "2025-03-12", theater: "Theater 5", availableSeats: 20 },
      { id: 303, time: "19:45", date: "2025-03-12", theater: "Theater 3", availableSeats: 50 }
    ]
  }
];

// CSS Styles
const styles = `
  /* Base styles */
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

  /* Header styles */
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

  /* Hero section */
  .hero-section {
    background-color: #000000;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* Button styles */
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

  /* Movie card styles */
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

  /* Center movie section */
  .movies-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    margin-bottom: 2rem;
  }

  /* Animation for page load */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  main {
    animation: fadeIn 0.5s ease-out forwards;
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

  /* Responsive adjustments */
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchMovies = () => {
      setMovies(mockMovies);
    };
    
    fetchMovies();
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      {/* Inject CSS */}
      <style>{styles}</style>
      
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="p-4">
          <div className="container mx-auto flex justify-between items-center nav-container">
            <h1 className="cinema-logo">Lion's Den Cinema</h1>
            <nav className="nav-links">
              <a href="#" className="text-red-500">Home</a>
              <a href="#" className="hover:text-red-500">Movies</a>
              <a href="#" className="hover:text-red-500">Buy Tickets</a>
              <a href="#" className="hover:text-red-500">Food</a>
              <a href="#" className="hover:text-red-500">About</a>
              <a href="#" className="hover:text-red-500">Contact</a>

            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <div className="hero-section">
          <h2 className="hero-title">Welcome to Lion's Den Cinema</h2>
          <button className="ticket-button">
            Get Tickets Now
          </button>
        </div>

        {/* Main Content */}
        <main className="py-16">
          {/* Movie Selection */}
          <section className="movies-container px-4">
            <h2 className="text-3xl font-bold section-title text-white">Featured Movies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {movies.map(movie => (
                <div 
                  key={movie.id} 
                  className="movie-card w-full max-w-sm"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-white">{movie.title}</h3>
                    <div className="flex justify-between mb-2 text-sm text-gray-400">
                      <span>{movie.duration} mins</span>
                      <span>{movie.rating}</span>
                    </div>
                    <p className="text-gray-300 mb-4 line-clamp-3">{movie.description}</p>
                    <button 
                      className="w-full ticket-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovieSelect(movie);
                      }}
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