// ============================================================
// Navigation & routing e2e tests
// Requires the backend running + seeded demo user.
// ============================================================

describe('Navigation & Routing', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.loginAsDemoUser()
  })

  it('redirects an authenticated user from / to /home', () => {
    cy.visit('/')
    cy.url().should('include', '/home')
  })

  it('navigates between pages using the header links', () => {
    cy.visit('/home')

    cy.get('header').contains('a', 'Create Trip').click()
    cy.url().should('include', '/create')
    cy.contains('h1', /Plan Your Next Adventure/i).should('be.visible')

    cy.get('header').contains('a', 'Dashboard').click()
    cy.url().should('include', '/dashboard')

    cy.get('header').contains('a', 'Home').click()
    cy.url().should('include', '/home')
  })

  it('opens My Profile from the user dropdown menu', () => {
    cy.visit('/home')
    cy.get('header button:visible').first().click()
    cy.contains('a', 'My Profile').click()
    cy.url().should('include', '/profile/me')
  })

  it('shows the 404 page for unknown routes (even when authenticated)', () => {
    cy.visit('/definitely-not-a-real-page')
    cy.contains('h1', 'Page Not Found').should('be.visible')

    cy.contains('a', 'Back to Home').click()
    cy.url().should('include', '/home')
  })

  it('renders the dashboard page', () => {
    cy.visit('/dashboard')
    cy.get('h1', { timeout: 15000 }).should('exist')
    cy.url().should('include', '/dashboard')
  })
})
