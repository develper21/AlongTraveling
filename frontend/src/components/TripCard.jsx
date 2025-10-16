import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  MapPinIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CurrencyRupeeIcon,
  TruckIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { formatDateRange, getInitials } from '../lib/utils'
import Badge from './Badge'
import { requestsApi } from '../api/api'
import useStore from '../store/useStore'

function TripCard({ trip }) {
  const navigate = useNavigate()
  const { isAuthenticated, currentUser, addNotification } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Backend uses different field names
  const maxSeats = trip.maxParticipants || trip.seatsTotal || 0
  const currentSeats = trip.currentParticipants || trip.seatsOccupied || 0
  const seatsLeft = maxSeats - currentSeats
  const organizer = trip.organizer || trip.owner

  const tripId = trip._id || trip.id
  const organizerId = organizer?._id || organizer?.id
  const isOwner = currentUser?._id && organizerId && currentUser._id === organizerId
  const isJoined = Array.isArray(trip.participants)
    ? trip.participants.some(participant => {
        if (!participant) return false
        if (typeof participant === 'string') return participant === currentUser?._id
        return (participant._id || participant.id) === currentUser?._id
      })
    : false
  const isFull = seatsLeft <= 0
  const isOpen = (trip.status || '').toLowerCase() === 'open' || (trip.status || '').toLowerCase() === 'upcoming'
  const disableReason = (() => {
    if (isOwner) return 'You are the organizer'
    if (isJoined) return 'You already joined this trip'
    if (isFull) return 'This trip is currently full'
    if (!isOpen) return `Trip is ${trip.status}`
    return null
  })()
  const canRequest = !isOwner
  const isButtonDisabled = isSubmitting || !!disableReason

  const statusMessage = disableReason

  const defaultMessage = `Hi ${organizer?.name || 'there'}, I'd love to join the "${trip.title}" trip!`

  const handleCardClick = () => {
    navigate(`/trip/${tripId}`)
  }

  const handleRequest = async () => {
    if (!isAuthenticated) {
      addNotification?.({
        type: 'info',
        message: 'Please log in to send a join request',
        autoDismiss: 4000
      })
      navigate('/login', { state: { from: `/trip/${tripId}` } })
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await requestsApi.sendRequest(tripId, defaultMessage)
      if (response?.success) {
        addNotification?.({
          type: 'success',
          message: 'Join request sent to organizer!',
          autoDismiss: 4000
        })
      } else {
        throw new Error(response?.error || 'Failed to send request')
      }
    } catch (error) {
      addNotification?.({
        type: 'error',
        message: error?.error || error?.message || 'Failed to send request',
        autoDismiss: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="group h-full"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleCardClick()
        }
      }}
    >
      <div className="glass-card-premium p-6 h-full flex flex-col group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link
                to={`/trip/${tripId}`}
                onClick={(event) => event.stopPropagation()}
                className="block"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                  {trip.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <MapPinIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">{trip.destination}</span>
              </div>
            </div>
            <Badge status={trip.status} className="ml-2 capitalize shadow-sm" />
          </div>

          {/* Trip Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">{formatDateRange(trip.startDate || trip.dateFrom, trip.endDate || trip.dateTo)}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <UserGroupIcon className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium">
                {seatsLeft > 0 
                  ? `${seatsLeft} seat${seatsLeft > 1 ? 's' : ''} left`
                  : 'Full'
                } <span className="text-gray-500">({currentSeats}/{maxSeats})</span>
              </span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                <CurrencyRupeeIcon className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium">₹{(trip.estimatedCost || trip.budgetEstimate || 0).toLocaleString()} <span className="text-gray-500">per person</span></span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                <TruckIcon className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-medium capitalize">{trip.mode || trip.travelMode}</span>
            </div>
          </div>

          {/* Trip Type Badge with icon */}
          <div className="mb-5">
            <span className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-sm">
              <SparklesIcon className="w-4 h-4" />
              <span className="capitalize">{trip.type || trip.tripType}</span>
            </span>
          </div>

          {/* Owner Info */}
          <div className="flex items-center space-x-3 pt-5 border-t border-gray-200 group-hover:border-gray-300 transition-colors">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
              {getInitials(organizer?.name || 'Unknown')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {organizer?.name || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {organizer?.branch} • {organizer?.year}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Link
                to={`/trip/${tripId}`}
                onClick={(event) => event.stopPropagation()}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View details →
              </Link>

              {statusMessage && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  <LockClosedIcon className="w-4 h-4" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>

            {canRequest && (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  if (isButtonDisabled) return
                  handleRequest()
                }}
                disabled={isButtonDisabled}
                className={`w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isButtonDisabled
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-gray-300'
                    : 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-white hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 focus:ring-blue-500'
                }`}
              >
                <PaperAirplaneIcon className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>
                  {isButtonDisabled
                    ? disableReason === 'You already joined this trip'
                      ? 'Already Joined'
                      : isSubmitting
                        ? 'Please wait…'
                        : disableReason
                    : isSubmitting
                      ? 'Sending request…'
                      : 'Request to Join Trip'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripCard
