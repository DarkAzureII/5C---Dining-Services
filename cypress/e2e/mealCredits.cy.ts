export{};

describe('Meal Credits', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/')
        cy.get('button').contains('Login').click();
        const validEmail = 'test2@example.com';
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
        cy.contains('button', 'Meal Credits').click();
    })

    it('displays no accounts initially', () => {
        cy.contains('No accounts available. Add a new account to get started.');
    });

    it('allows adding a new account', () => {
        const accountName = 'Test Account';
    
        cy.get('input[placeholder="New Account Name"]').type(accountName);
        cy.contains('Add Account').click();
    
        cy.contains(accountName).should('be.visible');
    });

    it('allows setting an account as default', () => {
        const accountName = 'Test Account';
    
        // Add account first
        cy.get('input[placeholder="New Account Name"]').type(accountName);
        cy.contains('Add Account').click();
        cy.contains(accountName).should('be.visible');
    
        // Set it as default
        cy.get('button[data-testid="set-default-Test Account"]').click();
        cy.contains('Default').should('be.visible');
        cy.get('button[data-testid="set-default-Main Account"]').click();

      });

      it('allows deleting an account', () => {
        const accountName = 'Test Account';
    
        // Add account first
        cy.get('input[placeholder="New Account Name"]').type(accountName);
        cy.contains('Add Account').click();
    
        // Delete the account
      
        cy.get('button[data-testid="delete-Test Account"]').click();
        cy.visit('http://localhost:5173/meal-credits');
        
        cy.contains(accountName).should('not.exist');
      });

      it('allows transferring money between accounts', () => {
        const accountFrom = 'Main Account';
        const accountTo = 'Test Account';
        
        cy.get('input[placeholder="New Account Name"]').type(accountTo);
        cy.contains('Add Account').click();
    
        // Transfer money
        cy.get('input[placeholder="Amount"]').type('10');
        cy.get('select').first().select(accountFrom);
        cy.get('select').last().select(accountTo);
        cy.get('button').contains('Transfer').click();
    
        // Verify balance updates (assuming you set initial balances)
        cy.get('span[data-testid="bal-Test Account"]').contains('10.00 Kudus');
        cy.get('button[data-testid="delete-Test Account"]').click();

      });

      it('should go to track usage when the button is clicked and initially not have anything for the month August', () => {
        cy.get('button').contains('Track Usage').click();
        cy.get('select').first().select('February'); // Choose a month
        cy.get('input[type="number"]').clear().type('202'); // Choose a year
        cy.get('input[type="number"]')
          .invoke('val')
          .then((currentValue) => {
            const incrementedValue = Number(currentValue) + 4;
            cy.get('input[type="number"]').clear().type(incrementedValue.toString());
          });
        cy.contains('No Money In transactions for this month.').should('be.visible');
        cy.contains('No Money Out transactions for this month.').should('be.visible');
      });

      // it('displays transactions after fetching data', () => {
      //   // Mock the fetchData call to return some transactions
      //   cy.intercept('GET', '/MealCredits/Retrieve/**', {
      //     statusCode: 200,
      //     body: {
      //       accounts: [
      //         {
      //           isDefault: true,
      //           moneyIn: {
      //             '2020-10-01': 100,
      //             '2020-10-15': 50,
      //           },
      //           moneyOut: {
      //             '2020-10-02': 30,
      //             '2020-10-20': 20,
      //           },
      //         },
      //       ],
      //     },
      //   }).as('getTransactions');
      
      //   // Click the "Track Usage" button to open the reservation form
      //   cy.get('button').contains('Track Usage').click().should('be.visible');
      
      //   // Select the month "October"
      //   cy.get('select').first().select('10').should('have.value', '10');
      
      //   // Set the initial year to 2023 using a unique selector
      //   cy.get('[data-testid="year-input"]') // Use the unique selector
      //     .clear({ force: true }) // Force clear in case of overlapping elements
      //     .type('2023', { force: true }) // Type the initial year
      //     .should('have.value', '2023'); // Assert the value is correctly set
      
      //   // Increment the year by 4 to reach 2027
      //   cy.get('[data-testid="year-input"]')
      //     .invoke('val')
      //     .then((currentValue) => {
      //       const incrementedValue = Number(currentValue) + 4; // Calculate 2027
      //       cy.get('[data-testid="year-input"]')
      //         .clear({ force: true }) // Clear the input again
      //         .type(`${incrementedValue}`, { force: true }) // Type the incremented value
      //         .should('have.value', `${incrementedValue}`); // Assert the new value
      //     });
      
      //   // Select the time from the dropdown
      //   cy.get('#time').select('09:00').should('have.value', '09:00'); // Ensure this selector is correct
      
      //   // Select the dining hall
      //   cy.get('#diningHall').select('Dining Hall 1').should('have.value', 'Dining Hall 1'); // Ensure this selector is correct
      
      //   // Submit the reservation form
      //   cy.get('button[type="submit"]').click();
      
      //   // Wait for the mocked API call to complete
      //   cy.wait('@getTransactions');
      
      //   // Click on "Dining Reservations" to view transactions
      //   cy.get('button').contains('Dining Reservations').click().should('be.visible');
      
      //   // Assert that the transactions are displayed correctly
      //   cy.contains('Money In - 10/2020').should('be.visible');
      //   cy.contains('100.00 Kudus').should('be.visible');
      //   cy.contains('50.00 Kudus').should('be.visible');
      
      //   cy.contains('Money Out - 10/2020').should('be.visible');
      //   cy.contains('30.00 Kudus').should('be.visible');
      //   cy.contains('20.00 Kudus').should('be.visible');
      // });
      
});