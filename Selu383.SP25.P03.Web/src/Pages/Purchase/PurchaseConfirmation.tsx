import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const PurchaseConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("lastConfirmedOrder");
    if (data) {
      setConfirmationData(JSON.parse(data));
    } else {
      navigate("/");
    }
  }, []);

  if (!confirmationData) return null;

  const {
    movieTitle,
    showtime,
    theaterId,
    seatId,
    foodItems,
    totalPrice
  } = confirmationData;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <style>{`
        .confirmation-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 80px); /* adjust for navbar height */
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
          <h1>🎉 Purchase Confirmed!</h1>

          <p><strong>🎬 Movie:</strong> {movieTitle}</p>
          <p><strong>🕒 Showtime:</strong> {showtime}</p>
          <p><strong>🏛️ Theater:</strong> {theaterId}</p>
          <p><strong>🪑 Seat Assigned:</strong> {seatId}</p>

          {foodItems && foodItems.length > 0 && (
            <div>
              <strong>🍿 Food:</strong>
              <ul className="food-list">
                {foodItems.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <p><strong>💰 Total Paid:</strong> ${totalPrice.toFixed(2)}</p>

          <button onClick={() => navigate("/")} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmation;
