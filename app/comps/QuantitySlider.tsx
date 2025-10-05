"use client";
import { Slider } from "@/components/ui/slider";
import { useAtom } from "jotai";
import { quantityAtom } from "../jotai/quantityAtom";
import { useEffect } from "react";
export default function QuantitySlider({ stock, productId }) {
  const [quantity, setQuantity] = useAtom(quantityAtom);
  useEffect(() => {
    setQuantity(1);
  }, [productId, setQuantity]);
  return (
    <Slider
      max={stock}
      min={1}
      step={1}
      value={[quantity]}
      onValueChange={(val) => setQuantity(val[0])}
      className="cursor-pointer"
      trackColor="bg-neutral-700"
      rangeColor="bg-white"
      thumbColor="bg-white"
    />
  );
}
