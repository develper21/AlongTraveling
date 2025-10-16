import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { authApi } from '../api/api'
import useStore from '../store/useStore'

function Register() {
  const navigate = useNavigate()
  const { login, addNotification } = useStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const iitrEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*iitr\.ac\.in$/

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!iitrEmailRegex.test(formData.email)) {
      setError('Please use your IITR email address ending with .iitr.ac.in')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authApi.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        branch: formData.branch.trim(),
        year: formData.year
      })

      if (response.success) {
        login(response.data, response.data.token)
        addNotification({
          type: 'success',
          message: 'Account created successfully! Welcome to HopAlong.'
        })
        navigate('/home')
      } else {
        setError(response.error || 'Unable to create account. Please try again.')
      }
    } catch (err) {
      if (err.status === 400) {
        setError(err.error || 'Unable to create account. Please verify your details.')
      } else {
        setError(err.error || err.message || 'Unable to reach the server. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        <div className="hidden md:flex flex-col justify-center space-y-8 animate-slide-in-top">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl glow-hover">
                <span className="text-3xl">🧭</span>
              </div>
              <h1 className="text-5xl font-bold gradient-text">
                HopAlong
              </h1>
            </div>
            <p className="text-2xl text-gray-700 font-semibold">
              Start Your Journey with Fellow IITR Students
              </p>
            <p className="text-lg text-gray-600">
              Create an account with your IITR email, discover trips, and plan adventures with the campus community.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Plan Trips Together</h3>
                <p className="text-gray-600 text-sm">Find companions who share your destination and interests.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Split Costs Effortlessly</h3>
                <p className="text-gray-600 text-sm">Coordinate budgets and make travel affordable for everyone.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Community</h3>
                <p className="text-gray-600 text-sm">Travel with trusted IITR students using institute email addresses.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center animate-slide-in-bottom">
          <div className="glass-card-premium p-8 md:p-10 w-full max-w-md space-y-6">
            <div className="text-center space-y-1.5">
              <div className="md:hidden mb-6">
                <h1 className="text-4xl font-bold gradient-text mb-2">HopAlong</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
              <p className="text-gray-600">Use your IITR email to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="input-field"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  IITR Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@dept.iitr.ac.in"
                    className="input-field"
                    required
                    disabled={isSubmitting}
                  />
                  {formData.email && iitrEmailRegex.test(formData.email) && (
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Choose a secure password"
                  className="input-field"
                  required
                  disabled={isSubmitting}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-2">
                  Branch (optional)
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  className="input-field"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                  Year (optional)
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isSubmitting}
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600 animate-fade-in">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
