"use client";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../utils/firebase";
import { Product } from "../comps/AddProductButton";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState({
    name: "",
    maxPrice: 0,
    minPrice: 0,
    selectedPrice: 0,
    type: "",
  });
  const [price, setPrice] = useState(0);
  const [filteredP, setFilteredP] = useState<Product[]>([]);
  const router = useRouter();
  async function fetchPriceRange() {
    try {
      const snapshot = await getDocs(collection(firestore, "products"));
      const allProducts: Product[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Product;
        return {
          ...data,
          id: doc.id,
        };
      });
      setProducts(allProducts);
      const prices = snapshot.docs.map((doc) => doc.data().price);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setPrice(max);
        setFilter((prev) => ({
          ...prev,
          minPrice: min,
          maxPrice: max,
          selectedPrice: price,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPriceRange();
  }, []);
  useEffect(() => {
    const filteredProducts = products.filter((product) => {
      const matchesName =
        filter.name === "" ||
        product.name.toLowerCase().includes(filter.name.toLowerCase());
      const matchesType = filter.type === "" || product.type === filter.type;
      let matchesPrice: boolean;
      if (filter.selectedPrice === 0) {
        matchesPrice = product.price <= filter.maxPrice;
      } else {
        matchesPrice = product.price <= filter.selectedPrice;
      }
      return matchesName && matchesType && matchesPrice;
    });
    setFilteredP(filteredProducts);
    console.log(filteredP);
    console.log(filter);
    console.log(filteredP);
  }, [filter]);

  const types = [
    {
      label: "Upper Clothes",
      items: ["Shirts", "Sweaters", "Hoodies", "Jackets", "Blazers"],
    },
    {
      label: "Bottom Clothes",
      items: ["Jeans", "Pants", "Sweatpants", "Shorts", "Skirts"],
    },
    {
      label: "Outerwear",
      items: ["Coats", "Leather Jackets", "Puffer Jackets", "Denim Jackets"],
    },
    {
      label: "Footwear",
      items: ["Sneakers", "Boots", "Sandals", "Heels", "Flip Flops"],
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
  ];

  return (
    <main className="h-full w-full">
      <div className="flex flex-col items-center">
        <div className="p-1 gap-1.5 bg-neutral-800 hover:bg-neutral-700 transition-colors duration-150 w-3/5 rounded-full flex mt-5">
          <Search />
          <input
            type="text"
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="outline-none w-full h-full bg-transparent"
          />
        </div>

        <div className="w-full p-4 text-center flex gap-4 items-center">
          <div className="grow">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <h1 className="p-2 rounded-xl hover:bg-neutral-700 transition-colors duration-150 bg-neutral-800 cursor-pointer">
                  {filter.type === "" ? "All" : filter.type}
                </h1>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-none outline-none bg-neutral-900 flex flex-col gap-2 p-2">
                <DropdownMenuItem
                  onClick={() => setFilter({ ...filter, type: "" })}
                >
                  All
                </DropdownMenuItem>
                {types.map((type, index) => (
                  <DropdownMenuSub key={index}>
                    <DropdownMenuSubTrigger className="cursor-pointer outline-none">
                      {type.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="border-none bg-neutral-800 flex flex-col gap-1">
                        {type?.items?.map((item, idx) => (
                          <DropdownMenuItem
                            key={idx}
                            className="underline cursor-pointer outline-none"
                            onClick={() => setFilter({ ...filter, type: item })}
                          >
                            {item}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grow">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 bg-neutral-800 cursor-pointer hover:bg-neutral-700 rounded-xl transition-colors duration-150 w-full h-full outline-none">
                <h1 className="text-center h-full w-full">
                  {filter.maxPrice === 0 ? "Price" : `Up to ${price} RSD`}
                </h1>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-neutral-800 outline-none border-none p-3 w-64">
                <DropdownMenuGroup className="w-full">
                  <div className="p-2 w-full">
                    <Slider
                      min={filter.minPrice}
                      max={filter.maxPrice}
                      step={50}
                      value={[price]}
                      onValueChange={(val) => {
                        const newPrice = val[0];
                        setPrice(newPrice);
                        setFilter((prev) => ({
                          ...prev,
                          selectedPrice: newPrice,
                        }));
                      }}
                      className="cursor-pointer"
                      trackColor="bg-gray-900"
                      rangeColor="bg-white"
                      thumbColor="bg-white"
                    />
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="w-full p-4 lg:p-16 px-8 lg:px-24 place-items-center h-max grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredP.map((p, idx) => (
          <div
            key={idx}
            className="flex lg:w-4/5 w-full h-36 bg-neutral-800 rounded-xl"
          >
            <img
              src={p.imageLink}
              alt=""
              className="size-36 rounded-bl-xl rounded-tl-xl"
            />
            <div className="p-4 flex flex-col justify-around w-full">
              <h1 className="text-xl">{p.name}</h1>
              <button className="w-max rounded-xl font-bold text-left cursor-pointer text-2xl">
                {p.price} RSD
              </button>
            </div>
            <ChevronRight
              onClick={() => {
                router.push(`/store/${p.id}`);
              }}
              className="size-24 self-center hover:translate-x-1 transition-transform duration-150 h-full cursor-pointer"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
