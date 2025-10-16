import { getStatusColor } from '../lib/utils'

function Badge({ status, children, className = '' }) {
  const colorClass = getStatusColor(status || '')
  
  return (
    <span className={`badge ${colorClass} ${className}`}>
      {children || status}
    </span>
  )
}

export default Badge
