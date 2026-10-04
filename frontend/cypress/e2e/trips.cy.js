// ============================================================
// Trips e2e tests (browse, filter, create)
// Requires the backend running + seeded demo user
// (cd backend && npm run seed).
// ============================================================

describe('Trips', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.loginAsDemoUser()
  })

  context('Browsing', () => {
    it('shows the home page with the filters bar', () => {
      cy.visit('/home')
      cy.contains('h2', 'Filter Trips').should('be.visible')
      cy.get('input[placeholder="Search destination..."]').should('be.visible')
    })

    it('lists seeded trips on the home page', () => {
      cy.visit('/home')
      // TripCard renders the trip title inside an <h3> inside its card.
      // Scoped selector avoids Footer/section <h3>s while trips are loading.
      cy.get('.glass-card-premium h3', { timeout: 15000 }).should(
        'have.length.gte',
        1
      )
    })

    it('opens a trip detail page from the trip list', () => {
      cy.visit('/home')
      cy.get('.glass-card-premium h3', { timeout: 15000 })
        .first()
        .then(($title) => {
          const title = $title.text().trim()
          cy.wrap($title).click()
          cy.url({ timeout: 15000 }).should('match', /\/trip\//)
          cy.contains('h1', title).should('be.visible')
        })
    })
  })

  context('Filtering', () => {
    it('finds a created trip using the destination search filter', () => {
      const destination = `Filterville ${Date.now()}`

      cy.createTripUi({ destination }).then((trip) => {
        cy.visit('/home')
        cy.get('input[placeholder="Search destination..."]').type(
          trip.destination
        )
        cy.contains('.glass-card-premium h3', trip.title, {
          timeout: 15000,
        }).should('be.visible')
      })
    })
  })

  context('Creating', () => {
    it('creates a new trip through the form and opens its detail page', () => {
      cy.createTripUi().then((trip) => {
        cy.contains('h1', trip.title).should('be.visible')
      })
    })

    it('shows field errors when submitting the trip form empty', () => {
      cy.visit('/create')
      cy.contains('button', 'Create Trip').click()
      cy.contains('p', 'Title is required').should('be.visible')
      cy.contains('p', 'Destination is required').should('be.visible')
      cy.contains('p', 'Start date is required').should('be.visible')
    })
  })
})
