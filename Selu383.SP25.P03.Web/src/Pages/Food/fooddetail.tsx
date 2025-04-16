import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// Enhanced Food Item Interface
interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  customizationOptions?: {
    type: 'butter' | 'cheese' | 'none';
    options?: string[];
  };
}

const styles = `
  :root {
    --primary-color: #000000;
    --accent-color: #ff0000;
    --text-light: #ffffff;
    --text-dark: #121212;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .food-detail-wrapper {
    max-width: 800px;
    margin: 2rem auto;
    background-color: #1f1f1f;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: var(--card-shadow);
  }

  .food-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .customization-section {
    margin-top: 1.5rem;
  }

  .option-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .option-button {
    background-color: #2c2c2c;
    color: var(--text-light);
    border: 2px solid transparent;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .option-button:hover {
    background-color: #3c3c3c;
  }

  .option-button.selected {
    background-color: var(--accent-color);
    border-color: var(--text-light);
  }

  .add-to-cart-button {
    background-color: var(--accent-color);
    color: var(--text-light);
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .add-to-cart-button:hover {
    background-color: #cc0000;
  }
`;

const FoodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [selectedCustomization, setSelectedCustomization] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await fetch(`/api/fooditems/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching food item (status ${response.status})`);
        }
        const data = await response.json();
        setFoodItem(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load food item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  const handleCustomizationSelect = (option: string) => {
    setSelectedCustomization(option);
  };

  const handleAddToCart = () => {
    if (!foodItem) return;

    const cartItem = {
      ...foodItem,
      customization: selectedCustomization
    };

    // Here you would typically dispatch an action to add to cart
    console.log('Adding to cart:', cartItem);
    alert(`Added ${foodItem.name} ${selectedCustomization ? `with ${selectedCustomization}` : ''} to cart!`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!foodItem) return <p>No food item found.</p>;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="food-detail-wrapper">
          {foodItem.imageUrl && (
            <img 
              src={foodItem.imageUrl} 
              alt={foodItem.name} 
              className="food-image" 
            />
          )}
          
          <h1 className="text-3xl font-bold mb-4">{foodItem.name}</h1>
          <p className="text-gray-300 mb-4">{foodItem.description}</p>
          <p className="text-xl font-bold text-red-500 mb-4">${foodItem.price.toFixed(2)}</p>

          {foodItem.customizationOptions && foodItem.customizationOptions.type !== 'none' && (
            <div className="customization-section">
              <h2 className="text-xl font-semibold mb-4">
                Select {foodItem.customizationOptions.type === 'butter' ? 'Butter' : 'Cheese'} Option
              </h2>
              <div className="option-grid">
                {foodItem.customizationOptions.options?.map((option) => (
                  <button
                    key={option}
                    className={`option-button ${selectedCustomization === option ? 'selected' : ''}`}
                    onClick={() => handleCustomizationSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            className="add-to-cart-button w-full mt-6"
            onClick={handleAddToCart}
            disabled={foodItem.customizationOptions?.type !== 'none' && !selectedCustomization}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default FoodDetail;