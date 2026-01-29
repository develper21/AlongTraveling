// Custom Cypress commands

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

// Register command
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

// Create trip command
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

// API request command
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
    failOnStatusCode: false,
  });
});

// Login via API command
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.apiRequest('POST', '/auth/login', {
    email,
    password,
  }).then((response) => {
    if (response.status === 200) {
      window.localStorage.setItem('token', response.body.data.token);
      window.localStorage.setItem('user', JSON.stringify(response.body.data));
    }
    return response;
  });
});

// Get authenticated user command
Cypress.Commands.add('getCurrentUser', () => {
  const user = window.localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});

// Check if authenticated command
Cypress.Commands.add('isAuthenticated', () => {
  const token = window.localStorage.getItem('token');
  const user = window.localStorage.getItem('user');
  return !!(token && user);
});

// Logout command
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  cy.visit('/');
});

// Wait for loading command
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading"]').should('not.exist');
});

// Check toast notification command
Cypress.Commands.add('checkToast', (message) => {
  cy.get('[data-testid="toast"]').should('contain', message);
});

// Navigate to trip command
Cypress.Commands.add('navigateToTrip', (tripId) => {
  cy.visit(`/trip/${tripId}`);
});

// Send join request command
Cypress.Commands.add('sendJoinRequest', (tripId, message) => {
  cy.navigateToTrip(tripId);
  cy.get('[data-testid="join-request-btn"]').click();
  cy.get('[data-testid="request-message"]').type(message);
  cy.get('[data-testid="send-request-btn"]').click();
});

// Search trips command
Cypress.Commands.add('searchTrips', (searchTerm) => {
  cy.visit('/home');
  cy.get('[data-testid="search-input"]').type(searchTerm);
  cy.get('[data-testid="search-btn"]').click();
});

// Filter trips command
Cypress.Commands.add('filterTrips', (filters) => {
  cy.visit('/home');
  
  if (filters.destination) {
    cy.get('[data-testid="destination-filter"]').select(filters.destination);
  }
  
  if (filters.mode) {
    cy.get('[data-testid="mode-filter"]').select(filters.mode);
  }
  
  if (filters.type) {
    cy.get('[data-testid="type-filter"]').select(filters.type);
  }
  
  if (filters.startDate) {
    cy.get('[data-testid="start-date-filter"]').type(filters.startDate);
  }
  
  if (filters.endDate) {
    cy.get('[data-testid="end-date-filter"]').type(filters.endDate);
  }
  
  cy.get('[data-testid="apply-filters-btn"]').click();
});

// Check trip card command
Cypress.Commands.add('checkTripCard', (tripData) => {
  cy.get('[data-testid="trip-card"]').should('contain', tripData.title);
  cy.get('[data-testid="trip-card"]').should('contain', tripData.destination);
  cy.get('[data-testid="trip-card"]').should('contain', tripData.budget);
});

// Check user profile command
Cypress.Commands.add('checkUserProfile', (userData) => {
  cy.visit(`/profile/${userData.id}`);
  cy.get('[data-testid="user-name"]').should('contain', userData.name);
  cy.get('[data-testid="user-email"]').should('contain', userData.email);
  cy.get('[data-testid="user-branch"]').should('contain', userData.branch);
});

// Update profile command
Cypress.Commands.add('updateProfile', (updateData) => {
  cy.visit('/profile/me');
  cy.get('[data-testid="edit-profile-btn"]').click();
  
  if (updateData.name) {
    cy.get('[data-testid="name-input"]').clear().type(updateData.name);
  }
  
  if (updateData.branch) {
    cy.get('[data-testid="branch-input"]').clear().type(updateData.branch);
  }
  
  if (updateData.year) {
    cy.get('[data-testid="year-select"]').select(updateData.year);
  }
  
  if (updateData.bio) {
    cy.get('[data-testid="bio-textarea"]').clear().type(updateData.bio);
  }
  
  cy.get('[data-testid="save-profile-btn"]').click();
});

// Check dashboard stats command
Cypress.Commands.add('checkDashboardStats', (stats) => {
  cy.visit('/dashboard');
  
  if (stats.tripsCreated !== undefined) {
    cy.get('[data-testid="trips-created"]').should('contain', stats.tripsCreated);
  }
  
  if (stats.tripsJoined !== undefined) {
    cy.get('[data-testid="trips-joined"]').should('contain', stats.tripsJoined);
  }
  
  if (stats.requestsSent !== undefined) {
    cy.get('[data-testid="requests-sent"]').should('contain', stats.requestsSent);
  }
});

// Mock API response command
Cypress.Commands.add('mockApiResponse', (method, url, response) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${url}`, {
    statusCode: 200,
    body: response,
  }).as('mockResponse');
});

// Wait for API command
Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(`@${alias}`);
});

// Check error message command
Cypress.Commands.add('checkError', (message) => {
  cy.get('[data-testid="error-message"]').should('contain', message);
});

// Check success message command
Cypress.Commands.add('checkSuccess', (message) => {
  cy.get('[data-testid="success-message"]').should('contain', message);
});
