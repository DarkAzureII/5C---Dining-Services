import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this is imported for the custom matchers
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './Dashboard'; 
import { within } from '@testing-library/react';

describe('Dashboard Component', () => {
/*  test('renders the Dashboard component', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    const heading = screen.getByRole('heading', { name: /Dining Services/i });
    expect(heading).toBeInTheDocument();

  }); */

   test('displays the user email when logged in', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(screen.getByText((content, element) => 
      content.startsWith('Welcome') && content.includes('testuser@example.com')
  )).toBeInTheDocument();
  
  });

  /*test('renders the menu when menu button is clicked', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const menuButton = screen.getByText('☰'); // assuming the menu button is displayed as ☰
    fireEvent.click(menuButton);

    // Check if the dashboard link in the menu is now visible
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('logs out when the "Log Out" button is clicked', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
  
    // Select the "Log Out" button based on its text
    const logOutButton = screen.getByRole('button', { name: /log out/i });
    expect(logOutButton).toBeInTheDocument();
  
    // Simulate clicking the "Log Out" button
    fireEvent.click(logOutButton);
  
    // You can now check if the expected side effects of logging out occur
    // e.g., redirect to login page, etc.
  });
  

  test('shows reservation history when "Reservation History" is clicked', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const historyButton = screen.getByText(/Reservation History/i);
    fireEvent.click(historyButton);

    // Check if the reservation history table is now visible
    expect(screen.getByText(/Reservation History/i)).toBeInTheDocument();
  });

  test('submits a review for a reservation', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
  
    // Click the correct "Review" button for the first reservation
    const reviewButtons = screen.getAllByText(/Review/i);
    fireEvent.click(reviewButtons[0]); // Adjust the index based on which button you want
  
    // Now that the form is visible, find the input field
    const reviewInput = screen.getByPlaceholderText(/Write your review here/i);
    fireEvent.change(reviewInput, { target: { value: 'Great experience!' } });
  
    // Submit the review
    const submitButton = screen.getByText(/Submit Review/i);
    fireEvent.click(submitButton);
  
    // Check if the review is submitted and displayed
    expect(screen.getByText(/Your Review:/i)).toBeInTheDocument();
    expect(screen.getByText(/Great experience!/i)).toBeInTheDocument();
    expect(screen.getByText(/5 ⭐/i)).toBeInTheDocument();
  }); */
  
});


