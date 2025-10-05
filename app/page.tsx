"use client";
import { useState, useEffect } from "react";
import { firestore } from "./utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { Product } from "./comps/AddProductButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  function getRandomItems<T>(array: T[], n: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  function getRandomFromArray<T>(arr: T[], count: number): T[] {
    return arr.sort(() => Math.random() - 0.5).slice(0, count);
  }
  function getRandomProductsByType(products: Product[]) {
    const types = [...new Set(products.map((p) => p.type))];
    const randomTypes = getRandomFromArray(types, 3);
    return randomTypes.map((type) => {
      const filtered = products.filter((p) => p.type === type);
      return getRandomFromArray(filtered, 5).map((p) => ({
        name: p.name,
        imageLink: p.imageLink,
        price: p.price,
        type: p.type,
      }));
    });
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "products"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(items);
      },
    );
    return () => unsubscribe();
  }, []);
  const sliders = products.length > 0 ? getRandomProductsByType(products) : [];

  return (
    <main className="h-max gap-12 p-4 lg:p-12 flex flex-col items-center justify-between">
      <h1 className="text-2xl lg:text-5xl w-full text-center p-4 mb-12 font-bold">
        Recommended only for you!
      </h1>
      {sliders.length === 3 &&
        sliders.map((slider, sliderIdx) => (
          <Carousel key={sliderIdx} className="w-3/4">
            <h1 className="lg:text-4xl text-xl font-bold ml-6">
              {slider[0]?.type}
            </h1>
            <CarouselContent>
              {slider.map((p, index) => (
                <CarouselItem
                  key={index}
                  className="bg-neutral-800 p-4 lg:p-6 w-20 grow lg:w-56 flex justify-center lg:justify-around"
                >
                  <img
                    src={p.imageLink}
                    alt=""
                    className="rounded-full w-36 lg:w-96"
                  />
                  <div className="flex flex-col gap-6 justify-center p-2 lg:p-4 ml-4 lg:ml-12">
                    <h1 className="lg:text-5xl text-2xl font-bold">{p.name}</h1>
                    <h1 className="lg:text-2xl text-xl font-bold">
                      {p.price} RSD
                    </h1>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        ))}
      <div className="mt-24">
        <h1 className="text-center mb-6 text-2xl font-bold">
          Some of the best sold products!
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
          {getRandomItems(products, 15).map((p, index) => (
            <main
              key={index}
              className="bg-neutral-800 rounded-md flex flex-col items-center justify-between gap-6"
            >
              <div className="p-4 bg-">
                <img src={p.imageLink} className="w-56 rounded-full" alt="" />
              </div>
              <div className="w-full flex flex-col p-4 gap-4">
                <h1 className="text-3xl">{p.name}</h1>
                <h1 className="max-h-32 truncate">{p.description}</h1>
                <button className="p-4 px-6 rounded-md bg-neutral-400 text-black w-max hover:bg-green-400 transition-colors duration-150">
                  {p.price} RSD
                </button>
              </div>
            </main>
          ))}
        </div>
      </div>
    </main>
  );
}
