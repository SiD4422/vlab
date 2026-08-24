import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CollegeProvider } from './contexts/CollegeContext'
import { useAuth } from './contexts/AuthContext'
import './index.css'
import App from './App.jsx'

// Inner wrapper so CollegeProvider can read the authenticated user from AuthContext
function AppWithCollege() {
  const { user } = useAuth();
  return (
    <CollegeProvider user={user}>
      <App />
    </CollegeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppWithCollege />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

