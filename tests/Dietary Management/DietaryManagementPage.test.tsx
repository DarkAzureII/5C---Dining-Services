import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest';
import { auth } from '../../src/firebaseConfig';
import DietaryManagementPage from '../../src/components/Dietary Management/DietaryManagementPage'; // Adjust the path to your Dashboard
import DietaryPreferencesHandler from '../../src/components/Dietary Management/DietaryPreferencesHandler';
import DietaryPreferencesList from '../../src/components/Dietary Management/DietaryPreferencesList';

// Mock axios
const mock = new MockAdapter(axios);

// Mocking the Firebase Auth
vi.mock('../../firebaseConfig', () => ({
    auth: {
      onAuthStateChanged: (callback) => {
        const user = { email: 'test@example.com' }; // Example user
        callback(user); // Call the callback with the user
        return vi.fn(); // Return an unsubscribe function
      },
    },
  }));

describe('DietaryManagementPage', () => {
    const user = { email: 'test@example.com' };

    beforeEach(() => {
        vi.clearAllMocks();
      });
    
      afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test
      });

    it('renders the DietaryManagementPage with the correct components', () => {
        // Render the Component wrapped with MemoryRouter
        render(
            <MemoryRouter>
                <DietaryManagementPage />
            </MemoryRouter>
        );

        expect(screen.getByAltText(/Wits-Logo/i)).toBeInTheDocument();
        expect(screen.getByText(/Dining Services/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

        expect(screen.getByText(/Choose/i)).toBeInTheDocument();
        expect(screen.getByRole('option', {name: /Select/i})).toBeInTheDocument();
        expect(screen.getByText(/Allergies/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter allergies/i)).toBeInTheDocument();
        expect(screen.getByText(/Description/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter any/i)).toBeInTheDocument();

        expect(screen.getByRole('button', {name: /Add/i})).toBeInTheDocument();
        fireEvent.click(screen.getByText(/☰/i));
        expect(screen.getByRole('button', {name: /Dining Reservation/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Meal Credit/i})).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Welcome,/i));
        expect(screen.getByText(/Log out/i)).toBeInTheDocument();
    });

    it('fetches dietary preferences on mount', async () => {
        mock.onGet('/api/preferences').reply(200, [
            {
              id: '1',
              type: 'Vegan',
              addNotes: 'I prefer organic foods.',
              allergens: 'Nuts',
              userID: 'test@example.com',
            },
        ]);
    
        render(<DietaryPreferencesHandler />);
    
        await waitFor(() => {
          expect(axios.get).toHaveBeenCalled();
          expect(screen.getByText(/vegan/i)).toBeInTheDocument(); // Check if the preference is rendered
        });
      });
    
      it('displays an error message when the API fails', async () => {
        // Mock axios GET response to fail
        mock.onGet('/api/preferences').reply(500); 
    
        render(<DietaryPreferencesHandler />);
    
        await waitFor(() => {
          expect(screen.getByText(/error fetching preferences/i)).toBeInTheDocument();
        });
      });
    
      it('adds a new dietary preference', async () => {
        mock.onPost('/api/preferences').reply(201, { id: '2' });// Mock successful post response
        const { getByText, getByLabelText } = render(<DietaryPreferencesHandler />);
    
        fireEvent.change(getByLabelText(/choose a preference/i), { target: { value: 'Vegan' } });
        fireEvent.change(getByLabelText(/allergies/i), { target: { value: 'Peanuts' } });
        fireEvent.change(getByLabelText(/description/i), { target: { value: 'No nuts' } });
    
        fireEvent.click(getByText(/add preference/i));
    
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalled();
          expect(screen.getByText(/preference added successfully/i)).toBeInTheDocument(); // Check for success message
        });
      });
    
      it('updates an existing dietary preference', async () => {
        const preferenceId = '1';
        mock.onPut(`/api/preferences/${preferenceId}`).reply(200, {}); // Mock successful put response
        const { getByText, getByLabelText } = render(<DietaryPreferencesHandler />);
    
        // Simulate selecting a preference to edit
        fireEvent.click(screen.getByText(/edit/i)); // Assuming an edit button is present
    
        fireEvent.change(getByLabelText(/choose a preference/i), { target: { value: 'Gluten-Free' } });
        fireEvent.change(getByLabelText(/allergies/i), { target: { value: 'Wheat' } });
        fireEvent.change(getByLabelText(/description/i), { target: { value: 'No gluten' } });
    
        fireEvent.click(getByText(/update preference/i));
    
        await waitFor(() => {
          expect(axios.put).toHaveBeenCalled();
          expect(screen.getByText(/preference updated successfully/i)).toBeInTheDocument(); // Check for success message
        });
      });
    
      it('deletes a dietary preference', async () => {
        const preferenceId = '1';

        // Mock successful delete response
        mock.onDelete(`/api/preferences/${preferenceId}`).reply(200, {});// Mock successful delete response
        render(<DietaryPreferencesHandler />);
    
        fireEvent.click(screen.getByText(/delete/i)); // Assuming a delete button is present
    
        await waitFor(() => {
          expect(axios.delete).toHaveBeenCalled();
          expect(screen.getByText(/preference deleted successfully/i)).toBeInTheDocument(); // Check for success message
        });
      });

});