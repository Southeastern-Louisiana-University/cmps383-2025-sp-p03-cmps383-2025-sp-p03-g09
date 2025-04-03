import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Fetch cart items from the server
    fetch("/api/orders/user", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }
        setCartItems(
          data.map((order: any) => ({
            id: order.id,
            name: `Order #${order.id}`,
            quantity: 1, // Adjust as needed
            price: order.price,
          }))
        );

        // Calculate total price
        const total = data.reduce(
          (sum: number, order: any) => sum + order.price,
          0
        );
        setTotalPrice(total);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load cart items.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul className="mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <div className="flex justify-between items-center bg-gray-800 p-4 rounded">
                    <span className="font-medium">{item.name}</span>
                    <span>
                      {item.quantity} x ${item.price.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
