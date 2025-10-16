import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'
import { usersApi, requestsApi } from '../api/api'
import useStore from '../store/useStore'
import TripCard from '../components/TripCard'
import RequestsList from '../components/RequestsList'

function Dashboard() {
  const { currentUser, addNotification } = useStore()
  const [myTrips, setMyTrips] = useState([])
  const [participations, setParticipations] = useState([])
  const [allRequests, setAllRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('my-trips')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load user's posted trips
      const tripsResponse = await usersApi.getUserTrips(currentUser._id);
      if (tripsResponse.success) {
        setMyTrips(tripsResponse.data);

        // Load requests for all user's trips (only if user is organizer)
        const requestsPromises = tripsResponse.data
          .filter(trip => trip.organizer?._id === currentUser._id || trip.organizer === currentUser._id)
          .map(trip => requestsApi.getRequestsForTrip(trip._id || trip.id));

        if (requestsPromises.length > 0) {
          const requestsResponses = await Promise.allSettled(requestsPromises);
          const requests = requestsResponses
            .filter(result => result.status === 'fulfilled' && result.value.success)
            .flatMap(result => result.value.data);
          setAllRequests(requests);
        } else {
          setAllRequests([]);
        }
      }

      // Load trips user is participating in
      const participationsResponse = await usersApi.getUserParticipations(currentUser._id);
      if (participationsResponse.success) {
        setParticipations(participationsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data',
        autoDismiss: 5000
      });
    } finally {
      setLoading(false);
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
        loadDashboardData()
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
        loadDashboardData()
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.message || 'Failed to reject request'
      })
    }
  }

  const pendingRequests = allRequests.filter(r => r.status === 'pending')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trip Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your travel plans and connect with fellow travelers
            </p>
          </div>
          <Link 
            to="/create" 
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span>New Trip</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Trips Posted</p>
              <p className="text-2xl font-bold text-gray-900">{myTrips.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Trips Joined</p>
              <p className="text-2xl font-bold text-gray-900">{participations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Section - Always Visible */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                Join Requests
                <span className="ml-2 px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  {pendingRequests.length} pending
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Manage requests from people wanting to join your trips</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No requests</h3>
              <p className="mt-1 text-sm text-gray-500">You don't have any join requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <RequestsList
                requests={allRequests}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            </div>
          )}
        </div>
      </div>

      {/* My Trips Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-1 sm:space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-trips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'my-trips'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>My Posted Trips</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {myTrips.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('joined')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'joined'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>Trips I'm Joining</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {participations.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-24 bg-gray-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* My Posted Trips Tab */}
              {activeTab === 'my-trips' && (
                <div>
                  {myTrips.length === 0 ? (
                    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No trips posted yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new trip.</p>
                      <div className="mt-6">
                        <Link
                          to="/create"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                          New Trip
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myTrips.map(trip => (
                        <TripCard key={trip._id || trip.id} trip={trip} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Joined Trips Tab */}
              {activeTab === 'joined' && (
                <div>
                  {participations.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">You haven't joined any trips yet</p>
                      <Link to="/home" className="btn-primary">
                        Browse Available Trips
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {participations.map(trip => (
                        <TripCard key={trip._id || trip.id} trip={trip} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
