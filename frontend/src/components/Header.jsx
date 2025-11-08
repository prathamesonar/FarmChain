import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-semibold text-teal-600">FarmChain</Link>
        <nav className="space-x-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-teal-600">Dashboard</Link>
          <Link to="/verify/AG-2025-001" className="text-gray-700 hover:text-teal-600">Verify</Link>
          <Link to="/login" className="text-gray-700 hover:text-teal-600">Login</Link>
        </nav>
      </div>
    </header>
  )
}
