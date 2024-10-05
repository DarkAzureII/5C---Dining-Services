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

describe('DietaryManagementPage', () => {

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
});