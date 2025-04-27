import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

if (!localStorage.getItem("guestId")) {
  localStorage.setItem("guestId", crypto.randomUUID());
}

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
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [locationDetails, setLocationDetails] = useState<Location | null>(null);
  const selectedSeats = JSON.parse(localStorage.getItem("cartItems") || "[]").filter((item: any) => item.seatId);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const allItems = await fetch("/api/fooditems").then(res => res.json());
        const selected = localStorage.getItem("selectedLocation");
        let locationId = null;

        if (selected) {
          try {
            const parsed = JSON.parse(selected);
            locationId = parsed?.id;
          } catch {
            console.warn("Failed to parse selected location");
          }
        }

        const filtered = locationId
          ? allItems.filter((item: any) => item.locationId === locationId)
          : allItems;

        setFoodItems(filtered);
      } catch (err) {
        console.error("Failed to load food items:", err);
      }
    };

    fetchFoodItems();

    if (movieId) {
      fetch(`/api/movies/${movieId}`)
        .then(res => res.json())
        .then(setMovieDetails);
    }

    const selected = localStorage.getItem("selectedLocation");
    if (selected) {
      const parsed = JSON.parse(selected);

      fetch("/api/locations")
        .then(res => res.json())
        .then(all => {
          const match = all.find((loc: Location) => loc.name === parsed.name);
          if (match) {
            setLocationDetails(match);
          } else {
            console.warn("No matching location found for:", parsed.name);
          }
        });
    }

    fetch("/api/authentication/me", { credentials: "include" })
      .then(res => res.json())
      .catch(err => console.error("Failed to fetch user details:", err));
  }, [movieId, locationId]);

  const handleAddFood = (food: FoodItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.food.id === food.id);
      if (existingItem) {
        return prev.map(item =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  };

  const handleRemoveFood = (foodId: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const ticketItem = selectedSeats.map((seat: any) => ({
      id: Date.now() + (seat.seatId ?? seat.id),
      name: `${movieDetails?.title} (${locationDetails?.name}) - Seat ${rowToLetter(seat.row)}${seat.column}`,
      quantity: 1,
      price: 12.99,
      movieId: movieDetails?.id,
      locationId: locationDetails?.id,
      showtime,
      seatId: seat.seatId ?? seat.id,
      theaterId: seat.theaterId,
      seats: [{ id: seat.seatId ?? seat.id, row: seat.row, column: seat.column }]
    }));

    const foodCartItems = cartItems.map(item => ({
      id: Date.now() + item.food.id,
      name: item.food.name,
      quantity: item.quantity,
      price: item.food.price,
      food: item.food
    }));

    const allItems = [...ticketItem, ...existing, ...foodCartItems];

    localStorage.setItem("cartItems", JSON.stringify(allItems));
    window.location.href = "/cart";
  };

  const ticketTotalPrice = 12.99 * selectedSeats.length;
  const foodTotalPrice = cartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const totalPrice = ticketTotalPrice + foodTotalPrice;

  const rowToLetter = (row: string | number): string => {
    const num = typeof row === "string" ? parseInt(row, 10) : row;
    if (isNaN(num) || num <= 0) return "?";
    let result = "";
    let n = num;
    while (n > 0) {
      n--;
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26);
    }
    return result;
  };

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
        .food-scroll {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .food-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .food-scroll::-webkit-scrollbar-thumb {
          background-color: #444;
          border-radius: 4px;
        }
        .food-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #666;
        }
        .food-item {
          display: flex;
          align-items: center;
          background-color: #1f1f1f;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
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
          color: #10b981;
        }
        .add-button {
          background-color: #10b981;
          color: white;
          padding: 0.3rem 0.6rem;
          font-size: 0.8rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .cart-section {
          background-color: #1f1f1f;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          color: #f3f4f6;
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
      `}</style>

      <div className="purchase-container">
        <div className="cart-section">
          <div className="bg-gray-900 p-4 rounded mb-6">
            <h2 className="text-xl font-bold mb-2">Ticket Details</h2>
            {movieDetails && <p><strong>Movie:</strong> {movieDetails.title}</p>}
            {locationDetails && <p><strong>Location:</strong> {locationDetails.name}</p>}
            <p><strong>Theater:</strong> {selectedSeats[0]?.theaterId || "N/A"}</p>
            <p><strong>Showtime:</strong> {showtime ? new Date(showtime).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }) : "N/A"}</p>
            <p><strong>Seats:</strong> {selectedSeats.map((s: any) => { const rowChar = typeof s.row === "number" ? String.fromCharCode(64 + s.row) : s.row; return `${rowChar}${s.column}`; }).join(", ")}</p>
            <p className="mt-4"><strong>Ticket Price:</strong> ${ticketTotalPrice.toFixed(2)}</p>
          </div>

          {cartItems.length > 0 && (
            <div className="bg-gray-900 p-4 rounded mb-6">
              <h2 className="text-xl font-bold mb-2">Food/Drink:</h2>
              {cartItems.map((item) => (
                <div key={item.food.id} className="cart-item">
                  <div className="cart-item-details">
                    <span>{item.food.name} x{item.quantity}</span>
                    <span>${(item.food.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <button className="remove-button" onClick={() => handleRemoveFood(item.food.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
          <button className="bg-red-600 text-white px-6 py-3 mt-8 text-lg rounded hover:bg-red-700 transition w-full" onClick={handleAddToCart}>Add to Cart</button>
        </div>

        <div className="food-ads">
          <h2 className="text-xl font-bold text-center mb-4">Want to add some food?</h2>
          <div className="food-scroll">
            {foodItems.map((food: FoodItem) => (
              <div key={food.id} className="food-item">
                <img src={food.imageUrl || "/fallback.jpg"} alt={food.name} className="food-image" />
                <div className="food-details">
                  <div>
                    <p className="food-name">{food.name}</p>
                    <p className="food-price">${food.price.toFixed(2)}</p>
                  </div>
                  <button className="add-button" onClick={() => handleAddFood(food)}>Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicket;
