"use client";

import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { firestore as db } from "../utils/firebase";
import AddProductButton, { Product } from "../comps/AddProductButton";
import AdminDataTable from "../comps/AdminDataTable";

async function fetchProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}

export default function AdminPage() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60, // 1 min
    refetchOnWindowFocus: false,
  });

  return (
    <main className="w-full">
      <div className="pl-4 flex w-full justify-between p-2 items-center bg-neutral-900">
        <h1 className="font-bold text-xl lg:text-2xl">Products</h1>
        <AddProductButton />
      </div>

      {isLoading && <p className="p-4">Loading products...</p>}
      {isError && <p className="p-4 text-red-500">Failed to load products.</p>}
      {products && <AdminDataTable products={products} />}
    </main>
  );
}
