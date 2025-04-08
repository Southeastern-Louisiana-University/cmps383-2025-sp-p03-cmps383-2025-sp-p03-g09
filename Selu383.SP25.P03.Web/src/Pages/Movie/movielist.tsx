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

  .food-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    animation: fadeIn 0.5s ease-out forwards;
  }

  .food-title {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 2rem;
    text-align: center;
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
    box-shadow: var(--card-shadow);
    transition: transform 0.3s ease;
  }

  .food-card:hover {
    transform: translateY(-5px);
  }

  .food-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #fff;
  }

  .food-description {
    color: #ccc;
    margin-bottom: 0.5rem;
  }

  .food-price {
    font-weight: bold;
    color: var(--accent-color);
    margin-bottom: 0.25rem;
  }

  .vegan-tag {
    display: inline-block;
    background-color: green;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .location-tag {
    color: #aaa;
    font-size: 0.9rem;
    margin-top: 0.5rem;
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
    background-color: #10b981;
  }

  .food-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
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
    background-color: #990000;
    color: white;
  }

  .delete-button:hover {
    background-color: #cc0000;
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
    background-color: #ff0000;
    color: white;
    border: none;
  }

  .modal-buttons .cancel {
    background-color: #333;
    color: white;
    border: none;
  }
`;

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
      <style>{styles}</style>

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
                <h2 className="food-name">{item.name}</h2>
                <p className="food-description">{item.description}</p>
                <p className="food-price">${item.price.toFixed(2)}</p>
                {item.isVegan && <span className="vegan-tag">Vegan</span>}

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
