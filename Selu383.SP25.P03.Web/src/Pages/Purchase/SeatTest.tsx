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

  const loadSeats = () => {
    if (!theaterId) return;

    fetch(`/api/seats/theater/${theaterId}`)
      .then((res) => res.json())
      .then(setSeats)
      .catch((err) => console.error("Failed to fetch seats:", err));

    if (movieId && locationId && showtime) {
      const params = new URLSearchParams({ movieId, locationId, showtime });

      fetch(`/api/tickets/byshowtime?${params}`)
        .then((res) => res.json())
        .then((data) => {
          const backendIds = Array.isArray(data) ? data.map((t: any) => t.seatId) : [];

          let localSeatIds: number[] = [];
          try {
            const confirmationRaw = localStorage.getItem("lastConfirmedOrder");
            if (confirmationRaw) {
              const parsed = JSON.parse(confirmationRaw);
              if (parsed?.ticket?.showtime === showtime && Array.isArray(parsed.seats)) {
                localSeatIds = parsed.seats.map((s: any) => s.seatId);
              }
            }
          } catch (err) {
            console.warn("Could not parse confirmation seats:", err);
          }

          const all = new Set<number>();
          backendIds.forEach((id) => all.add(id));
          localSeatIds.forEach((id) => all.add(id));

          setTakenSeatIds(Array.from(all));
        })
        .catch((err) => console.error("Failed to fetch taken seats:", err));
    }
  };

  useEffect(() => {
    loadSeats();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadSeats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [theaterId, movieId, locationId, showtime]);

  const toggleSeat = async (seat: Seat) => {
    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (isSelected) {
      await fetch(`/api/seats/${theaterId}/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Guest-ID": guestId
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
          "X-Guest-ID": guestId
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

  const handleConfirmSeats = () => {
    if (selectedSeats.length === 0 || !movieId || !locationId || !showtime || !theaterId) {
      alert("Missing required data.");
      return;
    }

    const cartItems = selectedSeats.map(seat => ({
      seatId: seat.id,
      row: seat.row,
      column: seat.column,
      movieId: Number(movieId),
      locationId: Number(locationId),
      theaterId: Number(theaterId),
      showtime,
    }));

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate(`/movies/${movieId}/purchase?showtime=${encodeURIComponent(showtime)}&locationId=${locationId}&theaterId=${theaterId}`);
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
        <div key={rowNum} style={{ display: "flex", marginBottom: "6px", justifyContent: "center" }}>
          
          {rowSeats.map((seat) => {
            const isSelected = selectedSeats.some((s) => s.id === seat.id);
            const isTaken = takenSeatIds.includes(seat.id);
            const style = {
              width: "36px",
              height: "36px",
              margin: "2px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              cursor: isTaken && !isSelected ? "not-allowed" : "pointer",
              backgroundColor: isSelected
                ? "#3B82F6"
                : isTaken
                ? "#DC2626"
                : "#10B981",
              color: "#ffffff",
              border: "none"
            };

            return (
              <button
                key={seat.id}
                onClick={() => toggleSeat(seat)}
                disabled={isTaken && !isSelected}
                style={style}
              >
                <span>{rowToLetter(seat.row)}{seat.column}</span>
              </button>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Seat Selection</h1>
        {renderSeatGrid()}
        <div className="text-center mt-6">
          <button
            onClick={handleConfirmSeats}
            disabled={selectedSeats.length === 0}
            style={{
              backgroundColor: "#DC2626",
              padding: "12px 24px",
              borderRadius: "6px",
              fontSize: "1rem",
              color: "#ffffff !important",
              cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
              opacity: selectedSeats.length === 0 ? 0.6 : 1
            }}
          >
            Confirm Seats & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatTest;
