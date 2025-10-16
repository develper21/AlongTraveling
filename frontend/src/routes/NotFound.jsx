import { Link } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-card p-12 text-center max-w-md">
        <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link to="/home" className="btn-primary inline-flex items-center space-x-2">
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
