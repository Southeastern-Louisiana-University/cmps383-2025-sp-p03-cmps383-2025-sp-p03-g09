import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  isVegan: boolean;
  locationId: number;
  imageUrl?: string;
}

interface UserDto {
  id: string;
  userName: string;
  roles: string[];
}

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<UserDto | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const navigate = useNavigate();

  const isAdmin = user?.roles.includes('Admin');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/authentication/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch user info.');
      }
    };

    const fetchFoodItems = async () => {
      try {
        const response = await fetch('/api/fooditems');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setFoods(data);
      } catch (err) {
        setError('Failed to load food items.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchFoodItems();
  }, []);

  const confirmDelete = (item: FoodItem) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const handleConfirmedDelete = async () => {
    if (!selectedItem) return;

    try {
      const res = await fetch(`/api/fooditems/${selectedItem.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setFoods(prev => prev.filter(item => item.id !== selectedItem.id));
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting.');
    } finally {
      setShowConfirmModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary-color: #000000;
          --accent-color: #10b981;
          --text-light: #ffffff;
          --text-dark: #121212;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        body {
          background-color: var(--primary-color);
          color: var(--text-light);
        }
          
        .add-button {
          background-color: #10b981;
          color: white;
          padding: 10px 16px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-button:hover {
          background-color: #468973;
        }

        .food-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .food-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .food-title {
          font-size: 2.5rem;
          color: #10b981;
        }

        .food-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .food-card {
          background-color: #1e1e1e;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .food-card:hover {
          transform: translateY(-5px);
        }

        .card-buttons {
          margin-top: 1rem;
          display: flex;
          gap: 10px;
        }

        .edit-button,
        .delete-button {
          padding: 8px 12px;
          font-size: 0.9rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .edit-button {
          background-color: #555;
          color: white;
        }

        .edit-button:hover {
          background-color: #777;
        }

        .delete-button {
          background-color: #336353;
          color: white;
        }

        .delete-button:hover {
          background-color: #468973;
        }

        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #1e1e1e;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
        }

        .modal-buttons {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .modal-buttons button {
          padding: 10px 20px;
          font-weight: bold;
          border-radius: 5px;
          cursor: pointer;
        }

        .modal-buttons .confirm {
          background-color: #10b981;
          color: white;
          border: none;
        }

        .modal-buttons .cancel {
          background-color: #333;
          color: white;
          border: none;
        }
      `}</style>

      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="food-container">
          <div className="food-title-bar">
            <h1 className="food-title">Concession Menu</h1>
            {isAdmin && (
              <button className="add-button" onClick={() => navigate('/food/create')}>
                + Add Food Item
              </button>
            )}
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="food-grid">
            {foods.map(item => (
              <div className="food-card" key={item.id}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: '6px', marginBottom: '1rem' }} />}
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{item.name}</h2>
                <p>{item.description}</p>
                <p style={{ color: '#10b981', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
                {item.isVegan && <span style={{ backgroundColor: 'green', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.8rem' }}>Vegan</span>}

                {isAdmin && (
                  <div className="card-buttons">
                    <button className="edit-button" onClick={() => navigate(`/food/${item.id}/edit`)}>
                      Modify
                    </button>
                    <button className="delete-button" onClick={() => confirmDelete(item)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showConfirmModal && selectedItem && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Delete "{selectedItem.name}"?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="confirm" onClick={handleConfirmedDelete}>Confirm</button>
              <button className="cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodList;
