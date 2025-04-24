import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface FoodForm {
  id?: number;
  name: string;
  price: number;
  description: string;
  isVegan: boolean;
  imageUrl: string;
  locationId: number;
}

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

interface Location {
  id: number;
  name: string;
}

const FoodEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<FoodForm>({
    name: '',
    price: 0,
    description: '',
    isVegan: false,
    imageUrl: '',
    locationId: 0
  });
  const [error, setError] = useState('');
  const [applyToAllLocations, setApplyToAllLocations] = useState(false);

  useEffect(() => {
    fetch('/api/authentication/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .catch(() => setUser(null));

    fetch('/api/locations')
      .then(res => res.ok ? res.json() : [])
      .then(setLocations);

    if (id) {
      fetch(`/api/fooditems/${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setForm(data);
        });
    }
  }, [id]);

  const isAdmin = user?.roles.includes('Admin');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'applyToAllLocations') {
        setApplyToAllLocations(checked);
      } else {
        setForm(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (applyToAllLocations) {
        // Get all food items with same name across locations
        const allItems: FoodForm[] = await fetch('/api/fooditems').then(res => res.json());
        const matchingItems = allItems.filter(item => item.name === form.name);

        for (const item of matchingItems) {
          await fetch(`/api/fooditems/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ ...form, locationId: item.locationId }) // preserve each item's location
          });
        }
      } else {
        const response = await fetch(`/api/fooditems/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form)
        });

        if (!response.ok) throw new Error();
      }

      navigate('/food');
    } catch {
      setError('Failed to update food item. Make sure all fields are valid.');
    }
  };

  if (!user) return <p className="centered-message">Checking permissions...</p>;
  if (!isAdmin) return <p className="centered-message error">Access Denied: Admins only.</p>;

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
        .input-group textarea,
        .input-group select {
          width: 100%;
          padding: 10px;
          background-color: #2c2c2c;
          color: white;
          border: 1px solid #444;
          border-radius: 4px;
        }
        .input-group input[type="checkbox"] {
          width: auto;
          margin-right: 8px;
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
          <h2 className="form-title">Edit Food Item</h2>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="price">Price ($)</label>
              <input type="number" name="price" step="0.01" value={form.price} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="locationId">Location</label>
              <select name="locationId" value={form.locationId} onChange={handleChange} required disabled={applyToAllLocations}>
                <option value="">-- Select Location --</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  name="applyToAllLocations"
                  checked={applyToAllLocations}
                  onChange={handleChange}
                />
                &nbsp;Apply changes to all locations
              </label>
            </div>

            <div className="input-group">
              <label htmlFor="description">Description</label>
              <textarea name="description" rows={4} value={form.description} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>
                <input type="checkbox" name="isVegan" checked={form.isVegan} onChange={handleChange} />
                Vegan?
              </label>
            </div>

            <button type="submit" className="submit-btn">Update Food Item</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FoodEdit;
