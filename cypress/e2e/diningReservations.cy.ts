export{};

describe('Dining Reservations', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
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
        cy.get('[data-testid="email-input"]').type(validEmail);
        cy.get('[data-testid="password-input"]').type(validPassword);

        // Submit the form
        cy.get('button[type="submit"]').click();
        cy.get('button[data-testid="menu-button"]').click();
        cy.contains('button', 'Dining Reservation').click({ force: true });
    })

    it('should allow the user to create, edit and cancel a reservation', () => {
        // Fill in the reservation form
        cy.get('#date').type('2024-10-31');
        cy.contains('Choose a time').click({ force: true });
        cy.get('#time').select('09:00');
        cy.get('#diningHall').select('Dining Hall 1');
    
        // Submit the form
        cy.get('button[type="submit"]').click();
    
        // Wait for 3 seconds
        cy.wait(3000);
    
        cy.get('button').contains('Dining Reservations').click();
        cy.contains('Date: 10/31/2024').should('be.visible');
        cy.contains('Time: 09:00').should('be.visible');
        cy.contains('Venue: Dining Hall 1').should('be.visible');

        cy.get('button').contains('Edit').should('exist');
        cy.get('button').contains('Edit').click();

        cy.get('#date').type('2024-10-31');
        cy.contains('Choose a time').click({ force: true });
        cy.get('#time').select('10:00');
        cy.get('#diningHall').select('Dining Hall 1');

        cy.get('button').contains('Update Reservation').click();

        cy.wait(3000);

        cy.get('button').contains('Dining Reservations').click();
        cy.contains('Date: 10/31/2024').should('be.visible');
        cy.contains('Time: 10:00').should('be.visible');
        cy.contains('Venue: Dining Hall 1').should('be.visible');

        // Continuously press the "Cancel" button until it is no longer available
        cy.get('button').contains('Cancel').should('exist'); // Ensure the button initially exists
        cy.get('button')
            .contains('Cancel')
            .should('be.visible')
            .click({ multiple: true, timeout: 5000 }); // Attempt to click until button disappears or timeout is reached
    });
    
})