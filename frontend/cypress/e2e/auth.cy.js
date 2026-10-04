// ============================================================
// Authentication e2e tests
// ------------------------------------------------------------
// - "Login / Register pages" + "Protected routes" + "404"
//   contexts are pure client-side and run WITHOUT a backend.
// - "Full auth flows" requires the backend running
//   (demo credentials need: cd backend && npm run seed).
// ============================================================

describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  context('Login page (client-side)', () => {
    it('renders the login form', () => {
      cy.visit('/')
      cy.contains('h2', 'Welcome Back!').should('be.visible')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.contains('button', 'Sign In').should('be.visible')
    })

    it('blocks an invalid email at the browser level without calling the API', () => {
      cy.visit('/')
      cy.get('#email').type('not-an-email')
      cy.get('#password').type('password123')
      cy.get('button[type="submit"]').click()

      // The email input is type="email", so native HTML5 constraint
      // validation blocks the submit before the custom error can render
      cy.get('#email').then(($input) => {
        expect($input[0].validity.valid, 'native email validation fails').to.be
          .false
      })
      // stays on the login page
      cy.url().should('not.include', '/home')
      cy.contains('h2', 'Welcome Back!').should('be.visible')
    })

    it('links to the register page', () => {
      cy.visit('/')
      cy.contains('a', 'Create an account').click()
      cy.url().should('include', '/register')
    })
  })

  context('Register page (client-side validation)', () => {
    it('renders the register form with all fields', () => {
      cy.visit('/register')
      cy.contains('h2', 'Create Your Account').should('be.visible')
      cy.get('#name').should('be.visible')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('#branch').should('be.visible')
      cy.get('#year').should('be.visible')
    })

    it('blocks short passwords before calling the API', () => {
      cy.visit('/register')
      cy.get('#name').type('Cypress Tester')
      cy.get('#email').type('cypress.short@iitr.ac.in')
      cy.get('#password').type('123')
      cy.get('button[type="submit"]').click()

      cy.contains('p', 'Password must be at least 6 characters long').should(
        'be.visible'
      )
      cy.url().should('include', '/register')
    })

    it('links back to the login page', () => {
      cy.visit('/register')
      cy.contains('a', 'Sign in here').click()
      cy.url().should('not.include', '/register')
    })
  })

  context('Protected routes (client-side guard)', () => {
    const protectedRoutes = [
      '/home',
      '/create',
      '/dashboard',
      '/trip/507f1f77bcf86cd799439011',
      '/profile/me',
    ]

    protectedRoutes.forEach((route) => {
      it(`redirects an unauthenticated user from ${route} to login`, () => {
        cy.visit(route)
        cy.contains('h2', 'Welcome Back!').should('be.visible')
      })
    })
  })

  context('404 page', () => {
    it('shows the NotFound page for unknown routes', () => {
      cy.visit('/this-route-does-not-exist')
      cy.contains('h1', 'Page Not Found').should('be.visible')
      cy.contains('a', 'Back to Home').should('be.visible')
    })
  })

  context('Full auth flows (backend required)', () => {
    it('registers a new user, stores the session and lands on /home', () => {
      cy.registerUi().then((data) => {
        cy.url({ timeout: 15000 }).should('include', '/home')

        cy.window().then((win) => {
          const persisted = JSON.parse(win.localStorage.getItem('hopalong-auth'))
          expect(persisted.state.isAuthenticated).to.be.true
          expect(persisted.state.token).to.exist
          expect(persisted.state.currentUser.email).to.eq(data.email)
          // plain token key used by src/api/config.js
          expect(win.localStorage.getItem('token')).to.exist
        })
      })
    })

    it('logs in with valid demo credentials', () => {
      cy.loginAsDemoUser()
      cy.visit('/home')
      cy.url().should('include', '/home')
      // header is only rendered for authenticated users
      cy.get('header').should('be.visible')
    })

    it('does not log in with invalid credentials', () => {
      cy.visit('/')
      cy.get('#email').type('rahul.sharma@iitr.ac.in')
      cy.get('#password').type('wrong-password-123')
      cy.get('button[type="submit"]').click()

      // The API rejects the login and the axios 401 interceptor reloads
      // the app back to the login screen — the user never reaches /home
      cy.url({ timeout: 15000 }).should('not.include', '/home')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })

    it('logs out from the header user menu', () => {
      cy.loginAsDemoUser()
      cy.visit('/home')
      cy.get('header').should('be.visible')

      cy.logoutUi()
      cy.url().should('not.include', '/home')

      cy.window().then((win) => {
        const persisted = win.localStorage.getItem('hopalong-auth')
        if (persisted) {
          expect(JSON.parse(persisted).state.isAuthenticated).to.be.false
        }
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })
  })
})
