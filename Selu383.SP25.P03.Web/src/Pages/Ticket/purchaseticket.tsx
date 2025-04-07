import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

// Food item interface
interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface CartItem {
  food: FoodItem;
  quantity: number;
}

interface Movie {
  id: number;
  title: string;
}

interface Location {
  id: number;
  name: string;
}

const PurchaseTicket: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [searchParams] = useSearchParams();
  const showtime = searchParams.get("showtime");
  const locationId = searchParams.get("locationId");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [locationDetails, setLocationDetails] = useState<Location | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/fooditems")
      .then((res) => res.json())
      .then(setFoodItems);

    if (movieId) {
      fetch(`/api/movies/${movieId}`)
        .then((res) => res.json())
        .then(setMovieDetails);
    }

    if (locationId) {
      fetch(`/api/locations/${locationId}`)
        .then((res) => res.json())
        .then(setLocationDetails);
    }

    fetch("/api/authentication/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserId(data.id))
      .catch((err) => console.error("Failed to fetch user details:", err));
  }, [movieId, locationId]);

  const handleAddFood = (food: FoodItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.food.id === food.id);
      if (existingItem) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleRemoveFood = (foodId: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTicketQuantity(1);
  };

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cartItems") || "[]");
  
    const ticketNameParts = [];
    if (movieDetails?.title) ticketNameParts.push(movieDetails.title);
    if (showtime) ticketNameParts.push(`@ ${showtime}`);
    if (locationDetails?.name) ticketNameParts.push(`(${locationDetails.name})`);
  
    const ticketItem = {
      id: Date.now(),
      name: ticketNameParts.join(" "),
      quantity: ticketQuantity,
      price: 12.99,
    };
  
    const foodCartItems = cartItems.map(item => ({
      id: Date.now() + item.food.id,
      name: item.food.name,
      quantity: item.quantity,
      price: item.food.price,
    }));
  
    const allItems = [...existing, ticketItem, ...foodCartItems];
  
    localStorage.setItem("cartItems", JSON.stringify(allItems));
    window.location.href = "/cart";
  };
  
  
  

  const ticketTotalPrice = 12.99 * ticketQuantity;
  const foodTotalPrice = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );
  const totalPrice = ticketTotalPrice + foodTotalPrice;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <style>{`
        .purchase-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          align-items: start;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .food-ads {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .food-item {
          display: flex;
          align-items: center;
          background-color: #1f1f1f;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .food-image {
          width: 75px;
          height: 75px;
          object-fit: cover;
          border-radius: 6px;
          margin-right: 1rem;
        }

        .food-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .food-name {
          font-size: 1rem;
          font-weight: bold;
          color: white;
        }

        .food-price {
          font-size: 0.9rem;
          color: #e3342f;
        }

        .add-button {
          background-color: #e3342f;
          color: white;
          padding: 0.3rem 0.6rem;
          font-size: 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-button:hover {
          background-color: #cc0000;
        }

        .cart-section {
          background-color: #1f1f1f;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .cart-total {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1rem;
        }

        .remove-button {
          color: #e3342f;
          cursor: pointer;
          text-decoration: underline;
        }

        .remove-button:hover {
          color: #cc0000;
        }

        .ticket-dropdown {
          background-color: #1f1f1f;
          color: white;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 0.5rem;
          width: 45px;
          text-align: center;
        }

        .clear-cart-button {
          background-color: #444;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .clear-cart-button:hover {
          background-color: #666;
        }
      `}</style>

      <div className="purchase-container">
        <div className="cart-section">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <button className="clear-cart-button mb-4" onClick={handleClearCart}>
            Clear Cart
          </button>
          <div className="bg-gray-900 p-4 rounded mb-6">
            <h2 className="text-xl font-bold mb-2">Ticket Details</h2>
            {movieDetails && (
              <p>
                <strong>Movie:</strong> {movieDetails.title}
              </p>
            )}
            {locationDetails && (
              <p>
                <strong>Location:</strong> {locationDetails.name}
              </p>
            )}
            <p>
              <strong>Showtime:</strong> {showtime}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <label htmlFor="ticket-quantity" className="text-white">
                <strong>Tickets:</strong>
              </label>
              <select
                id="ticket-quantity"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                className="ticket-dropdown"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-4">
              <strong>Ticket Price:</strong> ${ticketTotalPrice.toFixed(2)}
            </p>
          </div>
          {cartItems.length > 0 && (
            <div className="bg-gray-900 p-4 rounded mb-6">
              <h2 className="text-xl font-bold mb-2">Food Items</h2>
              {cartItems.map((item) => (
                <div key={item.food.id} className="cart-item">
                  <div className="cart-item-details">
                    <span>
                      {item.food.name} x{item.quantity}
                    </span>
                    <span>${(item.food.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFood(item.food.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
          <button
  className="bg-red-600 text-white px-6 py-3 mt-8 text-lg rounded hover:bg-red-700 transition w-full"
  onClick={handleAddToCart}
>
  Add to Cart
</button>


        </div>

        <div className="food-ads">
          <h2 className="text-xl font-bold text-center mb-4">
            Want to add some food?
          </h2>
          {foodItems.map((food: FoodItem) => (
            <div key={food.id} className="food-item">
              <img
                src={food.imageUrl || "/fallback.jpg"}
                alt={food.name}
                className="food-image"
              />
              <div className="food-details">
                <div>
                  <p className="food-name">{food.name}</p>
                  <p className="food-price">${food.price.toFixed(2)}</p>
                </div>
                <button
                  className="add-button"
                  onClick={() => handleAddFood(food)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicket;
