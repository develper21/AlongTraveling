import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { 
  UserCircleIcon, 
  PlusIcon, 
  HomeIcon, 
  ChartBarIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { getInitials } from '../lib/utils'
import useStore from '../store/useStore'
import logo from "../assets/logo.png"

function Header() {
  const { currentUser, logout } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home'
    return location.pathname.startsWith(path)
  }

  const navBaseClasses = 'px-4 py-2 rounded-xl transition-all flex items-center space-x-2 font-medium'
  const navInactiveClasses = 'text-white hover:bg-white/10'
  const navActiveClasses = 'text-white bg-white/20 ring-2 ring-white/20 backdrop-blur-sm'

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <header className="gradient-header shadow-2xl sticky top-0 z-50 animate-slide-in-top">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-all group-hover:scale-110">
              <img
                src={logo}
                alt="HopAlong logo"
                className="w-10 h-10 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div
              className="text-yellow-400 text-4xl font-extrabold tracking-tight drop-shadow-md font-[1000]"
              style={{ fontFamily: `'Changa One', serif` }}
            >
              HopAlong
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              to="/home" 
              className={`${navBaseClasses} ${isActive('/home') ? navActiveClasses : navInactiveClasses}`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/create" 
              className={`${navBaseClasses} ${isActive('/create') ? navActiveClasses : navInactiveClasses}`}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Trip</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`${navBaseClasses} ${isActive('/dashboard') ? navActiveClasses : navInactiveClasses}`}
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all border border-white/30 backdrop-blur-sm ${location.pathname.startsWith('/profile') ? 'bg-white/30 ring-2 ring-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(currentUser.name)}
                </div>
                <span className="text-yellow-200 font-semibold hidden md:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 glass-card animate-scale-in z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                        {getInitials(currentUser.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-600 truncate">{currentUser.name}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                        <p className="text-xs text-gray-400">{currentUser.branch} • {currentUser.year}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      to={`/profile/me`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <UserCircleIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 font-medium">My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 cursor-pointer"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20 space-y-2 animate-slide-in-bottom">
            <Link 
              to="/home" 
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/home') ? 'bg-white/30 text-white ring-2 ring-white/30' : 'text-white hover:bg-white/20'}`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              to="/create" 
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/create') ? 'bg-white/30 text-white ring-2 ring-white/30' : 'text-white hover:bg-white/20'}`}
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">Create Trip</span>
            </Link>
            <Link 
              to="/dashboard" 
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard') ? 'bg-white/30 text-white ring-2 ring-white/30' : 'text-white hover:bg-white/20'}`}
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </nav>
        )}
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false)
            setShowMobileMenu(false)
          }}
        />
      )}
    </header>
  )
}

export default Header

