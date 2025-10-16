import { useEffect } from 'react'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import useStore from '../store/useStore'

function NotificationToast() {
  const { notifications, removeNotification } = useStore()

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = notifications.map(notification => 
      setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)
    )

    return () => timers.forEach(timer => clearTimeout(timer))
  }, [notifications, removeNotification])

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />
      default:
        return <InformationCircleIcon className="w-6 h-6 text-gray-500" />
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} border-2 rounded-2xl shadow-2xl p-4 flex items-start space-x-3 animate-slide-in-top backdrop-blur-xl`}
        >
          <div className="flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationToast
