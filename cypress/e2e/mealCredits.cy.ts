export{};

describe('Meal Credits', () => {
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
        cy.get('button[test-id="meal-credits-button"]').click();
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
        cy.contains('Set as Default').click();
        cy.contains('Default').should('be.visible');

      });

      it('allows deleting an account', () => {
        const accountName = 'Test Account';
    
        // Add account first
        cy.get('input[placeholder="New Account Name"]').type(accountName);
        cy.contains('Add Account').click();
    
        // Delete the account
      
        cy.get('button[test-id="dropdown-Test Account"]').click();
        
    
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
        cy.get('span[test-id="bal-Test Account"]').contains('10.00 Kudus');

        cy.get('input[placeholder="Amount"]').type('10');
        cy.get('select').first().select(accountTo);
        cy.get('select').last().select(accountFrom);
        cy.get('button').contains('Transfer').click();

        cy.get('button[test-id="dropdown-Test Account"]').click();
      });

      it('should go to track usage when the button is clicked and initially not have anything for the month August', () => {
        cy.get('button').contains('Track Usage').click();
        cy.get('select').first().select('February'); // Choose a month
        cy.get('input[type="number"]').clear().type('202'); // Choose a year
        cy.contains('No Money In transactions for this month.').should('be.visible');
        cy.contains('No Money Out transactions for this month.').should('be.visible');
      });

      it('displays transactions after fetching data', () => {
        // Mock the fetchData call to return some transactions
        cy.intercept('GET', '/MealCredits/Retrieve/**', {
          statusCode: 200,
          body: {
            accounts: [
              {
                isDefault: true,
                moneyIn: {
                  '2020-10-01': 100,
                  '2020-10-15': 50,
                },
                moneyOut: {
                  '2020-10-02': 30,
                  '2020-10-20': 20,
                },
              },
            ],
          },
        }).as('getTransactions');
        cy.get('button').contains('Track Usage').click();
    
        cy.get('select').first().select('October'); // Select a month
        cy.get('input[type="number"]').clear().type('2023'); // Select a year
        cy.get('input[type="number"]').type('{backspace}');
    
        cy.wait('@getTransactions'); // Wait for the API call
    
        // Check if transactions are displayed correctly
        cy.contains('Money In - 10/2020').should('be.visible');
        cy.contains('Transaction 1').should('be.visible')
        cy.contains('100.00 Kudus').should('be.visible');
        cy.contains('Transaction 2').should('be.visible')
        cy.contains('50.00 Kudus').should('be.visible');
    
        cy.contains('Money Out - 10/2020').should('be.visible');
        cy.contains('Expense 1').should('be.visible')
        cy.contains('30.00 Kudus').should('be.visible');
        cy.contains('Expense 2').should('be.visible')
        cy.contains('20.00 Kudus').should('be.visible');
      });
});