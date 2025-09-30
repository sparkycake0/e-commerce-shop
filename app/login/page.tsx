"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Google from "../assets/googleIcon.png";
import Image from "next/image";
import github from "../assets/github-brands-solid-full.svg";
import { googleProvider, githubProvider, auth } from "../utils/firebase";
import { signInWithPopup, type Auth, type AuthProvider } from "firebase/auth";
import { useSetAtom } from "jotai";
import { credsAtom } from "../jotai/creds";
import { useRouter } from "next/navigation";

export default function Login() {
  const setCreds = useSetAtom(credsAtom);
  const router = useRouter();
  const loginWithPopup = async (
    authentication: Auth,
    provider: AuthProvider,
  ) => {
    try {
      const result = await signInWithPopup(authentication, provider);
      setCreds(result);
      router.push("/");
      return result;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <main className="h-screen flex flex-col items-center justify-between gap-4">
      <h1 className="mt-12 text-2xl lg:text-3xl font-extrabold">
        LOGIN TO OUR BEAUTIFULL STORE!
      </h1>
      <form className="flex flex-col gap-6">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label>Username</Label>
          <Input type="text" id="username" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label>Email</Label>
          <Input type="email" id="email" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label>Password</Label>
          <Input type="password" id="password" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-lg text-center">or</h1>
          <div className="flex gap-4 justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                loginWithPopup(auth, googleProvider);
              }}
              className="rounded-xl bg-neutral-900 w-max p-2 cursor-pointer"
            >
              <Image src={Google} alt="" className="w-12" />
            </button>{" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                loginWithPopup(auth, githubProvider);
              }}
              className="rounded-xl bg-neutral-900 w-max p-2 cursor-pointer"
            >
              <Image src={github} alt="" className="w-12" />
            </button>
          </div>
        </div>
        <Button
          variant={"default"}
          type="submit"
          className="mt-6 cursor-pointer"
        >
          Submit
        </Button>
      </form>
      <div className="w-32 h-32"></div>
    </main>
  );
}
