import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import NotificationToast from './components/NotificationToast'
import Login from './routes/Login'
import Register from './routes/Register'
import Home from './routes/Home'
import CreateTrip from './routes/CreateTrip'
import TripDetail from './routes/TripDetail'
import Dashboard from './routes/Dashboard'
import Profile from './routes/Profile'
import NotFound from './routes/NotFound'
import useStore from './store/useStore'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const { isAuthenticated } = useStore()
  
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {isAuthenticated && <Header />}
        <main className={`flex-grow ${isAuthenticated ? 'container mx-auto px-4 py-8 max-w-7xl' : ''}`}>
          <Routes>
            <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" replace />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
            <Route path="/trip/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {isAuthenticated && <Footer />}
      </div>
      <NotificationToast />
    </>
  )
}

export default App
