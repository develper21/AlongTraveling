// ============================================================
// Custom Cypress commands for HopAlong
// ------------------------------------------------------------
// All selectors here match the REAL components:
//   Login.jsx    -> #email, #password, button[type="submit"]
//   Register.jsx -> #name, #email, #password, #branch, #year
//   TripForm.jsx -> #title, #destination, #dateFrom, #dateTo,
//                   #seatsTotal, #budgetEstimate, #travelMode,
//                   #tripType, #notes
//   Header.jsx   -> nav links by text, user dropdown = first
//                   visible button inside <header>
//
// Session persistence (src/store/useStore.js + src/api/config.js):
//   - zustand persist key : "hopalong-auth"
//   - plain token key     : "token"
// ============================================================

const AUTH_STORAGE_KEY = 'hopalong-auth'
const TOKEN_KEY = 'token'

// ---------- Low-level API helper ----------

/**
 * Request against the backend API (Cypress.env('apiUrl')).
 * Never fails the test on non-2xx — assertions are up to the caller.
 */
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: { 'Content-Type': 'application/json' },
    failOnStatusCode: false,
  })
})

/**
 * Register a brand-new unique user via the API.
 * Returns { response, payload }.
 */
Cypress.Commands.add('apiRegister', (overrides = {}) => {
  const payload = {
    name: 'Cypress Tester',
    email: `cypress.${Date.now()}@iitr.ac.in`,
    password: 'password123',
    branch: 'CSE',
    year: '3rd Year',
    ...overrides,
  }
  return cy
    .apiRequest('POST', '/auth/register', payload)
    .then((response) => cy.wrap({ response, payload }))
})

/**
 * Write an authenticated session into localStorage exactly like the app does
 * (used after cy.apiRequest / apiRegister to simulate a logged-in user).
 * Must be called after a cy.visit() so the origin exists.
 */
Cypress.Commands.add('setSession', (user) => {
  cy.window().then((win) => {
    win.localStorage.setItem(TOKEN_KEY, user.token)
    win.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        state: {
          isAuthenticated: true,
          currentUser: user,
          token: user.token,
        },
        version: 0,
      })
    )
  })
})

/**
 * Login through the real API, then store the session and return the user.
 * Requires the backend to be running (and seeded for demo credentials).
 */
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.visit('/') // establish the origin before touching localStorage
  return cy
    .apiRequest('POST', '/auth/login', { email, password })
    .then((response) => {
      expect(response.status, 'login response status').to.eq(200)
      const user = response.body.data
      expect(user.token, 'JWT token in login response').to.exist
      cy.setSession(user)
      return cy.wrap(user)
    })
})

/** Login as the seeded demo user (cd backend && npm run seed). */
Cypress.Commands.add('loginAsDemoUser', () => {
  return cy.loginByApi('rahul.sharma@iitr.ac.in', 'password123')
})

// ---------- UI helpers ----------

/** Login through the login page UI. */
Cypress.Commands.add('loginUi', (email, password) => {
  cy.visit('/')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/home')
})

/** Register through the register page UI. */
Cypress.Commands.add('registerUi', (userData = {}) => {
  const data = {
    name: 'Cypress Register',
    email: `cypress.register.${Date.now()}@iitr.ac.in`,
    password: 'password123',
    branch: 'CSE',
    year: '3rd Year',
    ...userData,
  }
  cy.visit('/register')
  cy.get('#name').type(data.name)
  cy.get('#email').type(data.email)
  cy.get('#password').type(data.password)
  if (data.branch) cy.get('#branch').type(data.branch)
  if (data.year) cy.get('#year').select(data.year)
  cy.get('button[type="submit"]').click()
  return cy.wrap(data)
})

/**
 * Open the header user dropdown (Header.jsx) and log out.
 */
Cypress.Commands.add('logoutUi', () => {
  cy.get('header button:visible').first().click()
  cy.contains('button', 'Logout').click()
})

/**
 * Create a trip through the TripForm UI and return the trip data used.
 * Dates default to +14 / +16 days (backend requires startDate >= today).
 */
Cypress.Commands.add('createTripUi', (overrides = {}) => {
  const isoDate = (daysAhead) =>
    new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

  const data = {
    title: `Cypress Trip ${Date.now()}`,
    destination: `Cypressville ${Date.now()}`,
    startDate: isoDate(14),
    endDate: isoDate(16),
    seats: '4',
    budget: '2500',
    mode: 'bus',
    type: 'vacation',
    notes: 'Trip created by the Cypress e2e suite.',
    ...overrides,
  }

  cy.visit('/create')
  cy.get('#title').type(data.title)
  cy.get('#destination').type(data.destination)
  cy.get('#dateFrom').type(data.startDate)
  cy.get('#dateTo').type(data.endDate)
  cy.get('#seatsTotal').type(data.seats)
  cy.get('#budgetEstimate').type(data.budget)
  cy.get('#travelMode').select(data.mode)
  cy.get('#tripType').select(data.type)
  cy.get('#notes').type(data.notes)
  cy.contains('button', 'Create Trip').click()

  // CreateTrip.jsx navigates to the new trip's detail page on success
  cy.url({ timeout: 15000 }).should('match', /\/trip\//)
  return cy.wrap(data)
})
