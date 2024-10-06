import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { it, expect, describe, vi } from 'vitest';
import App from '../src/App';
import HomePage from '../src/components/HomePage';
import LoginForm from '../src/components/LoginForm';
import SignupForm from '../src/components/SignupForm';
import Dashboard from  '../src/components/Dashboard';
import DiningReservationsPage from  '../src/components/Dining Reservations/DiningReservationsPage';
import DietaryManagementPage from '../src/components/Dietary Management/DietaryManagementPage';
import ReservationHistory from '../src/components/Feedback System/ReservationHistory'; 

describe('App Component', () => {
    const mockCreateAccountClick = vi.fn();

  it('renders the HomePage at the root path', () => {
    render(<HomePage />);
    
  });


  it('renders the SignupForm at /signup', () => {
    render(<SignupForm isActive={true} onAlreadyHaveAccountClick={mockCreateAccountClick} />);
    
  });



  it('renders the ReservationHistory at /reservation-history', () => {
    render(<ReservationHistory />);
    
  });
});