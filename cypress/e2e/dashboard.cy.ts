export {}; 

describe('dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/dashboard')
    })

    it('should display the Sidebar-menu when the menu button is clicked', () => {
        // Click the menu button to open the menu
        cy.get('button[test-id="menu-button"]').click();
        
        const buttonSelectors = [
            'a[href="/dashboard"]', // Dashboard Link
            'button:contains("Dietary Management")',
            'button:contains("Meal Credits")',
            'button:contains("Dining Reservation")',
            'button:contains("History")',
          ];
      
          buttonSelectors.forEach(selector => {
            cy.get(selector).should('be.visible');
        });

        cy.get('button[test-id = "close-menu-button"]').click();
    });

    it('should switch to the correct tab when clicked', () => {
        // Click on "Dining Reservations" tab
        cy.contains('Dining Reservations').click();
        
        // Assert that the tab content shows "Upcoming Reservations"
        cy.contains('Upcoming Reservations').should('be.visible');
    
        // Click on "Menu Access" tab
        cy.contains('Menu Access').click();
        
        // Optionally, assert that "Menu Access" content is visible
        cy.contains("Today's Menu").should('be.visible'); // Adjust this selector as necessary
    });   
    
    it('display logout button and logout when clicked', () => {
        // Click the menu button to open the menu
        cy.get('div[test-id="user-dropdown"]').click();
        
        // Check that the logout button is visible
        cy.get('button:contains("Log Out")').should('be.visible');
        
        // Click the logout button
        cy.get('button:contains("Log Out")').click();
        
        // Check that the user is redirected to the homepage
        cy.url().should('eq', 'http://localhost:5173/');

        cy.get('button').contains('Login').click();
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
        cy.get('[test-id="email-input"]').type(validEmail);
        cy.get('[test-id="password-input"]').type(validPassword);

        // Submit the form
        cy.get('button[type="submit"]').click();
    });

    it("logs out when wits logo is clicked", () => {
        cy.get('img[alt="Wits-Logo"]').click();
        cy.url().should('eq', 'http://localhost:5173/');

        cy.get('button').contains('Login').click();
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
        cy.get('[test-id="email-input"]').type(validEmail);
        cy.get('[test-id="password-input"]').type(validPassword);

        // Submit the form
        cy.get('button[type="submit"]').click();
    });

    it('shows nutrition information when clicked', () => {
        cy.get('button').contains('Show Nutritional Info').click();
        cy.get('h4').should('contain', "Nutritional Information:")
        cy.get('button').contains('Hide Nutritional Info').click();
    });

    it('renders the proper components when the sidebar buttons are clicked', () => {
        // Click the menu button to open the menu
        cy.get('button[test-id="menu-button"]').click();
        cy.get('button[test-id="dietary-management-button"]').click();
        cy.url().should('include', '/dietary-management');

        cy.get('button[test-id="menu-button"]').click();
        cy.get('a[test-id="dashboard-link"]').click(); 
        
        // Click on "Dining Reservations" tab
        cy.get('button[test-id="menu-button"]').click();
        cy.get('button[test-id="meal-credits-button"]').click();
        cy.url().should('include', '/meal-credits');

        cy.get('button[test-id="menu-button"]').click();
        cy.get('a[test-id="dashboard-link"]').click();

        cy.get('button[test-id="menu-button"]').click();
        cy.get('button[test-id="reservation-button"]').click();
        cy.url().should('include', '/dining-reservations');

        cy.get('button[test-id="menu-button"]').click();
        cy.get('a[test-id="dashboard-link"]').click();

        cy.get('button[test-id="menu-button"]').click();
        cy.get('button[test-id="reservation-history-button"]').click();
        cy.get('button[test-id="close-menu-button"]').click();
        
    });

})