describe('Authentication', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@iitr.ac.in',
    password: 'password123',
    branch: 'CSE',
    year: '3rd Year',
    bio: 'Test user for Cypress'
  };

  beforeEach(() => {
    // Clear localStorage and cookies
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      cy.visit('/register');
      
      // Fill registration form
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="branch"]').type(testUser.branch);
      cy.get('select[name="year"]').select(testUser.year);
      cy.get('textarea[name="bio"]').type(testUser.bio);
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should redirect to home page
      cy.url().should('include', '/home');
      
      // Check if user is logged in
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.exist;
        expect(win.localStorage.getItem('user')).to.exist;
      });
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/register');
      
      // Submit empty form
      cy.get('button[type="submit"]').click();
      
      // Should show validation errors
      cy.get('[data-testid="error-message"]').should('be.visible');
    });

    it('should not register user with invalid email', () => {
      cy.visit('/register');
      
      // Fill form with invalid email
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type('invalid-email@gmail.com');
      cy.get('input[name="password"]').type(testUser.password);
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should show email validation error
      cy.get('[data-testid="error-message"]').should('contain', 'email');
    });

    it('should not register user with short password', () => {
      cy.visit('/register');
      
      // Fill form with short password
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type('short@iitr.ac.in');
      cy.get('input[name="password"]').type('123');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should show password validation error
      cy.get('[data-testid="error-message"]').should('contain', 'password');
    });
  });

  describe('User Login', () => {
    beforeEach(() => {
      // Create a test user via API
      cy.apiRequest('POST', '/auth/register', testUser);
    });

    it('should login user with valid credentials', () => {
      cy.visit('/');
      
      // Fill login form
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should redirect to home page
      cy.url().should('include', '/home');
      
      // Check if user is logged in
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.exist;
        expect(win.localStorage.getItem('user')).to.exist;
      });
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/');
      
      // Fill login form with wrong password
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type('wrongpassword');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid');
    });

    it('should show error for non-existent user', () => {
      cy.visit('/');
      
      // Fill login form with non-existent user
      cy.get('input[name="email"]').type('nonexistent@iitr.ac.in');
      cy.get('input[name="password"]').type('password123');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid');
    });
  });

  describe('User Logout', () => {
    beforeEach(() => {
      // Login user
      cy.apiLogin(testUser.email, testUser.password);
    });

    it('should logout user successfully', () => {
      cy.visit('/home');
      
      // Click logout button
      cy.get('[data-testid="logout-btn"]').click();
      
      // Should redirect to login page
      cy.url().should('include', '/');
      
      // Check if user is logged out
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
      });
    });
  });

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      const protectedRoutes = ['/home', '/create', '/dashboard', '/profile/me'];
      
      protectedRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', '/');
      });
    });

    it('should allow authenticated users to access protected routes', () => {
      // Login user
      cy.apiLogin(testUser.email, testUser.password);
      
      const protectedRoutes = ['/home', '/create', '/dashboard', '/profile/me'];
      
      protectedRoutes.forEach((route) => {
        cy.visit(route);
        cy.url().should('include', route);
      });
    });
  });

  describe('Password Update', () => {
    beforeEach(() => {
      // Login user
      cy.apiLogin(testUser.email, testUser.password);
    });

    it('should update password successfully', () => {
      cy.visit('/profile/me');
      
      // Click update password button
      cy.get('[data-testid="update-password-btn"]').click();
      
      // Fill password update form
      cy.get('[data-testid="current-password"]').type(testUser.password);
      cy.get('[data-testid="new-password"]').type('newpassword123');
      cy.get('[data-testid="confirm-password"]').type('newpassword123');
      
      // Submit form
      cy.get('[data-testid="update-password-submit"]').click();
      
      // Should show success message
      cy.get('[data-testid="success-message"]').should('contain', 'updated');
      
      // Login with new password
      cy.logout();
      cy.login(testUser.email, 'newpassword123');
      
      // Should login successfully
      cy.url().should('include', '/home');
    });

    it('should show error for incorrect current password', () => {
      cy.visit('/profile/me');
      
      // Click update password button
      cy.get('[data-testid="update-password-btn"]').click();
      
      // Fill password update form with wrong current password
      cy.get('[data-testid="current-password"]').type('wrongpassword');
      cy.get('[data-testid="new-password"]').type('newpassword123');
      cy.get('[data-testid="confirm-password"]').type('newpassword123');
      
      // Submit form
      cy.get('[data-testid="update-password-submit"]').click();
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'current');
    });

    it('should show error for password mismatch', () => {
      cy.visit('/profile/me');
      
      // Click update password button
      cy.get('[data-testid="update-password-btn"]').click();
      
      // Fill password update form with mismatched passwords
      cy.get('[data-testid="current-password"]').type(testUser.password);
      cy.get('[data-testid="new-password"]').type('newpassword123');
      cy.get('[data-testid="confirm-password"]').type('differentpassword');
      
      // Submit form
      cy.get('[data-testid="update-password-submit"]').click();
      
      // Should show error message
      cy.get('[data-testid="error-message"]').should('contain', 'match');
    });
  });
});
