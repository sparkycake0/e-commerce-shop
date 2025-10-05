import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/utils/firebase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/app/comps/AddProductButton";
import AddToCart from "@/app/utils/AddToCart";
import QuantitySlider from "@/app/comps/QuantitySlider";
import { quantityAtom } from "@/app/jotai/quantityAtom";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const docRef = doc(firestore, "products", params.id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    notFound();
  }
  const product = { id: snap.id, ...snap.data() } as Product;
  let quantity = 1;
  return (
    <main className="h-full w-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-neutral-900 rounded-2xl p-6 shadow-xl">
        <Link
          href="/store"
          className="flex items-center text-gray-400 mb-4 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to store
        </Link>

        <div className="w-full flex flex-col items-center text-center">
          <img
            src={product.imageLink}
            alt={product.name}
            className="w-64 h-64 object-cover rounded-xl mb-6"
          />
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-gray-400 mb-2">{product.type}</p>
          <p className="text-2xl font-bold mb-2">{product.price} RSD</p>
          <p className="mb-2">{product.description}</p>
          <div className="mb-6 flex flex-col gap-2">
            <p>Quantity: </p>
            <QuantitySlider quantity={quantity} stock={product.stock} />
          </div>
          <AddToCart
            product={{
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              imageLink: product.imageLink,
            }}
          />
        </div>
      </div>
    </main>
  );
}
