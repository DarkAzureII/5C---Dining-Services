import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { it, expect, describe } from 'vitest';
import HomePage from '../src/components/HomePage'; // Adjust the path to your HomePage

describe('HomePage', () => {
  it('renders NavBar, heading, SystemDescription, and Wits logo on initial load', () => {
    // Render the HomePage wrapped with MemoryRouter
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Check that the NavBar buttons are rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    // Check for the heading "Smart Campus!"
    expect(screen.getByText(/Smart Campus!/i)).toBeInTheDocument();
    // Check that the Wits logo and Main image are present
    expect(screen.getByAltText(/Main Image/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Wits Logo/i)).toBeInTheDocument();
    // Check that the system description is rendered
    expect(screen.getByText(/Enhancing Campus Life/i)).toBeInTheDocument();
  });

  it('hides LoginForm when "Login" is clicked', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Simulate clicking the "Create an account" button
    fireEvent.click(screen.getByText(/Login/i));
    // Assert that the signup form is now displayed
    // Assert that the email and password textboxes are present
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    // Assert that the System Description is no longer visible
    expect(screen.queryByText(/Enhancing Campus Life/i)).not.toBeInTheDocument();
  });

  it('shows SignupForm when "Signup" is clicked', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Simulate clicking the "Create an account" button
    fireEvent.click(screen.getByText(/Signup/i));
    // Assert that the email and password textboxes are present
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    // Assert that the System Description is no longer visible
    expect(screen.queryByText(/Enhancing Campus Life/i)).not.toBeInTheDocument();
  });

  it('shows System Description when Wits-Logo is clicked', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Simulate clicking the Wits-Logo button
    fireEvent.click(screen.getByAltText(/Wits-Logo/i));
    // Assert that the System Description is visible
    expect(screen.queryByText(/Enhancing Campus Life/i)).toBeInTheDocument();
  });
});
