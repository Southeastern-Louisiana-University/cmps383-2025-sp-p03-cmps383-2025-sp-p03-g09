import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

interface Order {
  id: number;
  price: number;
  userId: number;
  seatIds: number[];
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
    name: string;
    price: number;
    quantity: number;
  }[];
}

const PurchaseHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("🧾 Purchase history data:", data);

        // try to pull food quantities from lastConfirmedOrder in localStorage
        const localOrderRaw = localStorage.getItem("lastConfirmedOrder");
        let quantityMap: Record<string, number> = {};

        if (localOrderRaw) {
          try {
            const localOrder = JSON.parse(localOrderRaw);
            if (Array.isArray(localOrder.foodItems)) {
              quantityMap = localOrder.foodItems.reduce((acc: Record<string, number>, item: any) => {
                acc[item.name] = item.quantity;
                return acc;
              }, {});
            }
          } catch (e) {
            console.error("⚠️ Failed to parse lastConfirmedOrder:", e);
          }
        }

        const updatedOrders = data.map((order: Order) => {
          if (!order.foodItems) return order;

          const patchedFoodItems = order.foodItems.map((item) => ({
            ...item,
            quantity: quantityMap[item.name] || item.quantity || 1,
          }));

          return { ...order, foodItems: patchedFoodItems };
        });

        setOrders(updatedOrders);
      });
  }, []);

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

          {orders.length === 0 ? (
            <p className="text-center">You have no past orders.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-item">
                <h2>Movie: {order.ticket?.movie?.title || "N/A"}</h2>
                <p className="order-detail">
                  <strong>Location:</strong> {order.ticket?.location?.name || "N/A"}
                </p>
                <p className="order-detail">
                  <strong>Showtime:</strong> {order.ticket?.showtime || "N/A"}
                </p>
                <p className="order-detail">
                  <strong>Seats:</strong>{" "}
                  {order.seatIds && order.seatIds.length > 0
                    ? order.seatIds.join(", ")
                    : "N/A"}
                </p>
                <p className="order-detail">
                  <strong>Theater:</strong> {order.theaterId}
                </p>
                <p className="order-detail">
                  <strong>Food Items:</strong>{" "}
                  {order.foodItems && order.foodItems.length > 0 ? (
                    <ul className="food-list">
                      {order.foodItems.map((item, index) => (
                        <li key={index}>
                          {item.name} x{item.quantity} – $
                          {(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "None"
                  )}
                </p>
                <p className="order-detail">
                  <strong>Purchase Time:</strong>{" "}
                  {order.purchaseTime
                    ? new Date(order.purchaseTime).toLocaleString()
                    : "N/A"}
                </p>
                <p className="order-total">
                  Total: ${order.price.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
