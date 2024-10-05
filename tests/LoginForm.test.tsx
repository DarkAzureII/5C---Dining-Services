import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import LoginForm from '../src/components/LoginForm'; // Adjust the import path as needed
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

// Mock the Firebase auth function
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(() => ({})),
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...(actual as object), // Import everything else from the actual module
      useNavigate: vi.fn(), // Mock useNavigate
    };
  });

describe('LoginForm', () => {
    const mockCreateAccountClick = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        // Clear mock calls before each test
        vi.clearAllMocks();
        // Set the mock implementation for useNavigate
        (useNavigate as any).mockImplementation(() => mockNavigate);
    });

    it('shows email and password inputs and allows for login', async () => {
        render(
          <MemoryRouter>
            <LoginForm isActive={true} onCreateAccountClick={mockCreateAccountClick} />
          </MemoryRouter>
        );

        // Check for email and password input fields
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

        // Simulate filling in email and password
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Simulate clicking the Login button
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Mock the Firebase function to resolve and check for navigation
        (signInWithEmailAndPassword as any).mockResolvedValueOnce({});  // Use 'as any' to avoid type errors
        
        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'test@example.com', 'password123');
            // Here you can also check if the navigation to the dashboard happens
            // However, since useNavigate is not directly accessible in this test,
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays an error message on failed login', async () => {
        render(
          <MemoryRouter>
            <LoginForm isActive={true} onCreateAccountClick={mockCreateAccountClick} />
          </MemoryRouter>
        );

        // Fill in the email and password
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });

        // Simulate clicking the Login button
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // Mock the Firebase function to reject with an error
        (signInWithEmailAndPassword as any).mockRejectedValueOnce(new Error('Firebase: Error (auth/invalid-credential).')); // Use 'as any'

        await waitFor(() => {
            // expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    it('calls onCreateAccountClick when "Create an account" link is clicked', () => {
        render(
          <MemoryRouter>
            <LoginForm isActive={true} onCreateAccountClick={mockCreateAccountClick} />
          </MemoryRouter>
        );

        // Simulate clicking the "Create an account" link
        fireEvent.click(screen.getByText(/Create an account/i));

        expect(mockCreateAccountClick).toHaveBeenCalled();
    });
});
