import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest';
import { auth } from '../../src/firebaseConfig';
import MealCreditsPage from '../../src/components/meal credits/MealCreditsPage'; // Adjust the path to your Dashboard

describe('MealCreditsPage', () => {

    it('renders the MealCreditsPage with the correct components', () => {
        render(
            <MemoryRouter>
                <MealCreditsPage />
            </MemoryRouter>
        );

        expect(screen.getByAltText(/Wits-Logo/i)).toBeInTheDocument();
        expect(screen.getByText(/Dining Services/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

        expect(screen.getByRole('button', {name: /Balance/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Transactions/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Track Usage/i})).toBeInTheDocument();

        fireEvent.click(screen.getByText(/☰/i));
        expect(screen.getByRole('button', {name: /Dietary Management/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /History/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Dining Reservation/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Meal Credit/i})).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Welcome,/i));
        expect(screen.getByText(/Log out/i)).toBeInTheDocument();
    }); 
    
    it('shows the Balance form when "Balance" is clicked', () => {
        render(
            <MemoryRouter>
                <MealCreditsPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', {name: /Balance/i}));
        expect(screen.getByPlaceholderText(/New Account Name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Add Account/i})).toBeInTheDocument();
        expect(screen.getByText(/Transfer Money/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Transfer/i})).toBeInTheDocument();
        expect(screen.getByText(/From Account/i)).toBeInTheDocument();
        expect(screen.getByText(/To Account/i)).toBeInTheDocument();
    }); 

    it('shows the Transactions form when "Transactions" is clicked', () => {
        render(
            <MemoryRouter>
                <MealCreditsPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', {name: /Transactions/i}));
        
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    
    });
    
    it('shows the Usage form when "Track Usage" is clicked', () => {
        render(
            <MemoryRouter>
                <MealCreditsPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', {name: /Track Usage/i}));
        
        expect(screen.getByText(/Money Out -/i)).toBeInTheDocument();
        expect(screen.getByText(/Money In -/i)).toBeInTheDocument();
    
    });
});