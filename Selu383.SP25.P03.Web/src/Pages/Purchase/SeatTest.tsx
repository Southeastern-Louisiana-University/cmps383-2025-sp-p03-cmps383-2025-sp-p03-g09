import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

interface Seat {
  id: number;
  row: string;
  column: number;
  isReserved: boolean;
  reservedByUserId?: string;
}

const SeatTest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [takenSeatIds, setTakenSeatIds] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const navigate = useNavigate();

  const movieId = searchParams.get("movieId");
  const locationId = searchParams.get("locationId");
  const showtime = searchParams.get("showtime");
  const theaterId = searchParams.get("theaterId");

  const guestId =
    localStorage.getItem("guestId") ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
      return id;
    })();

  useEffect(() => {
    const loadSeats = async () => {
      if (!theaterId) return;

      try {
        const seatRes = await fetch(`/api/seats/theater/${theaterId}`);
        const seatData = await seatRes.json();
        setSeats(seatData);

        if (movieId && locationId && showtime) {
          const params = new URLSearchParams({ movieId, locationId, showtime });
          const ticketRes = await fetch(`/api/tickets/byshowtime?${params}`);
          const ticketData = await ticketRes.json();

          const backendIds = Array.isArray(ticketData)
            ? ticketData.map((t: any) => t.seatId)
            : [];

          let localSeatIds: number[] = [];
          const confirmationRaw = localStorage.getItem("lastConfirmedOrder");
          if (confirmationRaw) {
            const parsed = JSON.parse(confirmationRaw);
            if (parsed?.ticket?.showtime === showtime && Array.isArray(parsed.seats)) {
              localSeatIds = parsed.seats.map((s: any) => s.seatId);
            }
          }

          const allIds = new Set<number>([...backendIds, ...localSeatIds]);
          setTakenSeatIds(Array.from(allIds));
        }
      } catch (err) {
        console.error("Failed to load seats:", err);
      }
    };

    loadSeats();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadSeats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [theaterId, movieId, locationId, showtime]);

  const toggleSeat = async (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      await fetch(`/api/seats/${theaterId}/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Guest-ID": guestId,
        },
        body: JSON.stringify(seat),
      });
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else if (!takenSeatIds.includes(seat.id)) {
      if (selectedSeats.length >= 6) {
        alert("You can only select up to 6 seats.");
        return;
      }

      const res = await fetch(`/api/seats/${theaterId}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Guest-ID": guestId,
        },
        body: JSON.stringify(seat),
      });

      if (res.ok) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert("Seat reservation failed.");
      }
    }
  };

  const rowToLetter = (row: string | number) => {
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

  const handleConfirmSeats = () => {
    if (selectedSeats.length === 0 || !movieId || !locationId || !showtime || !theaterId) {
      alert("Missing required data.");
      return;
    }

    const cartItems = selectedSeats.map((seat) => ({
      seatId: seat.id,
      row: seat.row,
      column: seat.column,
      movieId: Number(movieId),
      locationId: Number(locationId),
      theaterId: Number(theaterId),
      showtime,
    }));

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate(
      `/movies/${movieId}/purchase?showtime=${encodeURIComponent(showtime)}&locationId=${locationId}&theaterId=${theaterId}`
    );
  };

  const renderSeatGrid = () => {
  const sorted = [...seats].sort((a, b) => {
    const rowA = parseInt(a.row);
    const rowB = parseInt(b.row);
    return rowA === rowB ? a.column - b.column : rowA - rowB;
  });

  const rowNums = Array.from(new Set(sorted.map((s) => parseInt(s.row)))).sort((a, b) => a - b);

  return rowNums.map((rowNum) => {
    const rowSeats = sorted.filter((s) => parseInt(s.row) === rowNum);

    return (
      <div
        key={rowNum}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "8px",
          gap: "8px", // <-- Add a small gap between letter and seats
        }}
      >
        {/* Add the row letter label */}
        <div
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {rowToLetter(rowNum)}
        </div>

        {/* Wrap all the seats into a flex div */}
        <div style={{ display: "flex" }}>
          {rowSeats.map((seat) => {
            const isSelected = selectedSeats.some((s) => s.id === seat.id);
            const isTaken = takenSeatIds.includes(seat.id);

            return (
              <button
                key={seat.id}
                onClick={() => toggleSeat(seat)}
                disabled={isTaken && !isSelected}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px",
                  height: "40px",
                  margin: "4px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  backgroundColor: isSelected
                    ? "#3B82F6"
                    : isTaken
                    ? "#DC2626"
                    : "#10B981",
                  color: "#ffffff",
                  border: "none",
                  cursor: isTaken && !isSelected ? "not-allowed" : "pointer",
                }}
              >
                {rowToLetter(seat.row)}
                {seat.column}
              </button>
            );
          })}
        </div>
      </div>
    );
  });
};

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <Navbar />
      <main className="py-16">
        <section className="flex flex-col items-center justify-center text-center gap-8">
          
          {/* Centered Seat Selection */}
          <div style={{ width: "100%", textAlign: "center" }}>
            <h1 className="text-4xl font-bold mb-6">Seat Selection</h1>
          </div>

          {/* Centered Seats and Button */}
          <div
            className="flex flex-col items-center"
            style={{
              margin: "0 auto",
              width: "fit-content",
              textAlign: "center",
            }}
          >
            {renderSeatGrid()}

            {/* Updated Button */}
            <button
              onClick={handleConfirmSeats}
              disabled={selectedSeats.length === 0}
              className={`px-8 py-4 rounded-lg font-semibold mt-8 text-white`}
              style={{
                backgroundColor: selectedSeats.length === 0 ? "#ec3838" : "#ec3838",
                opacity: selectedSeats.length === 0 ? 0.5 : 1,
                cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Confirm Seats & Continue
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SeatTest;
