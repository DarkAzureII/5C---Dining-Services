export {}; 

describe('dashboard', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/dashboard')
    })

    it('should display the Sidebar-menu when the menu button is clicked', () => {
        // Click the menu button to open the menu
        cy.get('button[data-testid="menu-button"]').click();
        
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

        cy.get('button[data-testid = "close-menu-button"]').click();
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
            idToken: 'mock-token',
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
    });

    it('shows nutrition information when clicked', () => {
        cy.get('button').contains('Show Nutritional Info').click();
        cy.get('h4').should('contain', "Nutritional Information:")
        cy.get('button').contains('Hide Nutritional Info').click();
    });

    it('navigates correctly when sidebar links are clicked', () => {
        // Access Menu
        cy.get('button').contains('Menu').click();
        // Access Dietary Management
        cy.contains('button', 'Dietary Management').click({ force: true });
        cy.url().should('include', '/dietary-management');

        // Access Dining Reservations
        cy.get('[data-testid="menu-button"]').click();
        cy.contains('button', 'Dining Reservation').click({ force: true });
        cy.url().should('include', '/dining-reservations');

        // Access Meal Credits
        cy.get('[data-testid="menu-button"]').click();
        cy.contains('button', 'Meal Credits').click();
        cy.url().should('include', '/meal-credits');

        // Access Feedback System
        cy.get('[data-testid="menu-button"]').click();
        cy.contains('button', 'History').click();
        cy.contains('Reservation History').should('be.visible');
    });
    
    

})