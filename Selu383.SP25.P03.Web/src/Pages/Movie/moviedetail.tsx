import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

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

  header {
    background-color: #121212;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 10;
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
    background-color: #10b981;
    transform: translateY(-2px);
  }

  .movie-detail-wrapper {
    background-color: #1f1f1f;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem auto;
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

  .youtube-trailer {
    margin-top: 2rem;
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

                  <button className="ticket-button mt-6">Buy Tickets</button>
                </div>
              </div>

              {movie.youtubeUrl && (
                <div className="flex justify-center px-4 pb-10">
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
