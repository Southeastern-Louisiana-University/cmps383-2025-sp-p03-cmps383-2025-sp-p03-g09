import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const formatWithLocalTimeZone = (utcString: string): string => {
  try {
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Intl.DateTimeFormat("en-US", {
      timeZone: localZone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(utcString));
  } catch (err) {
    console.error("Timezone formatting error:", err);
    return "Invalid date";
  }
};

interface Order {
  id: number;
  price: number;
  userId: number | null;
  seats: {
    seatId: number;
    row: string | number;
    column: number;
  }[];
  theaterId: number;
  purchaseTime: string;
  ticket?: {
    id: number;
    showtime: string;
    movie?: {
      title: string;
    };
    location?: {
      name: string;
    };
  };
  foodItems?: {
    foodItemId?: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

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

const PurchaseHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/authentication/me", { credentials: "include" });

        if (res.ok) {
          // Logged in user - fetch orders from API
          const userRes = await fetch("/api/orders/user", { credentials: "include" });
          if (!userRes.ok) {
            throw new Error("Failed to fetch user orders");
          }
          const data = await userRes.json();
          setOrders(data);
        } else {
          // Guest user - get orders from localStorage
          try {
            const guestOrdersString = localStorage.getItem("guestOrderHistory");
            console.log("Guest orders from localStorage:", guestOrdersString);
            
            if (guestOrdersString) {
              const guestOrders = JSON.parse(guestOrdersString);
              if (Array.isArray(guestOrders)) {
                setOrders(guestOrders);
              } else {
                console.error("Guest orders is not an array:", guestOrders);
                setOrders([]);
              }
            } else {
              console.log("No guest orders found in localStorage");
              setOrders([]);
            }
          } catch (localStorageError) {
            console.error("Error parsing guest orders from localStorage:", localStorageError);
            setError("Error loading guest purchase history");
            setOrders([]);
          }
        }
      } catch (err) {
        console.error("Error fetching purchase history:", err);
        setError("Error loading purchase history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Format and group food items
  const renderFoodItems = (foodItems: Order['foodItems']) => {
    if (!foodItems || foodItems.length === 0) return "None";
    
    const grouped = foodItems.reduce((acc, item) => {
      if (!item) return acc;
      
      const key = `${item.name}-${item.price}`;
      if (!acc[key]) {
        acc[key] = { 
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        };
      } else {
        acc[key].quantity = (acc[key].quantity || 0) + (item.quantity || 1);
      }
      return acc;
    }, {} as Record<string, { name: string; price: number; quantity: number }>);
    
    return (
      <div className="ml-4">
        <ul className="food-list">
          {Object.values(grouped).map((item, idx) => (
            <li key={idx}>
              {item.name} x{item.quantity} – ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <style>{`
        .history-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .history-box {
          background-color: #1f1f1f;
          padding: 2rem;
          border-radius: 8px;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .order-item {
          background-color: #2a2a2a;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .order-item h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .order-detail {
          margin-bottom: 0.25rem;
        }

        .order-total {
          margin-top: 0.5rem;
          font-weight: bold;
        }

        .food-list {
          margin-left: 1rem;
          list-style: disc;
        }
      `}</style>

      <div className="history-container">
        <div className="history-box">
          <h1 className="text-3xl font-bold text-center mb-6">Purchase History</h1>

          {isLoading ? (
            <p className="text-center">Loading purchase history...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-center">You have no past orders.</p>
          ) : (
            orders.map((order, index) => (
              <div key={order.id || `guest-order-${index}`} className="order-item">
                <h2>Movie: {order.ticket?.movie?.title || "N/A"}</h2>
                <p className="order-detail">
                  <strong>Location:</strong> {order.ticket?.location?.name || "N/A"}
                </p>
                <p className="order-detail">
                  <strong>Showtime:</strong>{" "}
                  {order.ticket?.showtime
                    ? new Date(order.ticket.showtime).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>
                <p className="order-detail">
                  <strong>Seats:</strong>{" "}
                  {order.seats && order.seats.length > 0
                    ? order.seats.map((s) => `${rowToLetter(s.row)}${s.column}`).join(", ")
                    : "N/A"}
                </p>
                <p className="order-detail">
                  <strong>Theater:</strong> {order.theaterId || "N/A"}
                </p>
                <div className="order-detail">
                  <strong>Food Items:</strong> {renderFoodItems(order.foodItems)}
                </div>
                <p className="order-detail">
                  <strong>Purchase Time:</strong>{" "}
                  {order.purchaseTime ? formatWithLocalTimeZone(order.purchaseTime) + " UTC" : "N/A"}
                </p>
                <p className="order-total">Total: ${(order.price || 0).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;