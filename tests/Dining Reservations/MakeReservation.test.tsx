import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { it, expect, describe, afterAll, vi } from 'vitest';
import MakeReservation from '../../src/components/Dining Reservations/MakeReservation';
import '@testing-library/jest-dom';

describe('MakeReservation', () => {
  const renderComponent = (locationState: any) => {
    render(
        <MemoryRouter initialEntries={[{ pathname: '/make-reservation', state: locationState }]}>
            <Routes>
                <Route path="/make-reservation" element={<MakeReservation />} />
            </Routes>
        </MemoryRouter>
    );
  };

  it('renders the form with default values for a new reservation', () => {
    renderComponent({ userEmail: 'testuser@example.com' });

    expect(screen.getByText(/Make a New Reservation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Time:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Dining Hall:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reserve Now/i })).toBeInTheDocument();
  });


  it('submits the form and navigates on success', async () => {
    // Mock fetch to simulate a successful response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({}), // Mock response body
        headers: new Headers(),
        redirected: false,
      } as Response)
    );

    renderComponent({ userEmail: 'testuser@example.com' });

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: '2023-10-10' } });
    fireEvent.change(screen.getByLabelText(/Select Time:/i), { target: { value: '12:00' } });
    fireEvent.change(screen.getByLabelText(/Select Dining Hall:/i), { target: { value: 'Dining Hall 1' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Reserve Now/i }));

  });

  it('displays an error message on submission failure', async () => {
    // Mock fetch to simulate an error response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Failed to create reservation.' }),
        headers: new Headers(),
        redirected: false,
      } as Response)
    );

    renderComponent({ userEmail: 'testuser@example.com' });

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: '2023-10-10' } });
    fireEvent.change(screen.getByLabelText(/Select Time:/i), { target: { value: '12:00' } });
    fireEvent.change(screen.getByLabelText(/Select Dining Hall:/i), { target: { value: 'Dining Hall 1' } });

    fireEvent.click(screen.getByRole('button', { name: /Reserve Now/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to create reservation./i)).toBeInTheDocument();
    });
  });

  afterAll(() => {
    // Restore fetch to its original state
    vi.restoreAllMocks();
  });
});
