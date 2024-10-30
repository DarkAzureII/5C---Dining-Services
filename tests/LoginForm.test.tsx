// tests/LoginForm.test.tsx
/// <reference types="vitest/globals" />

// 1. Define mocks before any imports

// Mock Firebase Auth functions before imports
vi.mock('firebase/auth', () => ({
  ...vi.importActual('firebase/auth'),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({})),
}));

// Mock Firebase Firestore functions
vi.mock('firebase/firestore', () => ({
  ...vi.importActual('firebase/firestore'),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

// Mock firebaseConfig without referencing external variables
vi.mock('../src/firebaseConfig', () => ({
  auth: {}, // Directly define `auth` as an empty object
  db: {},    // Directly define `db` as an empty object
}));

// Mock API functions
vi.mock('../src/API/MealCredits', () => ({
  postData: vi.fn(),
  updateData: vi.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 2. Now import modules after mocks
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import LoginForm from '../src/components/LoginForm';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { postData, updateData } from '../src/API/MealCredits';

describe('LoginForm', () => {
  const mockOnCreateAccountClick = vi.fn();
  const mockOnToggle = vi.fn();

  const renderComponent = (isActive: boolean = true) => {
    render(
      <LoginForm
        isActive={isActive}
        onCreateAccountClick={mockOnCreateAccountClick}
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
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it('does not render when not active', () => {
    expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in with google/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/don't have an account\?/i)).not.toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    renderComponent();
    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('handles form submission successfully with email and password', async () => {
    // Mock successful signInWithEmailAndPassword
    (signInWithEmailAndPassword as unknown as Mock).mockResolvedValue({
      user: {
        email: 'test@example.com',
      },
    });

    renderComponent();

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // auth is mocked as {}
        'test@example.com',
        'password123'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  it('handles form submission failure with email and password', async () => {
    // Mock failed signInWithEmailAndPassword
    (signInWithEmailAndPassword as unknown as Mock).mockRejectedValue(new Error('Invalid credentials'));

    renderComponent();

    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {}, // auth is mocked as {}
        'test@example.com',
        'wrongpassword'
      );
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles Google sign-in successfully when user document does not exist', async () => {
    // Mock signInWithPopup to return a user
    const mockUser = {
      email: 'googleuser@example.com',
    };
    (signInWithPopup as unknown as Mock).mockResolvedValue({
      user: mockUser,
    });

    // Mock getDoc to return non-existent user document
    (doc as unknown as Mock).mockReturnValue('docRef');
    (getDoc as unknown as Mock).mockResolvedValue({
      exists: () => false,
    });

    // Mock postData and updateData
    (postData as unknown as Mock).mockResolvedValue({});
    (updateData as unknown as Mock).mockResolvedValue({});

    renderComponent();

    const googleSignInButton = screen.getByRole('button', { name: /sign in with google/i });

    fireEvent.click(googleSignInButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(doc).toHaveBeenCalledWith({}, 'Credits', 'googleuser@example.com');
      expect(getDoc).toHaveBeenCalledWith('docRef');
      expect(postData).toHaveBeenCalledWith('MealCredits/Create/googleuser@example.com', {
        accountName: 'Main Account',
      });
      expect(updateData).toHaveBeenCalledWith('MealCredits/Update/googleuser@example.com/Main Account', {
        amount: 100,
        transactionType: 'moneyIn',
        date: expect.any(String),
        isDefault: true,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(screen.queryByText(/failed to retrieve user email/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/an unknown error occurred during google sign-in/i)).not.toBeInTheDocument();
    });
  });

  it('handles Google sign-in successfully when user document already exists', async () => {
    // Mock signInWithPopup to return a user
    const mockUser = {
      email: 'existinguser@example.com',
    };
    (signInWithPopup as unknown as Mock).mockResolvedValue({
      user: mockUser,
    });

    // Mock getDoc to return existing user document
    (doc as unknown as Mock).mockReturnValue('docRef');
    (getDoc as unknown as Mock).mockResolvedValue({
      exists: () => true,
    });

    renderComponent();

    const googleSignInButton = screen.getByRole('button', { name: /sign in with google/i });

    fireEvent.click(googleSignInButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(doc).toHaveBeenCalledWith({}, 'Credits', 'existinguser@example.com');
      expect(getDoc).toHaveBeenCalledWith('docRef');
      expect(postData).not.toHaveBeenCalled();
      expect(updateData).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(screen.queryByText(/failed to retrieve user email/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/an unknown error occurred during google sign-in/i)).not.toBeInTheDocument();
    });
  });

  it('handles Google sign-in failure', async () => {
    // Mock signInWithPopup to reject
    (signInWithPopup as unknown as Mock).mockRejectedValue(new Error('Google sign-in failed'));

    renderComponent();

    const googleSignInButton = screen.getByRole('button', { name: /sign in with google/i });

    fireEvent.click(googleSignInButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(screen.getByText('Google sign-in failed')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(postData).not.toHaveBeenCalled();
      expect(updateData).not.toHaveBeenCalled();
    });
  });

  it('handles missing user email after Google sign-in', async () => {
    // Mock signInWithPopup to return a user without email
    (signInWithPopup as unknown as Mock).mockResolvedValue({
      user: {},
    });

    renderComponent();

    const googleSignInButton = screen.getByRole('button', { name: /sign in with google/i });

    fireEvent.click(googleSignInButton);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(screen.getByText('Failed to retrieve user email')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(postData).not.toHaveBeenCalled();
      expect(updateData).not.toHaveBeenCalled();
    });
  });

  it('calls onCreateAccountClick when Sign Up link is clicked', () => {
    renderComponent();

    const signUpLink = screen.getByText(/sign up/i);
    fireEvent.click(signUpLink);

    expect(mockOnCreateAccountClick).toHaveBeenCalled();
  });
});
