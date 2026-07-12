import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

/**
 * React Application Entry Point
 * Renders the virtual DOM tree, wraps the components in React.StrictMode for diagnostics,
 * and sets up the global AuthProvider context.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
