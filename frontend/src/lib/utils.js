// Date formatting utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

export const formatDateRange = (startDate, endDate) => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

// ID generator
let idCounter = 1000
export const generateId = () => {
  return `id_${Date.now()}_${idCounter++}`
}

// Calculate days between dates
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = Math.abs(end - start)
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// User initials for avatars
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Status badge color mapping
export const getStatusColor = (status) => {
  const colors = {
    open: 'badge-success',
    upcoming: 'badge-success',
    full: 'badge-warning',
    closed: 'badge-danger',
    completed: 'badge-info',
    cancelled: 'badge-danger',
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
  }
  return colors[status?.toLowerCase()] || 'badge-info'
}

// Simulate network latency
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Random delay between min and max
export const randomDelay = (min = 300, max = 600) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}
