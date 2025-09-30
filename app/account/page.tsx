"use client";
import { useAtomValue } from "jotai";
import { credsAtom } from "../jotai/creds";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../utils/firebase";

export default function AccountPage() {
  const creds = useAtomValue(credsAtom);
  if (!creds) {
    return <h1 className="ml-52">You are not logged in</h1>;
  }
  const photoURL = creds.user.photoURL ?? "asd";
  const router = useRouter();
  return (
    <main>
      <div className="pl-32 w-full h-72 bg-neutral-800 flex items-end justify-center">
        <img
          src={photoURL}
          alt=""
          className="rounded-full translate-y-5 size-32"
        />
      </div>
      <div className="pl-32 w-full mt-12 flex flex-col items-center">
        <h1 className="font-bold text-3xl">{creds.user.displayName}</h1>
        <div className="mt-4">
          <h1>Email: {creds.user.email}</h1>
        </div>
        <button
          onClick={async () => {
            signOut(auth).then(() => {
              router.push("/login");
            });
          }}
          className="p-2 rounded-xl bg-red-500 font-bold text-xl mt-12"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
