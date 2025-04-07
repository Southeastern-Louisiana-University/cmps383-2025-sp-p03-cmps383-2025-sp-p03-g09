import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(storedItems);
    calculateTotal(storedItems);
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    localStorage.removeItem("cartItems");
  };

  const extractShowtime = (name?: string) => {
    if (!name) return "Unknown";
    const match = name.match(/@ (.*?)\s?\(/);
    return match ? match[1] : "Unknown";
  };
  

  const handleConfirmPurchase = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    console.log("🧨 Submitting order(s)...", cartItems);
  
    // Assume the first item is always the ticket
    const ticketItem = cartItems[0];
  
  
    if (!ticketItem) {
      alert("No ticket found in cart. Purchase failed.");
      return;
    }
  
    const foodItems = cartItems
      .filter((item) => item !== ticketItem)
      .map((item) => `${item.name} x${item.quantity}`);
  
    const ticketTotal = ticketItem.price * ticketItem.quantity;
  
    const payload = {
      price: ticketTotal,
      userId: 1, // Use real user ID here
      theaterId: 1,
      seatId: 1,
      foodItemIds: [],
    };
  
    console.log("📦 Payload:", payload);
  
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order failed");
        console.log("✅ Order placed successfully");
  
        const confirmationData = {
          movieTitle: ticketItem.name,
          showtime: extractShowtime(ticketItem.name),
          theaterId: payload.theaterId,
          seatId: payload.seatId,
          foodItems,
          totalPrice: ticketTotal,
        };
  
        localStorage.setItem(
          "lastConfirmedOrder",
          JSON.stringify(confirmationData)
        );
        localStorage.removeItem("cartItems");
  
        window.location.href = "/purchase/confirmation";
      })
      .catch((err) => {
        console.error("❌ Error confirming purchase:", err);
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

        .remove-button {
          color: #e3342f;
          cursor: pointer;
          text-decoration: underline;
        }

        .remove-button:hover {
          color: #cc0000;
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
          background-color: #e3342f;
          color: white;
        }

        .clear-button:hover {
          background-color: #cc0000;
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
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
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
