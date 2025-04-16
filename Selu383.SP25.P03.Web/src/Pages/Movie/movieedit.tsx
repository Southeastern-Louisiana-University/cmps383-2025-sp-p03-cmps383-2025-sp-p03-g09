import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface MovieForm {
  title: string;
  duration: number;
  rating: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  youtubeUrl: string;
}

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

const MovieEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState<MovieForm | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/authentication/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser);

    fetch(`/api/movies/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Movie not found"))
      .then(setForm)
      .catch(err => setError(err));
  }, [id]);

  const isAdmin = user?.roles.includes('Admin');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!form) return;
    setForm(prev => ({ ...prev!, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const response = await fetch(`/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });

    if (response.ok) {
      navigate('/movies');
    } else {
      setError('Failed to update movie.');
    }
  };

  if (!user) return <p className="centered-message">Checking permissions...</p>;
  if (!isAdmin) return <p className="centered-message error">Access Denied: Admins only.</p>;
  if (!form) return <p className="centered-message">Loading movie data...</p>;

  return (
    <>
      <style>{`
        body {
          background-color: black;
          color: white;
          margin: 0;
          padding: 0;
        }
        .form-container {
          max-width: 600px;
          margin: 60px auto;
          background-color: #1e1e1e;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
        }
        .form-title {
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
          color: #ff0000;
        }
        .input-group {
          margin-bottom: 16px;
        }
        .input-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: bold;
        }
        .input-group input,
        .input-group textarea {
          width: 100%;
          padding: 10px;
          background-color: #2c2c2c;
          color: white;
          border: 1px solid #444;
          border-radius: 4px;
        }
        .input-group textarea {
          resize: vertical;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background-color: #ff0000;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-btn:hover {
          background-color: #cc0000;
        }
        .error {
          text-align: center;
          color: #ff4d4d;
        }
        .centered-message {
          text-align: center;
          margin-top: 50px;
          font-size: 20px;
        }
      `}</style>

      
      <div>
        <Navbar />
        <div className="form-container">
          <h2 className="form-title">Edit Movie</h2>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="rating">Rating</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#2c2c2c', color: 'white', padding: '10px', borderRadius: '4px', border: '1px solid #444', width: '100%' }}
              >
                <option value="">-- Select Rating --</option>
                <option value="G">G – General Audiences</option>
                <option value="PG">PG – Parental Guidance Suggested</option>
                <option value="PG-13">PG-13 – Parents Strongly Cautioned</option>
                <option value="R">R – Restricted</option>
                <option value="NC-17">NC-17 – Adults Only</option>
                <option value="NR">NR – Not Rated</option>
                <option value="Unrated">Unrated</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="posterUrl">Poster URL</label>
              <input type="text" name="posterUrl" value={form.posterUrl} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="youtubeUrl">YouTube Trailer URL</label>
              <input type="text" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea name="description" rows={4} value={form.description} onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn">Save Changes</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MovieEdit;
