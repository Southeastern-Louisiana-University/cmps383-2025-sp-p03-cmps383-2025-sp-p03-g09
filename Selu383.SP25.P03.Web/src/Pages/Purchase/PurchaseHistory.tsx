import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

interface Order {
  id: number;
  price: number;
  seatId: number;
  theaterId: number;
  foodItemIds: number[];
  tickets?: {
    movieTitle: string;
    locationName: string;
    showtime: string;
  }[];
  foodItems?: {
    name: string;
    price: number;
  }[];
  createdAt?: string;
}

const PurchaseHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Failed to load purchase history:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <style>{`
        .history-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 3rem;
        }

        .history-box {
          background-color: #1f1f1f;
          padding: 2rem 3rem;
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        }

        .history-box h1 {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2rem;
        }

        .order-item {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #444;
        }

        .order-detail {
          margin-bottom: 0.5rem;
        }

        .food-list {
          list-style: none;
          padding-left: 0;
        }

        .food-list li {
          margin-bottom: 0.25rem;
        }

        .empty-message {
          text-align: center;
          color: #aaa;
        }
      `}</style>

      <div className="history-container">
        <div className="history-box">
          <h1>Purchase History</h1>
          {orders.length === 0 ? (
            <p className="empty-message">You haven't purchased anything yet.</p>
          ) : (
            orders.map((order) => (
              <div className="order-item" key={order.id}>
                <div className="order-detail">
                  <strong>Movie:</strong>{" "}
                  {order.tickets && order.tickets.length > 0
                    ? order.tickets[0].movieTitle
                    : "N/A"}
                </div>
                <div className="order-detail">
                  <strong>Location:</strong>{" "}
                  {order.tickets && order.tickets.length > 0
                    ? order.tickets[0].locationName
                    : "N/A"}
                </div>
                <div className="order-detail">
                  <strong>Showtime:</strong>{" "}
                  {order.tickets && order.tickets.length > 0
                    ? new Date(order.tickets[0].showtime).toLocaleString()
                    : "N/A"}
                </div>
                <div className="order-detail">
                  <strong>Seat:</strong> {order.seatId}
                </div>
                <div className="order-detail">
                  <strong>Theater:</strong> {order.theaterId}
                </div>
                <div className="order-detail">
                  <strong>Food Items:</strong>
                  {order.foodItems && order.foodItems.length > 0 ? (
                    <ul className="food-list">
                      {order.foodItems.map((item, index) => (
                        <li key={index}>
                          {item.name} - ${item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    " None"
                  )}
                </div>
                <div className="order-detail">
                  <strong>Purchase Time:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </div>
                <div className="order-detail">
                  <strong>Total:</strong> ${order.price.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
