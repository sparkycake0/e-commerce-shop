import { atom } from "jotai";
import type { UserCredential } from "firebase/auth";
export const credsAtom = atom<UserCredential | null>(null);
