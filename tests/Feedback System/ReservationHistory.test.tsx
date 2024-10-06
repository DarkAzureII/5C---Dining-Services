import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { it, expect, describe, afterAll, vi } from 'vitest';
import ReservationHistory from '../../src/components/Feedback System/ReservationHistory';
import '@testing-library/jest-dom';

describe('ReservationHistory', () => {
    it('renders the ReservationHistory component with the correct components', () => {
        render(
            <MemoryRouter>
                <ReservationHistory />
            </MemoryRouter>
        );

        screen.debug();
        expect(screen.getByText(/Reservation History/i)).toBeInTheDocument();
        expect(screen.getByText(/No reservations found/i)).toBeInTheDocument();
        expect(screen.getByText(/Date/i)).toBeInTheDocument();
        expect(screen.getByText(/Time/i)).toBeInTheDocument();
        expect(screen.getByText(/Venue/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    });
}); 