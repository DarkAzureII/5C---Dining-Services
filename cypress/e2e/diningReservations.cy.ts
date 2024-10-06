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
        cy.get('[test-id="email-input"]').type(validEmail);
        cy.get('[test-id="password-input"]').type(validPassword);

        // Submit the form
        cy.get('button[type="submit"]').click();
        cy.get('button[test-id="menu-button"]').click();
        cy.get('button[test-id="reservation-button"]').click();
    })

    it('should allow the user to create a new reservation', () => {
        // Fill in the reservation form
        cy.get('#date').type('2024-10-15');
        cy.get('#time').type('18:00');
        cy.get('#diningHall').select('Dining Hall 1');
    
        // Submit the form
        cy.get('button[type="submit"]').click();
    
        //wait for a 3 seconds
        cy.wait(3000);

        cy.get('button').contains('Dining Reservations').click();

        // Continuously press the "Cancel" button until it is no longer available
        const timeout = 5000; // 10 seconds
        const interval = 500; // Check every 500ms
        const maxAttempts = timeout / interval;

        // const clickCancelWithTimeout = (attempts : number) => {
        //     cy.get('button').contains('Cancel').then($cancelButton => {
        //         if ($cancelButton.length) {
        //             // If the button exists, click it
        //             cy.wrap($cancelButton).click();

        //             // Check the number of attempts left
        //             if (attempts < maxAttempts) {
        //                 // Wait for the defined interval and check again
        //                 cy.wait(interval);
        //                 clickCancelWithTimeout(attempts + 1);
        //             } else {
        //                 // Fail the test if the maximum attempts have been reached
        //                 throw new Error('Cancel button not working');
        //             }
        //         }
        //     });
        // };

        // clickCancelWithTimeout(0);
        
      });
})