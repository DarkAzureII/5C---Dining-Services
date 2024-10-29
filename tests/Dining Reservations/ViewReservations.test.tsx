import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { it, expect, describe, afterAll, vi } from 'vitest';
import ViewReservations from '../../src/components/Dining Reservations/ViewReservation';
import '@testing-library/jest-dom';

const userEmail = "unit@test.com";

describe('ViewReservations', () => {
    it('renders the ViewReservations component with the correct components', async () => {
        render(
            <MemoryRouter>
                <ViewReservations userEmail={userEmail}/>
            </MemoryRouter>
        );

        await new Promise(resolve => setTimeout(resolve, 3000));

        screen.debug();

        // expect(screen.getByText(/Upcoming Reservations/i)).toBeInTheDocument();
        // expect(screen.getByText(/No upcoming reservations found/i)).toBeInTheDocument();
        
    });
});