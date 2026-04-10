import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx' // ✅ NEW

createRoot(document.getElementById('root')).render(
  <CartProvider> {/* ✅ FIRST */}
    <AuthProvider> {/* ✅ THEN */}
      <App />
    </AuthProvider>
  </CartProvider>
)