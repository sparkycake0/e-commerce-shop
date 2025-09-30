import type { Product } from "./AddProductButton";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../utils/firebase";

interface ProductsTableProps {
  products: Product[];
}
export default function AdminDataTable({ products }: ProductsTableProps) {
  return (
    <div className="w-3/4 justify-self-center mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12 overflow-x-auto">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex flex-col gap-12 items-center bg-neutral-900 rounded-lg p-2"
        >
          <div className="flex flex-col items-center gap-2">
            <h1>{p.name}</h1>
            <img src={p.imageLink} className="w-32 h-32 rounded-md" />
            <h1>ID: {p.id}</h1>
            <h1>Price: {p.price} RSD</h1>
            <h1>Stock: {p.stock}</h1>
            <h1>Type: {p.type}</h1>
          </div>
          <button
            onClick={() => {
              deleteDoc(doc(firestore, "products", p.id));
              alert("Succesfully deleted product!");
            }}
            className="bg-red-500 rounded-lg p-2 font-bold px-4"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
