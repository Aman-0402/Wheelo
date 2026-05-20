import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  color: '#FFFFFF',
                  border: '1px solid #2A2A2A',
                },
                success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
