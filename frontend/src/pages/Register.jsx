import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('farmer')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      await api.post('/auth/register', { name, email, password, role })
      alert('Registered — please login')
      navigate('/login')
    }catch(err){
      console.error(err)
      alert('Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Role</label>
            <select className="w-full border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="farmer">Farmer</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
            </select>
          </div>
          <div>
            <button className="btn-primary w-full">Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}
