import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

interface FoodItem {
  name: string;
  price: number;
  quantity: number;
}

const PurchaseConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("lastConfirmedOrder");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log("confirmationData loaded:", parsed);
        setConfirmationData(parsed);
      } catch (err) {
        console.error("Failed to parse confirmation data:", err);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  if (!confirmationData) return null;

  const {
    movieTitle,
    showtime,
    theaterId,
    seatIds,
    foodItems,
    totalPrice,
    ticket
  } = confirmationData;

  const safeTitle =
  (movieTitle?.replace(/ - Seat [A-Z]+\d+$/, "")) ||
  ticket?.movie?.title ||
  "Unknown Movie";

const safeShowtime = new Date(ticket?.showtime || showtime).toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const safeTheater = ticket?.theater?.theaterNumber || ticket?.theaterId || theaterId || "Unknown";
const seatLabelMatch = movieTitle?.match(/ - Seat ([A-Z]+\d+)$/);
const safeSeats = seatLabelMatch ? seatLabelMatch[1] : "N/A";




const safeTotal = typeof totalPrice === "number" ? totalPrice.toFixed(2) : "N/A";




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
      `}</style>

      <div className="confirmation-wrapper">
        <div className="confirmation-box">
          <h1>Purchase Confirmed!</h1>

          <div className="mb-3">
  <div><strong>Movie:</strong> {safeTitle}</div>
  <div><strong>Seat:</strong> {safeSeats}</div>
  <div><strong>Theater:</strong> {safeTheater}</div>
  <div><strong>Showtime:</strong> {safeShowtime}</div>
</div>


          {Array.isArray(foodItems) && foodItems.length > 0 && (
            <div>
              <strong>Food:</strong>
              <ul className="food-list">
                {foodItems.map((item: FoodItem, i: number) => (
                  <li key={i}>
                    {item.name} x{item.quantity} – $
                    {(item.price * item.quantity).toFixed(2)}
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
