// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

Cypress.Commands.add('register', (userData) => {
  cy.visit('/register');
  cy.get('input[name="name"]').type(userData.name);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="password"]').type(userData.password);
  cy.get('input[name="branch"]').type(userData.branch || 'CSE');
  cy.get('select[name="year"]').select(userData.year || '3rd Year');
  cy.get('textarea[name="bio"]').type(userData.bio || 'Test user bio');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

Cypress.Commands.add('createTrip', (tripData) => {
  cy.visit('/create');
  cy.get('input[name="title"]').type(tripData.title);
  cy.get('input[name="destination"]').type(tripData.destination);
  cy.get('input[name="startDate"]').type(tripData.startDate);
  cy.get('input[name="endDate"]').type(tripData.endDate);
  cy.get('input[name="budget"]').type(tripData.budget);
  cy.get('select[name="mode"]').select(tripData.mode);
  cy.get('select[name="type"]').select(tripData.type);
  cy.get('textarea[name="description"]').type(tripData.description);
  cy.get('input[name="maxParticipants"]').type(tripData.maxParticipants);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

// Global beforeEach hook
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage();
  // Clear cookies
  cy.clearCookies();
});

// Global afterEach hook
afterEach(() => {
  // Clean up any test data if needed
});

// Uncaught exception handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // that are not critical to the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
