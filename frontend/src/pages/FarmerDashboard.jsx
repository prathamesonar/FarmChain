import BatchForm from '../components/BatchForm'

export default function FarmerDashboard(){
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">Farmer Dashboard</h2>
        <p className="text-sm text-gray-600">Create and manage your harvest batches.</p>
      </div>

      <BatchForm />

      <div className="card">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <p className="text-sm text-gray-500">(Listing and transfer UI will be added later.)</p>
      </div>
    </div>
  )
}
