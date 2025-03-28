import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

// Food item interface
interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  isVegan: boolean;
  locationId: number;
  imageUrl?: string;
}

const styles = `
  :root {
    --primary-color: #000000;
    --accent-color: #ff0000;
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

    .nav-links {
      margin-top: 1rem;
    }

    .hero-title {
      font-size: 2rem;
    }
  }

    header {
    background-color: #121212; /* matches About page */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.food-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
}

`;

const FoodList: React.FC = () => {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchFoodItems = async () => {
        try {
          const response = await fetch('/api/fooditems');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setFoods(data);
        } catch (err) {
          setError("Failed to load food items.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFoodItems();
    }, []);
  
    return (
      <>
        <style>{styles}</style>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <div className="food-container">
            <h1 className="food-title">Concession Menu</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="food-grid">
              {foods.map((item) => (
                <div className="food-card" key={item.id}>
  {item.imageUrl && (
    <img
      src={item.imageUrl}
      alt={item.name}
      className="food-image"
    />
  )}
  <h2 className="food-name">{item.name}</h2>
  <p className="food-description">{item.description}</p>
  <p className="food-price">${item.price.toFixed(2)}</p>
  {item.isVegan && <span className="vegan-tag">Vegan</span>}
  <p className="location-tag">Location ID: {item.locationId}</p>
</div>

              ))}
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default FoodList;