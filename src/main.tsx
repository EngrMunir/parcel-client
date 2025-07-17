import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Routes/Routes'
import { RouterProvider } from 'react-router-dom'
import AuthProviders from './Providers/AuthProviders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProviders>
      {/* <QueryClientProvider client={queryClient}>
      </QueryClientProvider> */}
      <RouterProvider router={router} />
    </AuthProviders>
  </StrictMode>,
)