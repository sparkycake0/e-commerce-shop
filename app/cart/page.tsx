"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageLink: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchCart(user.uid);
      } else {
        setUserId(null);
        setCartItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchCart(uid: string) {
    setLoading(true);
    try {
      const cartRef = doc(firestore, "carts", uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const data = cartSnap.data();
        setCartItems(data.cart || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy() {
    if (!userId) return alert("You must be logged in.");

    setBuying(true);
    try {
      // Clear the user's cart
      const cartRef = doc(firestore, "carts", userId);
      await updateDoc(cartRef, { cart: [] });

      setCartItems([]); // update UI immediately
      alert("Purchase successful! (Functionality coming soon)");
    } catch (err) {
      console.error("Failed to complete purchase:", err);
      alert("Failed to complete purchase.");
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center text-lg text-gray-300">
        Loading your cart...
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="flex h-screen items-center justify-center text-lg text-gray-300">
        You must be logged in to view your cart.
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex h-screen items-center justify-center text-lg text-gray-300">
        Your cart is empty.
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-6 bg-neutral-950 text-white">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {cartItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageLink}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-400 text-sm">
                  {item.price} RSD × {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-bold">{item.price * item.quantity} RSD</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xl font-semibold">
        Total:{" "}
        {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}{" "}
        RSD
      </div>

      <button
        onClick={handleBuy}
        disabled={buying}
        className="mt-6 bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
      >
        {buying ? "Processing..." : "Buy Now"}
      </button>
    </main>
  );
}
