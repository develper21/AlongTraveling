// ============================================================
// Cypress support file
// ------------------------------------------------------------
// Custom commands live in ./commands.js (single source of truth).
// Global hooks / exception handling live here.
// ============================================================

import './commands'

// Ignore benign ResizeObserver loop errors coming from dev builds
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})
