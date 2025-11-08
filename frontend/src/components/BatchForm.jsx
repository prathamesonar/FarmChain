import { useState } from 'react'
import api from '../services/api'
import QRCode from 'qrcode.react'

export default function BatchForm() {
  const [cropType, setCropType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [harvestDate, setHarvestDate] = useState('')
  const [batchId, setBatchId] = useState(null)

  async function submit(e){
    e.preventDefault()
    try{
      const token = localStorage.getItem('token')
      const res = await api.post('/batches', { crop_type: cropType, quantity, harvest_date: harvestDate }, { headers: { Authorization: `Bearer ${token}` }})
      setBatchId(res.data.batch_id || res.data.batchId || res.data.id)
      alert('Batch created')
    }catch(err){
      console.error(err)
      alert('Failed to create batch')
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">Create Batch</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm">Crop Type</label>
          <input className="w-full border rounded px-3 py-2" value={cropType} onChange={e=>setCropType(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Quantity</label>
          <input className="w-full border rounded px-3 py-2" value={quantity} onChange={e=>setQuantity(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Harvest Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={harvestDate} onChange={e=>setHarvestDate(e.target.value)} />
        </div>
        <div>
          <button className="btn-primary">Create</button>
        </div>
      </form>

      {batchId && (
        <div className="mt-6">
          <h4 className="font-medium">Batch ID</h4>
          <p className="mb-3">{batchId}</p>
          <div className="inline-block bg-white p-2">
            <QRCode value={String(batchId)} size={160} />
          </div>
        </div>
      )}
    </div>
  )
}
