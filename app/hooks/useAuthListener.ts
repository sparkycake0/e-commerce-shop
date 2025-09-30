"use client";
import { useEffect } from "react";
import { onAuthStateChanged, User, UserCredential } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useSetAtom } from "jotai";
import { credsAtom } from "../jotai/creds";
import { useRouter, usePathname } from "next/navigation";

export function useAuthListener() {
  const router = useRouter();
  const pathname = usePathname();
  const setCreds = useSetAtom(credsAtom);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        if (pathname === "/login") {
          router.push("/");
        }
        setCreds({ user } as UserCredential);
      } else {
        if (pathname !== "/login") {
          router.push("/login");
        }
        setCreds(null);
      }
    });
    return () => unsubscribe();
  }, [setCreds]);
}
