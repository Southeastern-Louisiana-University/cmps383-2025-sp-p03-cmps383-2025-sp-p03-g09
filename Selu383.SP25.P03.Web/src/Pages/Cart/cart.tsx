import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

if (!localStorage.getItem("guestId")) {
  localStorage.setItem("guestId", crypto.randomUUID());
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  seatIds?: number[];
  seats?: { id: number; row: string; column: number }[];
  row?: string;
  column?: number;
  theaterId?: number;
  movieId?: number;
  locationId?: number;
  showtime?: string;
  food?: {
    id: number;
    name: string;
    price: number;
  };
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  
    const enriched = storedItems
      .filter((item: any) => item.name && item.price && item.quantity)
      .map((item: any) => {
        if (item.seatId && item.row && item.column) {
          return {
            ...item,
            seats: [{ id: item.seatId, row: item.row, column: item.column }],
          };
        }
        return item;
      });
  
    setCartItems(enriched);
    calculateTotal(enriched);
  
    fetch("/api/authentication/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((user) => setUserId(user.id))
      .catch(() => setUserId(null));
      const selectedLoc = localStorage.getItem("selectedLocation");
if (selectedLoc) {
  try {
    const parsed = JSON.parse(selectedLoc);
    if (parsed?.name) setLocationName(parsed.name);
  } catch (err) {
    console.warn("Failed to parse selectedLocation:", err);
  }
}

  }, []);
  

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
  

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    localStorage.removeItem("cartItems");
  };

  const handleConfirmPurchase = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const ticketItems = cartItems.filter((item) => !item.food);
if (ticketItems.length === 0) {
  alert("No ticket found in cart.");
  return;
}

const allSeats = ticketItems.flatMap((item) =>
  Array.isArray(item.seats) ? item.seats.map((s) => s.id) : []
);

const ticketItem = ticketItems[0];


    const foodItemIds = cartItems
      .filter((item) => item.food)
      .flatMap((item) => Array(item.quantity).fill(item.food!.id));

    const payload: any = {
      foodItemIds,
      price: totalPrice,
      movieId: Number(ticketItem.movieId),
      locationId: ticketItem.locationId,
      theaterId: ticketItem.theaterId,
      showtime: ticketItem.showtime!,
      ticketQuantity: ticketItem.quantity,
      seatIds: allSeats,


    };

    if (userId) {
      payload.userId = userId;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!userId) {
      headers["X-Guest-ID"] = localStorage.getItem("guestId")!;
    }

    console.log("Submitting order payload:", payload);

    fetch("/api/orders", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order failed");
        return res.json();
      })
      .then((data) => {
        console.log("Order placed successfully");

        const storedLocation = localStorage.getItem("selectedLocation");
const parsedLocation = storedLocation ? JSON.parse(storedLocation) : null;

const confirmationData = {
  id: Date.now(),
  price: totalPrice,
  userId: userId || null,
  seats: ticketItems.flatMap((item) =>
    (item.seats || []).map((s) => ({
      seatId: s.id,
      row: s.row,
      column: s.column,
    }))
  ),
  
  theaterId: data.theater?.theaterNumber ?? data.theaterId,
  purchaseTime: new Date().toISOString(),
  ticket: {
    id: data.ticket?.id ?? 0,
    showtime: ticketItem.showtime,
    movie: {
      title: ticketItem.name
        .replace(/\s*\([^)]+\)/, "")
        .replace(/ - Seat [A-Z]+\d+$/, "")
        .trim()
    },
        location: { name: parsedLocation?.name || "Unknown" },
  },
  foodItems: cartItems
    .filter((item) => item.food)
    .map((item) => ({
      name: item.food!.name,
      price: item.food!.price,
      quantity: item.quantity,
    })),
};

        

        localStorage.setItem(
          "lastConfirmedOrder",
          JSON.stringify(confirmationData)
        );

        if (!userId) {
          const guestHistory = JSON.parse(
            localStorage.getItem("guestOrderHistory") || "[]"
          );
          guestHistory.push(confirmationData);
          localStorage.setItem(
            "guestOrderHistory",
            JSON.stringify(guestHistory)
          );
        }

        localStorage.removeItem("cartItems");
        window.location.href = "/purchase/confirmation";
      })
      .catch((err) => {
        console.error("Error confirming purchase:", err);
        alert("Error confirming purchase.");
      });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <style>{`
        .cart-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cart-box {
          background-color: #1f1f1f;
          padding: 2rem;
          border-radius: 8px;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #2a2a2a;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .cart-item-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .cart-item-details span {
          color: #10b981;
        }

        .remove-button {
          color: #10b981;
          cursor: pointer;
          text-decoration: underline;
        }

        .remove-button:hover {
          color: #10b981;
        }

        .cart-total {
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          margin-top: 1rem;
        }

        .cart-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .confirm-button {
          background-color: #38a169;
          color: white;
        }

        .confirm-button:hover {
          background-color: #2f855a;
        }

        .clear-button {
          background-color: #10b981;
          color: white;
        }

        .clear-button:hover {
          background-color: #10b981;
        }

        .cart-box,
        .cart-container,
        .cart-item,
        .cart-item-details,
        .cart-item-details div,
        .cart-item-details span,
        .text-white {
          color: #ffffff !important;
          text-shadow: 0 0 1px rgba(255, 255, 255, 0.15);
}

      `}</style>

      <div className="cart-container">
        <div className="cart-box">
          <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                  <div className="text-white font-medium">
  {item.food
    ? `${item.name} x${item.quantity}`
    : `Movie: ${item.name
        .replace(/\s*\([^)]+\)/, "")
        .replace(/ - Seat [A-Z]+\d+$/, "")
      }`
  }
</div>


  {!item.food && locationName && (
    <div>Location: {locationName}</div>
  )}

  {!item.food && Array.isArray(item.seats) && item.seats.length === 1 && (
    <div>Seat: {rowToLetter(item.seats[0].row)}{item.seats[0].column}</div>
  )}

  {!item.food && Array.isArray(item.seats) && item.seats.length > 1 && (
    <div>Seats: {item.seats.map(s => `${rowToLetter(s.row)}${s.column}`).join(", ")}</div>
  )}

  {!item.food && item.theaterId && (
    <div>Theater: {item.theaterId}</div>
  )}

  {!item.food && item.showtime && (
    <div>
      Showtime:{" "}
      {new Date(item.showtime).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
    </div>
  )}

  <div className="text-green-400 font-semibold mt-1">
    ${ (item.price * item.quantity).toFixed(2) }
  </div>
</div>


                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>

              <div className="cart-buttons">
                <button
                  className="action-button confirm-button"
                  onClick={handleConfirmPurchase}
                >
                  Confirm Purchase
                </button>

                <button
                  className="action-button clear-button"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
