import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface Seat {
  id: number;
  row: number;
  column: number;
  isReserved: boolean;
}

const SelectTickets: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatCount, setSeatCount] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/seats?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        setSeats(data);
        const count = data.length > 0 ? data.length : 200;
        setSeatCount(count);
      });
  }, [movieId]);
  

  const toggleSeat = (seatId: number, isReserved: boolean) => {
    if (isReserved) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

 
  const getGridDimensions = (count: number): [number, number] => {
    if (count === 300) return [15, 20];
    if (count === 250) return [14, 18];
    return [10, 20]; 
  };

  const [, cols] = getGridDimensions(seatCount);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Select Your Seats</h1>

        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {seats.map((seat) => {
            const isSelected = selectedSeats.includes(seat.id);
            return (
              <div
                key={seat.id}
                className={`h-10 w-full rounded cursor-pointer flex items-center justify-center
                  ${seat.isReserved ? 'bg-gray-700 cursor-not-allowed' :
                    isSelected ? 'bg-green-500' : 'bg-gray-300 text-black'}`}
                onClick={() => toggleSeat(seat.id, seat.isReserved)}
              >
                {seat.row}-{seat.column}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
        <button
          className="bg-red-600 text-white px-6 py-3 mt-4 text-lg rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedSeats.length === 0}
          onClick={() => {}}
        >
          Buy Tickets Now
        </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTickets;
