"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useAuthListener } from "../hooks/useAuthListener";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useAuthListener();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
