import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  EnvelopeIcon, 
  AcademicCapIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { usersApi } from '../api/api'
import { getInitials, formatDate } from '../lib/utils'
import useStore from '../store/useStore'

function Profile() {
  const { id } = useParams()
  const { currentUser } = useStore()
  const resolvedUserId = id === 'me' ? currentUser._id : id
  const [user, setUser] = useState(null)
  const [userTrips, setUserTrips] = useState([])
  const [participations, setParticipations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    branch: '',
    year: '',
    hometown: '',
    interests: '' // comma-separated
  })
  const { addNotification, updateCurrentUser } = useStore()

  useEffect(() => {
    loadProfile()
  }, [resolvedUserId])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const userResponse = await usersApi.getUser(resolvedUserId)
      if (userResponse.success) {
        setUser(userResponse.data)
        setFormData({
          name: userResponse.data.name,
          bio: userResponse.data.bio || '',
          branch: userResponse.data.branch || '',
          year: userResponse.data.year || '',
          hometown: userResponse.data.hometown || '',
          interests: Array.isArray(userResponse.data.interests)
            ? userResponse.data.interests.join(', ')
            : (userResponse.data.interests || '')
        })
      }

      const tripsResponse = await usersApi.getUserTrips(resolvedUserId)
      if (tripsResponse.success) {
        setUserTrips(tripsResponse.data)
      }

      const participationsResponse = await usersApi.getUserParticipations(resolvedUserId)
      if (participationsResponse.success) {
        setParticipations(participationsResponse.data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      addNotification({
        type: 'error',
        message: 'Failed to load profile'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      name: user.name,
      bio: user.bio || '',
      branch: user.branch || '',
      year: user.year || '',
      hometown: user.hometown || '',
      interests: Array.isArray(user.interests) ? user.interests.join(', ') : (user.interests || '')
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user.name,
      bio: user.bio || '',
      branch: user.branch || '',
      year: user.year || '',
      hometown: user.hometown || '',
      interests: Array.isArray(user.interests) ? user.interests.join(', ') : (user.interests || '')
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // prepare updates: split interests into array and trim
      const updates = {
        ...formData,
        interests: formData.interests
          ? formData.interests.split(',').map(s => s.trim()).filter(Boolean)
          : []
      }

      const response = await usersApi.updateUser(resolvedUserId, updates)
      if (response.success) {
        setUser(response.data)
        setIsEditing(false)
        
        // Update current user in store if editing own profile
        if (isOwnProfile) {
          updateCurrentUser(response.data)
        }
        
        addNotification({
          type: 'success',
          message: 'Profile updated successfully!'
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      addNotification({
        type: 'error',
        message: error.message || 'Failed to update profile'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 space-y-4">
          <div className="skeleton h-24 w-24 rounded-full"></div>
          <div className="skeleton h-6 w-1/2"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500 text-lg">User not found</p>
          <Link to="/home" className="btn-primary mt-4 inline-block">
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = (id === 'me') || (user?._id === currentUser._id || user?.id === currentUser._id)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="glass-card-premium overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 h-32"></div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
            {/* Avatar */}
            <div className="flex items-end space-x-4">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-5xl border-4 border-white shadow-xl">
                {getInitials(isEditing ? formData.name : user.name)}
              </div>
              <div className="pb-2">
                {!isEditing && (
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {isOwnProfile && !isEditing && (
              <button
                onClick={handleEdit}
                className="mt-4 md:mt-0 btn-secondary flex items-center space-x-2"
              >
                <PencilIcon className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            )}

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <XMarkIcon className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="mt-6 space-y-4">
            {/* Full Name */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-2">Full Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-base font-semibold text-gray-900">{user.name}</p>
              )}
            </div>

            {/* Email (Always Read-only) */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-2">Email {isEditing && <span className="text-red-600">(Cannot be changed)</span>}</p>
              <p className="text-base font-semibold text-gray-900">{user.email}</p>
            </div>

            {/* Branch & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-2">Branch</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g., Computer Science"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">{user.branch || '—'}</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-2">Year</p>
                {isEditing ? (
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                ) : (
                  <p className="text-base font-semibold text-gray-900">{user.year || '—'}</p>
                )}
              </div>
            </div>

            {/* Hometown & Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-2">Hometown</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g., Roorkee, Uttarakhand"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-900">{user.hometown || '—'}</p>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-2">Interests</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g., Trekking, Photography, Food"
                  />
                ) : (
                  <>
                    {Array.isArray(user.interests) && user.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base text-gray-600">—</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-500 font-medium mb-2">About / Bio</p>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field w-full min-h-[100px]"
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              ) : (
                <p className="text-base text-gray-800 leading-relaxed">{user.bio || '—'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Posted Trips */}
        <div className="glass-card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>Posted Trips</span>
              <span className="text-sm font-normal text-white bg-blue-600 px-2 py-1 rounded-full">
                {userTrips.length}
              </span>
            </h2>
          </div>
          <div className="p-6">
            {userTrips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No trips posted yet</p>
                {isOwnProfile && (
                  <Link to="/create" className="text-blue-600 hover:underline font-medium">
                    Create Your First Trip →
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {userTrips.map(trip => (
                  <Link
                    key={trip._id || trip.id}
                    to={`/trip/${trip._id || trip.id}`}
                    className="block p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {trip.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(trip.startDate || trip.dateFrom)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Joined Trips */}
        <div className="glass-card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <span>Joined Trips</span>
              <span className="text-sm font-normal text-white bg-green-600 px-2 py-1 rounded-full">
                {participations.length}
              </span>
            </h2>
          </div>
          <div className="p-6">
            {participations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No trips joined yet</p>
                {isOwnProfile && (
                  <Link to="/home" className="text-blue-600 hover:underline font-medium">
                    Browse Available Trips →
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {participations.map(trip => (
                  <Link
                    key={trip._id || trip.id}
                    to={`/trip/${trip._id || trip.id}`}
                    className="block p-4 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {trip.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(trip.startDate || trip.dateFrom)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
