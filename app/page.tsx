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

  const sliders = products.length > 0 ? getRandomProductsByType(products) : [];

  return (
    <main className="h-max gap-12 p-4 lg:p-12 flex flex-col items-center justify-between">
      <h1 className="text-2xl lg:text-5xl w-full text-center p-4 mb-12 font-bold">
        Recommended only for you!
      </h1>
      {sliders.length === 3 &&
        sliders.map((slider, sliderIdx) => (
          <Carousel key={sliderIdx}>
            <h1 className="lg:text-4xl text-xl font-bold ml-6">
              {slider[0]?.type}
            </h1>
            <CarouselContent>
              {slider.map((p, index) => (
                <CarouselItem
                  key={index}
                  className="bg-neutral-800 p-4 lg:p-6 w-20 lg:w-56 flex justify-center lg:justify-around"
                >
                  <img
                    src={p.imageLink}
                    alt=""
                    className="rounded-full w-36 lg:w-96"
                  />
                  <div className="flex flex-col gap-6 justify-center p-2 lg:p-4 ml-4 lg:ml-12">
                    <h1 className="lg:text-5xl text-2xl font-bold">{p.name}</h1>
                    <h1 className="lg:text-2xl text-xl font-bold">
                      {p.price} $
                    </h1>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ))}
    </main>
  );
}
