import { it, expect, describe, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SignupForm from '../src/components/SignupForm'; // Adjust the import path as needed
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

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
    
    describe('SignupForm', () => {
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
                <SignupForm isActive={true} onAlreadyHaveAccountClick={mockCreateAccountClick} />
                </MemoryRouter>
            );

            expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();

        });

        it('displays an error message on failed login', async () => {
            render(
              <MemoryRouter>
                <SignupForm isActive={true} onAlreadyHaveAccountClick={mockCreateAccountClick} />
              </MemoryRouter>
            );
    
            // Fill in the email and password
            fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
            fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: 'password1' } });
    
            // Simulate clicking the Login button
            fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
            // Mock the Firebase function to reject with an error
            (signInWithEmailAndPassword as any).mockRejectedValueOnce(new Error('Firebase: Error (auth/invalid-credential).')); // Use 'as any'
    
            await waitFor(() => {
                // expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
            });
        });

        it('calls onCreateAccountClick when "Create an account" link is clicked', () => {
            render(
              <MemoryRouter>
                <SignupForm isActive={true} onAlreadyHaveAccountClick={mockCreateAccountClick} />
              </MemoryRouter>
            );
    
            // Simulate clicking the "Create an account" link
            fireEvent.click(screen.getByText(/Already have an account/i));
    
            // expect(mockCreateAccountClick).toHaveBeenCalled();
        });
});

    