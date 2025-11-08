import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function VerifyBatch(){
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get(`/batches/${id}/verify`)
        setData(res.data)
      }catch(err){
        console.error(err)
      }
    }
    if(id) load()
  },[id])

  if(!data) return <div className="card">Loading...</div>

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold">Verify Batch: {id}</h2>
      <div className="mt-4">
        <p><strong>Crop:</strong> {data.crop_type || data.cropType}</p>
        <p><strong>Quantity:</strong> {data.quantity}</p>
        <p><strong>Harvest Date:</strong> {data.harvest_date || data.harvestDate}</p>
        <p><strong>Blockchain History:</strong></p>
        <pre className="mt-2 bg-gray-100 p-3 rounded text-sm overflow-x-auto">{JSON.stringify(data.history || data, null, 2)}</pre>
      </div>
    </div>
  )
}
