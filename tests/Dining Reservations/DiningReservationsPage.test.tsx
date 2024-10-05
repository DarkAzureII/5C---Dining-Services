import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest';
import DiningReservationsPage from '../../src/components/Dining Reservations/DiningReservationsPage';

describe('DiningReservationsPage', () => {

    it('renders the DietaryManagementPage with the correct components', () => {
        // Render the Component wrapped with MemoryRouter
        render(
            <MemoryRouter>
                <DiningReservationsPage />
            </MemoryRouter>
        );

        expect(screen.getByAltText(/Wits-Logo/i)).toBeInTheDocument();
        expect(screen.getByText(/Dining Services/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/Select Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Dining Hall/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/☰/i));
        expect(screen.getByRole('button', {name: /Meal Credit/i})).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Welcome,/i));
        expect(screen.getByText(/Log out/i)).toBeInTheDocument();
    });
});