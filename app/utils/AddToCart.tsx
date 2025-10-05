"use client";

import { useState } from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore, auth } from "../utils/firebase";
import { useAtom } from "jotai";
import { quantityAtom } from "../jotai/quantityAtom";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageLink: string;
}

interface AddToCartProps {
  product: Omit<CartItem, "quantity">; // quantity will come from atom
}

export default function AddToCart({ product }: AddToCartProps) {
  const [loading, setLoading] = useState(false);
  const [quantity] = useAtom(quantityAtom); // read quantity from Jotai

  async function handleAddToCart() {
    if (!auth.currentUser) {
      alert("You must be logged in to add items to cart.");
      return;
    }

    setLoading(true);
    const userId = auth.currentUser.uid;
    const cartRef = doc(firestore, "carts", userId);

    try {
      const cartSnap = await getDoc(cartRef);

      const itemToAdd: CartItem = {
        ...product,
        quantity, // use quantity from atom
      };

      if (!cartSnap.exists()) {
        await setDoc(cartRef, { userID: userId, cart: [itemToAdd] });
      } else {
        await updateDoc(cartRef, {
          cart: arrayUnion(itemToAdd),
        });
      }

      alert(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition w-full"
    >
      {loading ? "Adding..." : `Add ${quantity} to Cart`}
    </button>
  );
}
