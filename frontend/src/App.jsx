import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import FarmerDashboard from './pages/FarmerDashboard'
import VerifyBatch from './pages/VerifyBatch'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<FarmerDashboard />} />
            <Route path="/verify/:id" element={<VerifyBatch />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
