import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

function FiltersBar({ filters, onFilterChange }) {
  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length
  
  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Trips</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={() => onFilterChange({})}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destination..."
              value={filters.destination || ''}
              onChange={(e) => onFilterChange({ ...filters, destination: e.target.value })}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            className="input-field"
          />
        </div>

        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Type
          </label>
          <select
            value={filters.tripType || ''}
            onChange={(e) => onFilterChange({ ...filters, tripType: e.target.value })}
            className="input-field w-full"
          >
            <option value="">All Types</option>
            <option value="vacation">Vacation</option>
            <option value="trek">Trek</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="festival">Festival</option>
            <option value="roadtrip">Road Trip</option>
            <option value="other">Other</option>
          </select>
        </div>

      </div>
    </div>
  )
}

export default FiltersBar
