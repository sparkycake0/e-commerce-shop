"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { firestore } from "../utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number | string;
  type: string;
  imageLink: string;
  description: string;
}
interface newProduct {
  name: string;
  price: number | string;
  stock: number | string;
  type: string;
  imageLink: string;
  description: string;
}
export default function AddProductButton() {
  const [typeDisplay, setTypeDisplay] = useState<string>("");
  const [newProduct, setNewProduct] = useState<newProduct>({
    name: "",
    price: 0,
    stock: 0,
    type: "",
    imageLink: "",
    description: "",
  });
  const handleSubmit = async () => {
    if (newProduct.type == "") {
      setTypeDisplay("Type is required");
    } else {
      addDoc(collection(firestore, "products"), newProduct);
      setNewProduct({
        name: "",
        price: 0,
        stock: 0,
        type: "",
        imageLink: "",
        description: "",
      });
      setTypeDisplay("");
      alert("Successfully added product!");
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="font-bold bg-neutral-800 p-1 rounded-xs px-2 cursor-pointer hover:bg-neutral-700 transition-colors duration-100">
          + Add
        </button>
      </SheetTrigger>
      <SheetContent className="bg-neutral-900 outline-none border-none p-4 text-white">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl font-bold">
            Add Product
          </SheetTitle>
          <SheetDescription>
            Here you can add a product with specific information about that
            product
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <h1>Product Name:</h1>
            <Input
              required
              onChange={(e) => {
                setNewProduct({ ...newProduct, name: e.target.value });
              }}
              type="text"
              value={newProduct.name}
              className="bg-neutral-800 border-none"
            />
          </div>
          <div className="mt-4">
            <h1>Product Price(euro):</h1>
            <Input
              required
              value={newProduct.price}
              onChange={(e) => {
                setNewProduct({ ...newProduct, price: e.target.value });
              }}
              type="number"
              className="bg-neutral-800 border-none"
            />
          </div>
          <div className="mt-4">
            <h1>Product Stock:</h1>
            <Input
              required
              value={newProduct.stock}
              onChange={(e) => {
                setNewProduct({ ...newProduct, stock: e.target.value });
              }}
              type="number"
              className="bg-neutral-800 border-none"
            />
          </div>
          <div className="mt-4">
            <h1>Product Type:</h1>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 font-bold bg-neutral-800 rounded-sm mt-4">
                {typeDisplay === "" ? "Select Type" : typeDisplay}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-neutral-800 border-none text-white"
                align="start"
              >
                {[
                  {
                    label: "Upper Clothes",
                    items: [
                      "Shirts",
                      "Sweaters",
                      "Hoodies",
                      "Jackets",
                      "Blazers",
                    ],
                  },
                  {
                    label: "Bottom Clothes",
                    items: ["Jeans", "Pants", "Sweatpants", "Shorts", "Skirts"],
                  },
                  {
                    label: "Outerwear",
                    items: [
                      "Coats",
                      "Leather Jackets",
                      "Puffer Jackets",
                      "Denim Jackets",
                    ],
                  },
                  {
                    label: "Footwear",
                    items: [
                      "Sneakers",
                      "Boots",
                      "Sandals",
                      "Heels",
                      "Flip Flops",
                    ],
                  },
                  {
                    label: "Accessories",
                    items: [
                      "Hats / Caps",
                      "Gloves",
                      "Sunglasses",
                      "Bags & Backpacks",
                      "Watches",
                    ],
                  },
                  {
                    label: "Underclothes",
                    items: ["Underwear", "Socks"],
                  },
                ].map((group) => (
                  <div key={group.label}>
                    <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {group.items.map((item) => (
                        <DropdownMenuItem
                          key={item}
                          onClick={() => {
                            setTypeDisplay(item);
                            setNewProduct({ ...newProduct, type: item });
                          }}
                        >
                          {item}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-neutral-600" />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4">
            <h1>Product Image</h1>
            <Input
              required
              type="text"
              value={newProduct.imageLink}
              className="flex justify-between bg-neutral-800 border-none"
              onChange={(e) => {
                setNewProduct({ ...newProduct, imageLink: e.target.value });
              }}
            />
          </div>
          <div className="mt-4">
            <h1>Product Description:</h1>
            <textarea
              required
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="w-full bg-neutral-800 h-48 min-h-48 max-h-48"
            />
          </div>
          <SheetFooter>
            <button
              type="submit"
              className="p-2 text-lg font-bold bg-white text-black rounded-xl w-full mt-8 hover:bg-gray-100 cursor-pointer"
            >
              Submit
            </button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
