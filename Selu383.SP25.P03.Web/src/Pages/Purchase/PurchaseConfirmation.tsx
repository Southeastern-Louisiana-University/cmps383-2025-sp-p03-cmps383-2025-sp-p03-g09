import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

interface FoodItem {
  name: string;
  price: number;
  quantity: number;
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

const PurchaseConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("lastConfirmedOrder");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log("✅ confirmationData loaded:", parsed);
        setConfirmationData(parsed);
      } catch (err) {
        console.error("❌ Failed to parse confirmation data:", err);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  if (!confirmationData) return null;

  const {
    ticket,
    seats = [],
    foodItems = [],
    price,
  } = confirmationData;

  const safeTitle = ticket?.movie?.title || "Unknown Movie";
  const safeLocation = ticket?.location?.name || "Unknown";
  const safeShowtime = ticket?.showtime
    ? new Date(ticket.showtime).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Unknown";

  const safeTheater = ticket?.theater?.theaterNumber || ticket?.theaterId || confirmationData.theaterId || "Unknown";

  const safeSeats = Array.isArray(seats) && seats.length > 0
    ? seats.map((s: any) => `${rowToLetter(s.row)}${s.column}`).join(", ")
    : "N/A";

  const safeTotal = typeof price === "number" ? price.toFixed(2) : "N/A";

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <style>{`
        .confirmation-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 80px);
          padding: 2rem;
        }

        .confirmation-box {
          background-color: #1f1f1f;
          padding: 2rem 3rem;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        }

        .confirmation-box h1 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .confirmation-box p {
          margin-bottom: 0.75rem;
        }

        .food-list {
          list-style: disc;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .back-button {
          margin-top: 2rem;
          display: block;
          width: 100%;
          padding: 0.75rem;
          background-color: #38a169;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .back-button:hover {
          background-color: #2f855a;
        }

        .confirmation-box,
        .confirmation-box h1,
        .confirmation-box p,
        .confirmation-box strong,
        .confirmation-box div,
        .confirmation-box li,
        .food-list {
          color: #ffffff !important;
          text-shadow: 0 0 1px rgba(255, 255, 255, 0.15);
        }

      `}</style>

      <div className="confirmation-wrapper">
        <div className="confirmation-box">
          <h1>Purchase Confirmed!</h1>

          <div className="mb-3">
            <div><strong>Movie:</strong> {safeTitle}</div>
            <div><strong>Location:</strong> {safeLocation}</div>
            <div><strong>Theater:</strong> {safeTheater}</div>
            <div><strong>Seat(s):</strong> {safeSeats}</div>
            <div><strong>Showtime:</strong> {safeShowtime}</div>
          </div>

          {Array.isArray(foodItems) && foodItems.length > 0 && (
            <div>
              <strong>Food:</strong>
              <ul className="food-list">
                {foodItems.map((item: FoodItem, i: number) => (
                  <li key={i}>
                    {item.name} x{item.quantity} – ${(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p><strong>Total Paid:</strong> ${safeTotal}</p>

          <button onClick={() => navigate("/")} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmation;
