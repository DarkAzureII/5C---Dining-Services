// tests/NavBar.test.tsx
/// <reference types="vitest/globals" />

// 1. Define mocks before any imports

// No external dependencies to mock for NavBar
// If NavBar had dependencies, mock them here

// 2. Now import modules after mocks
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavBar from '../src/components/NavBar';

describe('NavBar', () => {
  const mockOnLoginClick = vi.fn();
  const mockOnSignupClick = vi.fn();
  const mockOnLogoClick = vi.fn();

  const renderComponent = () => {
    render(
      <NavBar
        onLoginClick={mockOnLoginClick}
        onSignupClick={mockOnSignupClick}
        onLogoClick={mockOnLogoClick}
      />
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();
  });

  it('renders all main elements correctly', () => {
    renderComponent();

    // Check for logo
    const logo = screen.getByTestId('wits-logo');
    expect(logo).toBeInTheDocument();

    // Check for 'Wits University' text
    const universityText = screen.getByText('Wits University');
    expect(universityText).toBeInTheDocument();

    // Check for 'Login' and 'Signup' buttons
    const loginButton = screen.getByRole('button', { name: /login/i });
    const signupButton = screen.getByRole('button', { name: /signup/i });
    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  it('calls onLogoClick when logo is clicked', () => {
    renderComponent();

    const logo = screen.getByTestId('wits-logo');
    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);

    expect(mockOnLogoClick).toHaveBeenCalledTimes(1);
  });

  it('calls onLoginClick when Login button is clicked', () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);

    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
  });

  it('calls onSignupClick when Signup button is clicked', () => {
    renderComponent();

    const signupButton = screen.getByRole('button', { name: /signup/i });
    expect(signupButton).toBeInTheDocument();

    fireEvent.click(signupButton);

    expect(mockOnSignupClick).toHaveBeenCalledTimes(1);
  });
});
