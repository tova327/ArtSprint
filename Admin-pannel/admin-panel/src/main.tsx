import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from 'sonner'
import AuthProvider from './components/auth/AuthProvider.tsx'

import Router from './routs/Router.tsx';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode><>
  <QueryClientProvider client={queryClient}>
  <AuthProvider>   <Router/>
    <Toaster /></AuthProvider></QueryClientProvider>
 </>
  </StrictMode>,
)
