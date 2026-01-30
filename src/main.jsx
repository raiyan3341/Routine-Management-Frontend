// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Authprovider import korun
import AuthProvider from './components/context/Authprovider'
import { RouterProvider } from "react-router";
import { router } from './Routes/Routes.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)