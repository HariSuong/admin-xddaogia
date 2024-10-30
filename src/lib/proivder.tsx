// src/lib/providers.tsx
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReactNode } from "react"

const queryClient = new QueryClient()

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Providers
