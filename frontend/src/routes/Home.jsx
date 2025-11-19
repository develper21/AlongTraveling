import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { tripsApi } from '../api/api';
import { SparklesIcon, PlusIcon, MapIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import TripCard from '../components/TripCard';
import FiltersBar from '../components/FiltersBar';
import useStore from '../store/useStore';

const Home = () => {
  const { currentUser } = useStore() || {};
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('latest');
  const [retryCount, setRetryCount] = useState(0);
  
  // Add state for statistics
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalParticipants: 0,
    averageCostPerPerson: 0,
    loading: true,
    error: null
  });

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading trips with filters:', filters);
      
      // Safely access filter properties with optional chaining
      const backendFilters = {
        ...(filters?.destination && { destination: filters.destination }),
        ...(filters?.dateFrom && { startDate: filters.dateFrom }),
        ...(filters?.dateTo && { endDate: filters.dateTo }),
        ...(filters?.tripType && { type: filters.tripType }),
        status: 'upcoming' // Changed from 'open' to 'upcoming' to match backend
      };

      console.log('Backend filters:', backendFilters);
      let response = await tripsApi.getTrips(backendFilters);
      console.log('API response:', response);
      
      // If the filtered request fails or returns no data, try without filters
      if (!response?.success || !response?.data?.length) {
        console.log('Trying to load all upcoming trips without filters...');
        response = await tripsApi.getTrips({ status: 'upcoming' });
      }
      
      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to fetch trips');
      }

      const tripsData = Array.isArray(response?.data) ? response.data : [];
      console.log('Final trips data:', tripsData);
      setTrips(tripsData);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error loading trips:', err);
      setError(err?.message || err?.error || 'Failed to load trips. Please try again.');
      // Auto-retry logic (max 3 retries)
      if (retryCount < 3) {
        setTimeout(() => setRetryCount(c => c + 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, retryCount]);

  // Memoize sorted trips to prevent unnecessary re-renders
  const sortedTrips = useMemo(() => {
    if (!Array.isArray(trips)) return [];
    
    const tripsCopy = [...trips];
    
    switch (sortBy) {
      case 'budget-low':
        return tripsCopy.sort((a, b) => (Number(a.estimatedCost) || 0) - (Number(b.estimatedCost) || 0));
      case 'budget-high':
        return tripsCopy.sort((a, b) => (Number(b.estimatedCost) || 0) - (Number(a.estimatedCost) || 0));
      case 'date':
        return tripsCopy.sort((a, b) => (new Date(a.startDate) || 0) - (new Date(b.startDate) || 0));
      case 'latest':
      default:
        return tripsCopy.sort((a, b) => (new Date(b.createdAt) || 0) - (new Date(a.createdAt) || 0));
    }
  }, [trips, sortBy]);

  // Load trips when dependencies change
  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Load statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await tripsApi.getTripStats();
        if (response?.success) {
          setStats(prev => ({
            ...prev,
            ...response.data,
            loading: false
          }));
        } else {
          throw new Error(response?.error || 'Failed to load statistics');
        }
      } catch (err) {
        console.error('Error loading statistics:', err);
        setStats(prev => ({
          ...prev,
          error: err.message || 'Failed to load statistics',
          loading: false
        }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="glass-card-premium p-6 sm:p-10 md:p-12 lg:p-16 mb-12 text-center relative overflow-hidden rounded-3xl animate-fade-in">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 -right-48 w-[32rem] h-[32rem] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -bottom-32 -left-48 w-[32rem] h-[32rem] bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_70%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-700 rounded-full text-sm font-semibold shadow-sm border border-blue-100/50">
            <SparklesIcon className="w-4 h-4 text-blue-600" />
            <span>Welcome back, {currentUser?.name?.split(' ')[0] || 'Traveler'}! 👋</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6 leading-tight">
            Find Your Perfect <br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Travel Companion</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            Connect with fellow travelers, share travel costs, and make unforgettable memories together on your next adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link 
              to="/create" 
              className="btn-primary group inline-flex items-center justify-center space-x-3 text-lg px-8 py-4 rounded-xl transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Your Trip</span>
            </Link>
            <button 
              onClick={loadTrips}
              className="inline-flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
              aria-label="Refresh trips"
            >
              <div className="p-2 bg-gray-100 group-hover:bg-blue-50 rounded-full transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* Quick Stats - Real Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: <MapIcon className="w-6 h-6 text-blue-600" />, 
                value: stats.loading ? '...' : stats.totalTrips, 
                label: 'Active Trips',
                color: 'blue'
              },
              { 
                icon: <UserGroupIcon className="w-6 h-6 text-purple-600" />, 
                value: stats.loading ? '...' : stats.totalParticipants, 
                label: 'Active Travelers',
                color: 'purple'
              },
              { 
                icon: <CurrencyDollarIcon className="w-6 h-6 text-green-600" />, 
                value: stats.loading ? '...' : `₹${stats.averageCostPerPerson?.toLocaleString() || '0'}`, 
                label: 'Avg. Cost per Person',
                color: 'green'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`glass-card p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-${stat.color}-100/50`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 bg-${stat.color}-50 rounded-xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-slide-in-bottom mb-8">
        <div className="glass-card p-4 sm:p-6">
          <FiltersBar filters={filters} onFilterChange={setFilters} />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      <div className="mb-8 animate-slide-in-bottom">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Available Trips <span className="text-blue-600">({sortedTrips.length})</span>
          </h2>
          <div className="flex items-center space-x-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white hover:border-gray-300 cursor-pointer"
              aria-label="Sort trips"
            >
              <option value="latest">Sort by: Latest</option>
              <option value="budget-low">Sort by: Budget (Low to High)</option>
              <option value="budget-high">Sort by: Budget (High to Low)</option>
              <option value="date">Sort by: Departure Date</option>
            </select>
            <button 
              onClick={loadTrips}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Refresh trips"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="glass-card p-6 space-y-4 animate-pulse">
                <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-10 w-full rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : sortedTrips.length === 0 ? (
          <div className="glass-card-premium p-16 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <MapIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              No trips match your filters. Try adjusting your search criteria or create your own trip!
            </p>
            <Link to="/create" className="btn-primary inline-flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Create New Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTrips.map((trip, index) => (
              <div 
                key={trip.id || `trip-${index}`} 
                className="stagger-item" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

Home.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

export default Home;
