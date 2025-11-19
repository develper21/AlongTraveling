import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { tripsApi } from '../api/api'
import TripForm from '../components/TripForm'
import useStore from '../store/useStore'

function CreateTrip() {
  const navigate = useNavigate()
  const { addNotification } = useStore()

  const handleSubmit = async (tripData) => {
    try {
      const response = await tripsApi.createTrip(tripData)
      
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Trip created successfully! 🎉',
          duration: 3000
        })
        navigate(`/trip/${response.data._id || response.data.id}`)
      }
    } catch (error) {
      console.error('Error creating trip:', error)
      addNotification({
        type: 'error',
        message: error.message || 'Failed to create trip. Please try again.',
        duration: 4000
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to trips
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Plan Your Next Adventure
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your travel plans and connect with fellow travelers for an unforgettable journey together.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trip Details
            </h2>
            <div className="h-1 w-16 bg-blue-500 rounded-full"></div>
          </div>

          <TripForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default CreateTrip
