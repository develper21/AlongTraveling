import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { authApi } from '../api/api'
import useStore from '../store/useStore'

function Login() {
  const navigate = useNavigate()
  const { login } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const iitrEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*iitr\.ac\.in$/

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate IITR email
    if (!iitrEmailRegex.test(email)) {
      setError('Please use your IITR email address ending with .iitr.ac.in')
      return
    }

    setIsLoading(true)

    try {
      // Call real login API
      const response = await authApi.login(email, password)
      
      if (response.success) {
        // Store user and token
        login(response.data, response.data.token)
        navigate('/home')
      } else {
        setError(response.error || 'Invalid credentials. Please double-check your email and password.')
      }
    } catch (err) {
      if (err.status === 401) {
        setError('Invalid credentials. Please check your IITR email and password.')
      } else {
        setError(err.error || err.message || 'Unable to reach the server. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login with demo credentials
  const quickLogin = async (demoEmail) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authApi.login(demoEmail, 'password123')
      
      if (response.success) {
        login(response.data, response.data.token)
        navigate('/home')
      } else {
        setError('Demo login failed. Please ensure backend is running and demo credentials are seeded.')
      }
    } catch (err) {
      setError(err.error || err.message || 'Demo login failed. Please ensure backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-8 animate-slide-in-top">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl glow-hover">
                <span className="text-3xl">🌍</span>
              </div>
              <h1 className="text-5xl font-bold gradient-text">
                HopAlong
              </h1>
            </div>
            <p className="text-2xl text-gray-700 font-semibold">
              Your Travel Companion Awaits
            </p>
            <p className="text-lg text-gray-600">
              Connect with fellow IIT Roorkee students, share adventures, and create unforgettable memories together.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Find Travel Buddies</h3>
                <p className="text-gray-600 text-sm">Connect with students heading to the same destination</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Split Costs</h3>
                <p className="text-gray-600 text-sm">Share travel expenses and make trips more affordable</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Stay Safe</h3>
                <p className="text-gray-600 text-sm">Travel with verified IITR students you can trust</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex items-center justify-center animate-slide-in-bottom">
          <div className="glass-card-premium p-8 md:p-10 w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <div className="md:hidden mb-6">
                <h1 className="text-4xl font-bold gradient-text mb-2">HopAlong</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-600">Sign in with your IITR email to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  IITR Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@iitr.ac.in"
                    className="input-field"
                    required
                    disabled={isLoading}
                  />
                  {email && iitrEmailRegex.test(email) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 animate-fade-in">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Quick Login (Demo)</span>
              </div>
            </div> */}

            {/* Quick login buttons for demo */}
            {/* <div className="space-y-2">
              {[
                { name: 'Rahul Sharma', email: 'rahul.sharma@iitr.ac.in' },
                { name: 'Priya Patel', email: 'priya.patel@iitr.ac.in' },
                { name: 'Arjun Kumar', email: 'arjun.kumar@iitr.ac.in' }
              ].map((user) => (
                <button
                  key={user.email}
                  onClick={() => quickLogin(user.email)}
                  disabled={isLoading}
                  className="w-full p-3 text-left rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>
              ))}
              <p className="text-xs text-center text-gray-500 mt-2">
                Demo password: password123. New here? Use your IITR email above to register, then sign in with the same password.
              </p>
            </div> */}

            <p className="text-center text-sm text-gray-500">
              New to HopAlong?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
