import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CurrencyRupeeIcon,
  TruckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { tripsApi, requestsApi, messagesApi } from '../api/api'
import { formatDateRange, getInitials, getDaysBetween } from '../lib/utils'
import Badge from '../components/Badge'
import RequestModal from '../components/RequestModal'
import RequestsList from '../components/RequestsList'
import ChatPanel from '../components/ChatPanel'
import useStore from '../store/useStore'

function TripDetail() {
  const { id } = useParams()
  const { currentUser, addNotification } = useStore()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [messages, setMessages] = useState([])
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState('details')

  const fetchMessages = useCallback(async () => {
    try {
      const messagesResponse = await messagesApi.getMessages(id)
      if (messagesResponse.success) {
        setMessages(messagesResponse.data || [])
      }
    } catch (err) {
      console.error('Error refreshing messages:', {
        error: err.message,
        tripId: id,
        response: err.response?.data
      })
    }
  }, [id])

  useEffect(() => {
    loadTripDetails()
  }, [id])

  const loadTripDetails = async () => {
    setLoading(true);
    
    // Validate trip ID format
    if (!id || typeof id !== 'string' || id.length < 12) {
      const errorMsg = 'Invalid trip ID format';
      console.error(errorMsg, { tripId: id });
      addNotification({
        type: 'error',
        message: errorMsg
      });
      setLoading(false);
      return;
    }

    try {
      // Load trip details
      const response = await tripsApi.getTrip(id);
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load trip details');
      }

      const tripData = response.data;
      setTrip(tripData);
      
      // Check if user is participant
      const isParticipant = tripData.participants?.some(p => 
        (p._id || p.id) === currentUser._id
      );
      
      // Load messages if user is participant
      if (isParticipant) {
        try {
          await fetchMessages();
        } catch (err) {
          console.error('Error loading messages:', {
            error: err.message,
            tripId: id,
            response: err.response?.data
          });
          // Don't show error to user for messages, as the trip might still be usable
        }
      }

      // Load requests if user is organizer
      const organizerId = tripData.organizer?._id || tripData.organizer;
      if (organizerId === currentUser._id) {
        try {
          const requestsResponse = await requestsApi.getRequestsForTrip(id);
          if (requestsResponse.success) {
            setRequests(requestsResponse.data || []);
          } else {
            console.warn('Failed to load requests:', requestsResponse.error);
          }
        } catch (err) {
          console.error('Error loading requests:', {
            error: err.message,
            tripId: id,
            response: err.response?.data
          });
          // Don't show error to user for requests, as the trip might still be usable
        }
      }
    } catch (error) {
      console.error('Error loading trip:', {
        error: error.message,
        tripId: id,
        stack: error.stack,
        response: error.response?.data
      });
      
      addNotification({
        type: 'error',
        message: error.message || 'Failed to load trip details',
        autoDismiss: 5000
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSendRequest = async (message) => {
    try {
      const response = await requestsApi.sendRequest(id, message)
      if (response.success) {
        setShowRequestModal(false)
        addNotification({
          type: 'success',
          message: 'Join request sent successfully!'
        })
        loadTripDetails() // Reload to check request status
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to send request'
      })
    }
  }

  const handleSendMessage = async (messageText) => {
    try {
      const response = await messagesApi.sendMessage(id, messageText)
      if (response.success) {
        setMessages(prev => [...prev, response.data])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      addNotification({
        type: 'error',
        message: 'Failed to send message'
      })
    }
  }

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await requestsApi.approveRequest(requestId)
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Request approved!'
        })
        loadTripDetails() // Reload to update participants
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to approve request'
      })
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await requestsApi.rejectRequest(requestId)
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Request rejected'
        })
        loadTripDetails()
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to reject request'
      })
    }
  }

  const isJoined = useMemo(() => {
    if (!trip || !currentUser?._id) return false
    return trip.participants?.some(p => (p._id || p.id) === currentUser._id)
  }, [trip, currentUser])

  useEffect(() => {
    if (!isJoined || activeTab !== 'chat') return
    fetchMessages()
    const interval = setInterval(() => {
      fetchMessages()
    }, 5000)
    return () => clearInterval(interval)
  }, [isJoined, activeTab, fetchMessages])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 space-y-4">
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-4 w-1/2"></div>
          <div className="skeleton h-32 w-full"></div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500 text-lg">Trip not found</p>
          <Link to="/home" className="btn-primary mt-4 inline-block">
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  // Handle both backend and frontend field names
  const organizer = trip.organizer || {}
  const organizerId = organizer._id || organizer.id || trip.ownerId
  const isOwner = organizerId === currentUser._id
  
  const maxSeats = trip.maxParticipants || trip.seatsTotal || 0
  const currentSeats = trip.currentParticipants || trip.seatsOccupied || 0
  const seatsLeft = maxSeats - currentSeats
  
  const startDate = trip.startDate || trip.dateFrom
  const endDate = trip.endDate || trip.dateTo
  const tripDuration = getDaysBetween(startDate, endDate)
  
  // Check if user has pending request
  const userRequest = requests.find(r => 
    (r.user?._id || r.userId) === currentUser._id && r.status === 'pending'
  )
  const hasRequested = !!userRequest

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link to="/home" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to trips</span>
      </Link>

      {/* Trip Header */}
      <div className="glass-card p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {trip.title}
            </h1>
            <div className="flex items-center space-x-2 text-blue-600 mb-4">
              <MapPinIcon className="w-5 h-5" />
              <span className="text-lg font-medium">{trip.destination}</span>
            </div>
          </div>
          <Badge status={trip.status} className="text-lg px-4 py-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <CalendarIcon className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-semibold text-gray-900">
              {tripDuration} {tripDuration === 1 ? 'day' : 'days'}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <UserGroupIcon className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Seats</p>
            <p className="text-lg font-semibold text-gray-900">
              {seatsLeft} left
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <CurrencyRupeeIcon className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{trip.estimatedCost || trip.budgetEstimate || 0}
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <TruckIcon className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Mode</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {trip.mode || trip.travelMode}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isOwner && !isJoined && trip.status === 'open' && !hasRequested && (
          <button
            onClick={() => setShowRequestModal(true)}
            className="btn-primary w-full md:w-auto"
          >
            Request to Join
          </button>
        )}

        {!isOwner && hasRequested && !isJoined && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            Your join request is pending approval
          </div>
        )}

        {isJoined && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            ✓ You're part of this trip!
          </div>
        )}

        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            You are the trip organizer
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="glass-card mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trip Details
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'participants'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Participants ({trip.participants.length})
          </button>
          {isOwner && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Requests ({requests.filter(r => r.status === 'pending').length})
            </button>
          )}
          {isJoined && (
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Group Chat
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Dates</h3>
                <p className="text-gray-700">{formatDateRange(startDate, endDate)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Type</h3>
                <span className="badge badge-info capitalize">{trip.type || trip.tripType}</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-700">{trip.description || trip.notes || 'No additional notes provided.'}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Trip Organizer</h3>
                <Link to={`/profile/${organizer._id || organizer.id}`}>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {getInitials(organizer.name || 'Unknown')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{organizer.name}</p>
                      <p className="text-sm text-gray-600">{organizer.branch} • {organizer.year}</p>
                      <p className="text-sm text-gray-500">{organizer.email}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="space-y-4">
              {trip.participants?.map(participant => {
                const participantId = participant._id || participant.id
                return (
                  <Link key={participantId} to={`/profile/${participantId}`}>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {getInitials(participant.name)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-600">{participant.branch} • {participant.year}</p>
                      </div>
                      {participantId === organizerId && (
                        <Badge status="info">Organizer</Badge>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Requests Tab (Owner Only) */}
          {activeTab === 'requests' && isOwner && (
            <RequestsList
              requests={requests.filter(r => r.status === 'pending')}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && isJoined && (
            <ChatPanel
              tripId={trip._id || trip.id}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleSendRequest}
        tripTitle={trip.title}
      />
    </div>
  )
}

export default TripDetail
