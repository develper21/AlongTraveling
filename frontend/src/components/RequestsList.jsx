import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { getInitials, formatDate } from '../lib/utils'
import Badge from './Badge'

function RequestsList({ requests, onApprove, onReject, showActions = true }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No requests yet
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map(request => {
        const requestId = request._id || request.id
        return (
          <div key={requestId} className="glass-card p-4">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {getInitials(request.user?.name || 'Unknown')}
              </div>

              {/* Request Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {request.user?.name || 'Unknown User'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {request.user?.branch} • {request.user?.year}
                    </p>
                  </div>
                  <Badge status={request.status} className="ml-2" />
                </div>

                <p className="text-gray-700 mb-2">
                  {request.message}
                </p>

                <p className="text-xs text-gray-500 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {formatDate(request.createdAt)}
                </p>

                {/* Action Buttons */}
                {showActions && request.status === 'pending' && (
                  <div className="flex items-center space-x-3 mt-4">
                    <button
                      onClick={() => onApprove(requestId)}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onReject(requestId)}
                      className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RequestsList
