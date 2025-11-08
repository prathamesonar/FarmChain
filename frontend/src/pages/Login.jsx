import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      // store token locally — simple approach for demo
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <button className="btn-primary w-full">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}
