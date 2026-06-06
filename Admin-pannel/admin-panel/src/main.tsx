import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Toaster } from 'sonner'
import Router from './routs/Router.tsx'
import AuthProvider from './components/auth/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode><>
  <AuthProvider>   <Router />
    <Toaster /></AuthProvider>
 </>
  </StrictMode>,
)
