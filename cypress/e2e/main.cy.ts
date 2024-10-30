export {}; 

describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/')
  })

  it('should display the system description on load', () => {
    // Check if the SystemDescription is initially visible
    cy.get('h1').should('contain', 'Smart Campus!'); // Verifying the header
    cy.get('div').contains('Enhancing Campus Life').should('be.visible'); // Adjust text as per SystemDescription content
  });

  it('should show login form when login button is clicked', () => {
    // Click the login button
    cy.get('button').contains('Login').click();
    
    // Check that the LoginForm is visible
    cy.get('form').within(() => {
      cy.get('input[data-testid="email-input"]').should('be.visible');
      cy.get('input[data-testid="password-input"]').should('be.visible');
      cy.get('button').contains('Login').should('be.visible');
    });
  });

  it('should show signup form when signup button is clicked', () => {
    // Click the signup button
    cy.get('button').contains('Signup').click();
    
    // Check that the SignupForm is visible
    cy.get('form').within(() => {
      cy.get('input[data-testid="email-input"]').should('be.visible'); // Adjust input fields according to SignupForm
      cy.get('input[data-testid="password-input"]').should('be.visible');
      cy.get('input[data-testid="confirm-password-input"]').should('be.visible');
      cy.get('button').contains('Sign Up').should('be.visible');
    });
  });

  it('should toggle between login and signup forms', () => {
    // Click the login button
    cy.get('button').contains('Login').click();
    
    // Check that the LoginForm is visible
    cy.get('form').within(() => {
      cy.get('button').contains('Login').should('be.visible');
    });

    // Click "Create Account" to switch to signup
    cy.get('a').contains('Sign Up').click();
    
    // Check that the SignupForm is visible
    cy.get('form').within(() => {
      cy.get('button').contains('Sign Up').should('be.visible');
    });

    // Click "Already Have Account?" to switch back to login
    cy.get('a').contains('Login').click();
    
    // Check that the LoginForm is visible again
    cy.get('form').within(() => {
      cy.get('button').contains('Login').should('be.visible');
    });
  });

  it('should hide both forms when logo is clicked', () => {
    // Click the signup button
    cy.get('button').contains('Signup').click();
    
    // Now click the logo to hide all forms
    cy.get('img[data-testid="wits-logo"]').click();
    
    cy.get('form').should('not.exist');

 
  });

  it('displays error message on invalid login attempt', () => {
    const invalidEmail = 'invalid@example.com';
    const invalidPassword = 'wrongpassword';
    
    cy.get('button').contains('Login').click();

    // Type invalid credentials
    cy.get('[data-testid="email-input"]').type(invalidEmail);
    cy.get('[data-testid="password-input"]').type(invalidPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Assert error message
    cy.get('p.text-red-500').should('contain', 'invalid-credential');
  });

  it('can type email and password', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    cy.get('button').contains('Login').click();

    // Type into the email input
    cy.get('[data-testid="email-input"]')
      .type(testEmail)
      .should('have.value', testEmail);

    // Type into the password input
    cy.get('[data-testid="password-input"]')
      .type(testPassword)
      .should('have.value', testPassword);
  });

  it('navigates to the dashboard on successful login', () => {
    const validEmail = 'test@example.com';
    const validPassword = 'password123';

    cy.get('button').contains('Login').click();

    // Intercept Firebase auth request and mock successful response
    cy.intercept('POST', '**/identitytoolkit/v3/relyingparty/verifyPassword**', {
      statusCode: 200,
      body: {
        idToken: 'mock-token', // Mock a valid token
        email: validEmail,
        refreshToken: 'mock-refresh-token',
        expiresIn: '3600',
        localId: 'mock-local-id',
      },
    });

    // Fill out the form with valid credentials
    cy.get('[data-testid="email-input"]').type(validEmail);
    cy.get('[data-testid="password-input"]').type(validPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify that Cypress is redirected to the dashboard
    cy.url().should('include', '/dashboard'); // Check if URL changes to '/dashboard'
  });
})