export{};

describe('Dietary Management', () => {
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
        cy.get('button[test-id="dietary-management-button"]').click();
    })

    it('displays a message when there are no dietary preferences', () => {
        cy.contains('No dietary preferences found.');
    });

    it('allows a user to add a dietary preference', () => {
        // Add a dietary preference
        cy.get('select').select('Vegan');
        cy.get('textarea').first().type('Nuts, Dairy'); // Allergies
        cy.get('textarea').last().type('I prefer plant-based meals.'); // Description
        cy.contains('Add Preference').click();
    
        // Verify the success message
        cy.contains('Preference added successfully!');
    
        // Check if the preference is listed
        cy.contains('Preference: Vegan');
        cy.contains('Allergies: Nuts, Dairy');
        cy.contains('Additional Notes: I prefer plant-based meals.');
      });

      it('allows a user to edit a dietary preference', () => {
        // Assuming there's already a preference added (you can adjust based on your setup)
        cy.contains('Edit').first().click();
    
        // Change the selected preference and add notes
        cy.get('select').select('Gluten-Free');
        cy.get('textarea').last().clear().type('I have celiac disease.'); // Update Description
        cy.contains('Update Preference').click();
    
        // Verify the success message
        cy.contains('Preference updated successfully!');
    
        // Check the updated preference is displayed
        cy.contains('Preference: Gluten-Free');
        cy.contains('Additional Notes: I have celiac disease.');
      });

      it('allows a user to delete a dietary preference', () => {
        // Assuming there's at least one preference present
        cy.contains('Delete').first().click();
    
        // Confirm deletion (you may need to adjust if your app has a confirmation dialog)
        cy.on('window:confirm', () => true); // Automatically confirm
    
        // Verify the deletion success message
        cy.contains('Preference deleted successfully!');
    
        // Ensure the preference is no longer displayed
        cy.contains('Preference: Vegan').should('not.exist'); // Adjust based on your data
      });

});