import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { showtimeSchedule } from '../../Data/showtimeSchedule';

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate: string;
  posterUrl?: string;
  youtubeUrl?: string;
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
    background-color: var(--primary-color);
    color: var(--text-light);
    margin: 0;
    padding: 0;
  }

  .ticket-button {
    background-color: var(--accent-color);
    color: var(--text-light);
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .ticket-button:hover {
    background-color: #10b981;
    transform: translateY(-2px);
  }

  .showtime-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .movie-detail-wrapper {
    background-color: #1f1f1f;
    border-radius: 12px;
    padding: 2rem;
    margin: 1.5rem auto;
    max-width: 1000px;
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .movie-detail-wrapper {
      flex-direction: row;
    }
  }

  .movie-poster {
    width: 100%;
    max-width: 300px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: var(--card-shadow);
  }

  .movie-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .info-label {
    font-weight: bold;
    color: var(--accent-color);
    margin-right: 4px;
  }

  .youtube-trailer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 1rem 0;
  }

  .youtube-trailer {
    margin-top: 0.5rem;
    width: 100%;
    max-width: 1000px;
    height: 450px;
    border: none;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    .youtube-trailer {
      height: 250px;
    }
  }
`;

const convertToEmbedUrl = (url?: string) => {
  if (!url) return '';
  const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching movie (status ${response.status})`);
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const renderShowtimeButtons = () => {
    const loc = localStorage.getItem("selectedLocation");
    let locationId = null;

    try {
      locationId = JSON.parse(loc ?? '{}').id;
    } catch {
      console.warn("Failed to parse selectedLocation");
    }

    if (!locationId) {
      return (
        <p className="text-red-400 font-bold mt-4">
          Please select a location and refresh the page.
        </p>
      );
    }

    const matchedShowtimes = showtimeSchedule.filter(
      (entry) =>
        Number(entry.movieId) === Number(id) &&
        Number(entry.locationId) === Number(locationId)
    );

    if (matchedShowtimes.length === 0) {
      return <p className="text-gray-400 mt-4">No showtimes available for this location.</p>;
    }

    return (
      <div className="showtime-buttons">
        {matchedShowtimes.map((entry, idx) => (
          <button
            key={idx}
            className="ticket-button"
            onClick={() =>
              navigate(
                `/seat-test?movieId=${id}&showtime=${encodeURIComponent(entry.time)}&locationId=${entry.locationId}&theaterId=${entry.theaterId}`
              )
            }
          >
            {new Date(entry.time).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="px-4">
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {movie && (
            <>
              <div className="movie-detail-wrapper">
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                  />
                )}

                <div className="movie-info">
                  <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                  <p className="mb-4 text-gray-300 whitespace-pre-wrap">{movie.description}</p>

                  <p><span className="info-label">Duration:</span>{movie.duration} minutes</p>
                  <p><span className="info-label">Rating:</span>{movie.rating}</p>
                  <p><span className="info-label">Release Date:</span>{new Date(movie.releaseDate).toDateString()}</p>

                  <h3 className="text-lg font-semibold text-white mt-6">Select Showtime:</h3>
                  {renderShowtimeButtons()}
                </div>
              </div>

              {movie.youtubeUrl && (
                <div className="youtube-trailer-container mt-4">
                  <iframe
                    className="youtube-trailer"
                    src={convertToEmbedUrl(movie.youtubeUrl)}
                    title="Movie Trailer"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default MovieDetail;
