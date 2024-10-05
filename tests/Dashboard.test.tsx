import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { it, expect, describe } from 'vitest';
import Dashboard from '../src/components/Dashboard'; // Adjust the path to your Dashboard

describe('Dashboard', () => {
  it('renders the Dashboard with the correct components', () => {
    // Render the Dashboard wrapped with MemoryRouter
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    
    expect(screen.getByAltText(/Wits-Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/Dining Services/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Menu Access/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Dining Reservations/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Rate/i})).toBeInTheDocument();
  });

  it('shows the Menu Access form when "Menu Access" is clicked', () => {

  });

  it('shows the Dietary Management form when "Dietary Management" is clicked', () => {

  });

  it('shows the Dining Reservations form when "Dining Reservations" is clicked', () => {

  });
  
  it('shows the Feedback form when "Rate the app" is clicked', () => {
    
  });

  it('shows the Logout button when "Welcome," is clicked', () => {
    render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText(/Welcome,/i));
    expect(screen.getByText(/Log out/i)).toBeInTheDocument();
    
  });

  it('shows the side panel when "three lines" is clicked', () => {
    
  });

  it('handles logout when "wits-logo" is clicked', () => {
    
  });

  it('Reloads Dashboard when "Dashboard" is clicked', () => {
    
  });

  it('Takes you to Dietary Manger when "Dietary Mangement" under side panel is clicked', () => {
    
  });

  it('Takes user to Meal credit Manger when "Meal Credits" is clicked', () => {
    
  });

  it('Takes user to Dining Reservations when "Dining Reservation" is clicked', () => {
        
  });

});