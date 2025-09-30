"use client";
import {
  LucideShoppingBag,
  Boxes,
  Home,
  ShoppingCart,
  Settings,
  UserStar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { credsAtom } from "../jotai/creds";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const creds = useAtomValue(credsAtom);
  const [opened, setOpened] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpened(true)}
        className={`border-2 bg-neutral-800 hover:scale-110 absolute top-4 left-4 flex lg:hidden cursor-pointer border-transparent rounded-full p-2 w-max ${opened ? "-translate-y-full" : "translate-y-0"}`}
      >
        <Boxes size={32} />
      </button>
      <nav
        className={` ${opened ? "translate-x-0" : "-translate-x-full hidden lg:translate-x-0 lg:flex"} transition-transform duration-200 p-4 w-max h-screen ${pathname == "/login" ? "hidden" : "flex"} flex-col justify-between items-center bg-neutral-900`}
      >
        <button
          onClick={() => setOpened(false)}
          className="border-2 cursor-pointer border-transparent rounded-full p-2 w-max"
        >
          <Boxes size={64} />
        </button>
        <div className=" w-max flex flex-col gap-4">
          <Link
            href={"/"}
            className="bg-neutral-700 rounded-full p-4 w-max hover:bg-neutral-800 transition-colors duration-100 cursor-pointer"
          >
            <Home className="size-8" />
          </Link>
          <Link
            href={"/store"}
            className="bg-neutral-700 rounded-full p-4 w-max hover:bg-neutral-800 transition-colors duration-100 cursor-pointer"
          >
            <LucideShoppingBag className="size-8" />
          </Link>
          <Link
            href={"/cart"}
            className="bg-neutral-700 rounded-full p-4 w-max hover:bg-neutral-800 transition-colors duration-100 cursor-pointer"
          >
            <ShoppingCart className="size-8" />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2">
          {creds?.user.email === "ogirajko248@gmail.com" ? (
            <div className="bg-neutral-900 rounded-full p-4 w-max hover:-translate-y-1.5 transition-transform duration-100">
              <Link href={"/admin"}>
                <UserStar className="size-8" />
              </Link>
            </div>
          ) : (
            <div></div>
          )}{" "}
          <Link
            href={"/settings"}
            className="bg-neutral-900 rounded-full p-4 w-max hover:-translate-y-1.5 transition-transform duration-100"
          >
            <Settings className="size-8" />
          </Link>
          <Link
            href={"/account"}
            className="bg-neutral-900 rounded-full p-4 w-max hover:-translate-y-1.5 transition-transform duration-100"
          >
            <img
              src={creds?.user.photoURL ?? "asd"}
              alt=""
              className="size-12 rounded-full"
            />
          </Link>
        </div>
      </nav>
    </>
  );
}
