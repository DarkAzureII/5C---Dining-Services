// tests/SignupForm.test.tsx
/// <reference types="vitest/globals" />

// 1. Define mocks before any imports

// Mock Firebase Auth functions before imports
vi.mock('firebase/auth', () => ({
  ...vi.importActual('firebase/auth'),
  createUserWithEmailAndPassword: vi.fn(),
}));

// Mock firebaseConfig without referencing external variables
vi.mock('../src/firebaseConfig', () => ({
  auth: {}, // Directly define `auth` as an empty object
}));

// Mock API functions
vi.mock('../src/API/MealCredits', () => ({
  postData: vi.fn(),
  updateData: vi.fn(),
}));

// 2. Now import modules after mocks
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SignupForm from '../src/components/SignupForm';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { postData, updateData } from '../src/API/MealCredits';

describe('SignupForm', () => {
  const mockOnAlreadyHaveAccountClick = vi.fn();
  const mockOnToggle = vi.fn();

  const renderComponent = (isActive: boolean = true) => {
    render(
      <SignupForm
        isActive={isActive}
        onAlreadyHaveAccountClick={mockOnAlreadyHaveAccountClick}
        onToggle={mockOnToggle}
      />
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();
  });

  it('renders correctly when active', () => {
    renderComponent(true);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('does not render when not active', () => {
    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    renderComponent();
    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  it('shows error when passwords do not match', async () => {
    renderComponent();
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    fireEvent.click(submitButton);

    // Assuming the component displays "Passwords do not match" on password mismatch
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();

    // Ensure createUserWithEmailAndPassword is not called
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();

    // Ensure postData and updateData are not called
    expect(postData).not.toHaveBeenCalled();
    expect(updateData).not.toHaveBeenCalled();
  });

  it('handles successful sign up', async () => {
    // Mock successful Firebase auth
    (createUserWithEmailAndPassword as unknown as vi.Mock).mockResolvedValue({
      user: {
        email: 'test@example.com',
      },
    });

    // Mock successful API calls
    (postData as unknown as vi.Mock).mockResolvedValue({});
    (updateData as unknown as vi.Mock).mockResolvedValue({});

    renderComponent();

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // auth is mocked as {}
        'test@example.com',
        'password123'
      );
      expect(postData).toHaveBeenCalledWith('MealCredits/Create/test@example.com', {
        accountName: 'Main Account',
      });
      expect(updateData).toHaveBeenCalledWith('MealCredits/Update/test@example.com/Main Account', {
        amount: 100,
        transactionType: 'moneyIn',
        date: expect.any(String),
        isDefault: true,
      });
      expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
    });
  });

  it('handles Firebase auth error', async () => {
    // Mock Firebase auth failure
    (createUserWithEmailAndPassword as unknown as vi.Mock).mockRejectedValue({
      message: 'Firebase auth error',
    });

    renderComponent();

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // auth is mocked as {}
        'test@example.com',
        'password123'
      );
    });

    expect(await screen.findByText('Firebase auth error')).toBeInTheDocument();
    expect(postData).not.toHaveBeenCalled();
    expect(updateData).not.toHaveBeenCalled();
  });

  it('handles API postData error', async () => {
    // Mock successful Firebase auth
    (createUserWithEmailAndPassword as unknown as vi.Mock).mockResolvedValue({
      user: {
        email: 'test@example.com',
      },
    });

    // Mock postData failure
    (postData as unknown as vi.Mock).mockRejectedValue({
      message: 'postData error',
    });

    renderComponent();

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // auth is mocked as {}
        'test@example.com',
        'password123'
      );
      expect(postData).toHaveBeenCalledWith('MealCredits/Create/test@example.com', {
        accountName: 'Main Account',
      });
    });

    expect(await screen.findByText('postData error')).toBeInTheDocument();
    expect(updateData).not.toHaveBeenCalled();
    expect(screen.queryByText('Account created successfully!')).not.toBeInTheDocument();
  });

  it('handles API updateData error', async () => {
    // Mock successful Firebase auth
    (createUserWithEmailAndPassword as unknown as vi.Mock).mockResolvedValue({
      user: {
        email: 'test@example.com',
      },
    });

    // Mock successful postData
    (postData as unknown as vi.Mock).mockResolvedValue({});

    // Mock updateData failure
    (updateData as unknown as vi.Mock).mockRejectedValue({
      message: 'updateData error',
    });

    renderComponent();

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // auth is mocked as {}
        'test@example.com',
        'password123'
      );
      expect(postData).toHaveBeenCalledWith('MealCredits/Create/test@example.com', {
        accountName: 'Main Account',
      });
      expect(updateData).toHaveBeenCalledWith('MealCredits/Update/test@example.com/Main Account', {
        amount: 100,
        transactionType: 'moneyIn',
        date: expect.any(String),
        isDefault: true,
      });
    });

    expect(await screen.findByText('updateData error')).toBeInTheDocument();
    expect(screen.queryByText('Account created successfully!')).not.toBeInTheDocument();
  });

  it('calls onAlreadyHaveAccountClick when login link is clicked', () => {
    renderComponent();

    const loginLink = screen.getByText(/login/i);
    fireEvent.click(loginLink);

    expect(mockOnAlreadyHaveAccountClick).toHaveBeenCalled();
  });
});
