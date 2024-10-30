// tests/HomePage.test.tsx
/// <reference types="vitest/globals" />

// 1. Define mocks before any imports

// Mock firebaseConfig with auth containing onAuthStateChanged
vi.mock('../src/firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
  },
  db: {}, // Mock db if necessary
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
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../src/components/HomePage';
import { auth } from '../src/firebaseConfig';

describe('HomePage', () => {
  const mockUser = {
    uid: '12345',
    email: 'testuser@example.com',
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();
  });

  it('renders all main elements correctly', () => {
    // Mock onAuthStateChanged to immediately call the callback with mockUser
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(mockUser);
      return vi.fn(); // Return a mock unsubscribe function
    });

    render(<HomePage />);

    // Check for NavBar elements: 'Login', 'Signup', 'Wits University', etc.
    const loginButton = screen.getByRole('button', { name: /login/i });
    const signupButton = screen.getByRole('button', { name: /signup/i });
    const universityText = screen.getByText('Wits University');
    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
    expect(universityText).toBeInTheDocument();

    // Check for fixed heading elements
    const headingImage = screen.getByAltText('Wits Logo');
    expect(headingImage).toBeInTheDocument();

    const headingText = screen.getByText('Smart Campus!');
    expect(headingText).toBeInTheDocument();

    // Check for main image
    const mainImage = screen.getByAltText('Main Image');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', 'Wits-DH.jpg');

    // Check for overlay content
    // Based on your DOM snapshot, these texts should be present
    expect(screen.getByText('Enhancing Campus Life')).toBeInTheDocument();
    expect(screen.getByText('Dining Services')).toBeInTheDocument();
  });

  it('handles login button click and navigates to login page', () => {
    // Mock onAuthStateChanged to call with null user (not authenticated)
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(null);
      return vi.fn(); // Return a mock unsubscribe function
    });

    render(<HomePage />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/auth?mode=login');
  });

  it('handles signup button click and navigates to signup page', () => {
    // Mock onAuthStateChanged to call with null user (not authenticated)
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(null);
      return vi.fn(); // Return a mock unsubscribe function
    });

    render(<HomePage />);

    const signupButton = screen.getByRole('button', { name: /signup/i });
    expect(signupButton).toBeInTheDocument();

    fireEvent.click(signupButton);

    expect(mockNavigate).toHaveBeenCalledWith('/auth?mode=signup');
  });

  it('renders correctly when user is not authenticated', () => {
    // Mock onAuthStateChanged to call the callback with null user
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(null);
      return vi.fn(); // Return a mock unsubscribe function
    });

    render(<HomePage />);

    // Check that 'Login' and 'Signup' buttons are present
    const loginButton = screen.getByRole('button', { name: /login/i });
    const signupButton = screen.getByRole('button', { name: /signup/i });

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();

    // Ensure user-specific elements are not present
    const userEmail = screen.queryByText(mockUser.email);
    expect(userEmail).not.toBeInTheDocument();
  });

  it('calls handleLogoClick when logo is clicked', () => {
    // Mock onAuthStateChanged to call with mockUser
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(mockUser);
      return vi.fn(); // Return a mock unsubscribe function
    });

    render(<HomePage />);

    const logo = screen.getByAltText('Wits Logo');
    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);

    // Since handleLogoClick has no implementation, verify no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
