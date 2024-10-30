// // tests/DietaryManagementPage.test.tsx
// /// <reference types="vitest/globals" />

// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import DietaryManagementPage from '../../src/components/Dietary Management/DietaryManagementPage';
// import { auth } from '../../src/firebaseConfig';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Mock react-router-dom's useNavigate
// const mockNavigate = vi.fn();

// vi.mock('react-router-dom', () => ({
//   ...vi.importActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
// }));

// // Mock axios
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// vi.mock('axios');

// // Mock firebaseConfig
// vi.mock('../src/firebaseConfig', () => ({
//   auth: {
//     onAuthStateChanged: vi.fn(),
//     signOut: vi.fn(),
//     currentUser: null, // Default to null; override in tests
//   },
//   db: {},
// }));

// // Mock child components to focus on DietaryManagementPage behavior
// vi.mock('../src/components/Feedback System/Feedback', () => ({
//   default: () => <div data-testid="feedback">Feedback Component</div>,
// }));

// vi.mock('../src/components/DietaryPreferencesHandler', () => ({
//   default: () => <div data-testid="dietary-preferences-handler">DietaryPreferencesHandler Component</div>,
// }));

// vi.mock('../src/components/Feedback System/ReservationHistory', () => ({
//   default: () => <div data-testid="reservation-history">ReservationHistory Component</div>,
// }));

// describe('DietaryManagementPage', () => {
//   const mockUser = {
//     uid: '12345',
//     email: 'testuser@example.com',
//     displayName: 'Test User',
//   };

//   beforeEach(() => {
//     // Clear all mocks before each test
//     vi.resetAllMocks();

//     // Default mock implementation: unauthenticated user
//     (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
//       callback(null);
//       return vi.fn(); // Mock unsubscribe function
//     });

//     auth.signOut = vi.fn().mockResolvedValue(undefined);

//     // Reset axios mock
//     mockedAxios.get.mockReset();
//   });

//   it('renders NavBar and background image correctly', () => {
//     render(<DietaryManagementPage />);

//     // Check for menu button
//     const menuButton = screen.getByTestId('menu-button');
//     expect(menuButton).toBeInTheDocument();

//     // Check for background image
//     const backgroundImage = screen.getByAltText('backgroundImage');
//     expect(backgroundImage).toBeInTheDocument();

//     // Check that user email displays as Guest initially
//     const welcomeMessage = screen.getByText('Welcome Guest');
//     expect(welcomeMessage).toBeInTheDocument();

//     // Check that logout button is not visible initially
//     const logoutButton = screen.queryByTestId('logout-button');
//     expect(logoutButton).not.toBeInTheDocument();
//   });

//   it('sets user state correctly when authenticated', () => {
//     // Mock onAuthStateChanged to simulate authenticated user
//     (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
//       callback(mockUser);
//       return vi.fn(); // Mock unsubscribe function
//     });

//     render(<DietaryManagementPage />);

//     // Check that user email is displayed
//     const welcomeMessage = screen.getByText(`Welcome ${mockUser.email}`);
//     expect(welcomeMessage).toBeInTheDocument();

//     // Check that logout button is displayed
//     const logoutButton = screen.getByTestId('logout-button');
//     expect(logoutButton).toBeInTheDocument();
//   });

//   it('handles logout correctly', async () => {
//     // Mock onAuthStateChanged to simulate authenticated user
//     (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
//       callback(mockUser);
//       return vi.fn(); // Mock unsubscribe function
//     });

//     render(<DietaryManagementPage />);

//     // Check that logout button is displayed
//     const logoutButton = screen.getByTestId('logout-button');
//     expect(logoutButton).toBeInTheDocument();

//     // Click logout button
//     fireEvent.click(logoutButton);

//     // Expect auth.signOut to have been called
//     expect(auth.signOut).toHaveBeenCalledTimes(1);

//     // Wait for navigation to occur
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/');
//       expect(mockNavigate).toHaveBeenCalledTimes(1);
//     });

//     // After logout, user email should display as Guest
//     const welcomeMessage = screen.getByText('Welcome Guest');
//     expect(welcomeMessage).toBeInTheDocument();

//     // Logout button should no longer be visible
//     expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
//   });

//   it('toggles side menu correctly', () => {
//     render(<DietaryManagementPage />);

//     const menuButton = screen.getByTestId('menu-button');
//     expect(menuButton).toBeInTheDocument();

//     // Initially, side menu should be hidden (left: -300px)
//     const sideMenu = screen.getByRole('link', { name: /dashboard/i }).parentElement;
//     expect(sideMenu).toHaveClass('left-[-300px]');

//     // Click menu button to open side menu
//     fireEvent.click(menuButton);

//     // Side menu should now have class left-0
//     expect(sideMenu).toHaveClass('left-0');

//     // Close menu button should appear
//     const closeMenuButton = screen.getByTestId('close-menu-button');
//     expect(closeMenuButton).toBeInTheDocument();

//     // Click close menu button to hide side menu
//     fireEvent.click(closeMenuButton);

//     // Side menu should have class left-[-300px]
//     expect(sideMenu).toHaveClass('left-[-300px]');

//     // Close menu button should no longer be visible
//     expect(screen.queryByTestId('close-menu-button')).not.toBeInTheDocument();
//   });

//   it('navigates to Dashboard when Dashboard link is clicked', () => {
//     render(<DietaryManagementPage />);

//     // Open the side menu
//     const menuButton = screen.getByTestId('menu-button');
//     fireEvent.click(menuButton);

//     // Find Dashboard link
//     const dashboardLink = screen.getByTestId('dashboard-link');
//     expect(dashboardLink).toBeInTheDocument();

//     // Click Dashboard link
//     fireEvent.click(dashboardLink);

//     // Expect navigate to have been called with "/dashboard"
//     expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
//     expect(mockNavigate).toHaveBeenCalledTimes(1);
//   });

//   it('navigates to Dietary Management when Dietary Management button is clicked', () => {
//     render(<DietaryManagementPage />);

//     // Open the side menu
//     const menuButton = screen.getByTestId('menu-button');
//     fireEvent.click(menuButton);

//     // Find Dietary Management button
//     const dietaryManagementButton = screen.getByText('Dietary Management');
//     expect(dietaryManagementButton).toBeInTheDocument();

//     // Click Dietary Management button
//     fireEvent.click(dietaryManagementButton);

//     // Expect navigate to have been called with "/dietary-management"
//     expect(mockNavigate).toHaveBeenCalledWith('/dietary-management');
//     expect(mockNavigate).toHaveBeenCalledTimes(1);
//   });

//   it('navigates to Meal Credits when Meal Credits button is clicked', () => {
//     render(<DietaryManagementPage />);

//     // Open the side menu
//     const menuButton = screen.getByTestId('menu-button');
//     fireEvent.click(menuButton);

//     // Find Meal Credits button
//     const mealCreditsButton = screen.getByText('Meal Credits');
//     expect(mealCreditsButton).toBeInTheDocument();

//     // Click Meal Credits button
//     fireEvent.click(mealCreditsButton);

//     // Expect navigate to have been called with "/meal-credits"
//     expect(mockNavigate).toHaveBeenCalledWith('/meal-credits');
//     expect(mockNavigate).toHaveBeenCalledTimes(1);
//   });

//   it('navigates to Dining Reservation when Dining Reservation button is clicked', () => {
//     render(<DietaryManagementPage />);

//     // Open the side menu
//     const menuButton = screen.getByTestId('menu-button');
//     fireEvent.click(menuButton);

//     // Find Dining Reservation button
//     const diningReservationButton = screen.getByText('Dining Reservation');
//     expect(diningReservationButton).toBeInTheDocument();

//     // Click Dining Reservation button
//     fireEvent.click(diningReservationButton);

//     // Expect navigate to have been called with "/dining-reservations"
//     expect(mockNavigate).toHaveBeenCalledWith('/dining-reservations');
//     expect(mockNavigate).toHaveBeenCalledTimes(1);
//   });

//   it('toggles Reservation History correctly', () => {
//     render(<DietaryManagementPage />);

//     // Open the side menu
//     const menuButton = screen.getByTestId('menu-button');
//     fireEvent.click(menuButton);

//     // Find History button
//     const historyButton = screen.getByText('History');
//     expect(historyButton).toBeInTheDocument();

//     // Initially, ReservationHistory should not be visible
//     expect(screen.queryByTestId('reservation-history')).not.toBeInTheDocument();

//     // Click History button to open ReservationHistory
//     fireEvent.click(historyButton);

//     // ReservationHistory should now be visible
//     const reservationHistory = screen.getByTestId('reservation-history');
//     expect(reservationHistory).toBeInTheDocument();

//     // Click History button again to close ReservationHistory
//     fireEvent.click(historyButton);

//     // ReservationHistory should no longer be visible
//     expect(screen.queryByTestId('reservation-history')).not.toBeInTheDocument();
//   });

//   it('handles feedback sidebar toggle correctly', () => {
//     render(<DietaryManagementPage />);

//     // Initially, Feedback sidebar should be hidden
//     expect(screen.queryByTestId('feedback')).not.toBeInTheDocument();

//     // Find Rate the app button
//     const rateAppButton = screen.getByText('Rate the app!');
//     expect(rateAppButton).toBeInTheDocument();

//     // Click Rate the app button to open Feedback sidebar
//     fireEvent.click(rateAppButton);

//     // Feedback component should now be visible
//     const feedbackComponent = screen.getByTestId('feedback');
//     expect(feedbackComponent).toBeInTheDocument();

//     // Button text should change to "Close Feedback"
//     const closeFeedbackButton = screen.getByText('Close Feedback');
//     expect(closeFeedbackButton).toBeInTheDocument();

//     // Click Close Feedback button to hide Feedback sidebar
//     fireEvent.click(closeFeedbackButton);

//     // Feedback component should no longer be visible
//     expect(screen.queryByTestId('feedback')).not.toBeInTheDocument();

//     // Button text should revert to "Rate the app!"
//     expect(screen.getByText('Rate the app!')).toBeInTheDocument();
//   });

//   it('renders DietaryPreferencesHandler when activeTab is DietaryManagement', () => {
//     render(<DietaryManagementPage />);

//     // By default, activeTab is "DietaryManagement", so DietaryPreferencesHandler should be rendered
//     const dietaryPreferencesHandler = screen.getByTestId('dietary-preferences-handler');
//     expect(dietaryPreferencesHandler).toBeInTheDocument();
//   });

//   it('renders ReservationHistory when showReservationHistory is true', () => {
//     render(<DietaryManagementPage />);

//     // Open the side menu
//     const menuButton = screen.getByTestId('menu-button');
//     fireEvent.click(menuButton);

//     // Click History button to open ReservationHistory
//     const historyButton = screen.getByText('History');
//     fireEvent.click(historyButton);

//     // Check that ReservationHistory component is rendered
//     const reservationHistory = screen.getByTestId('reservation-history');
//     expect(reservationHistory).toBeInTheDocument();

//     // Click close button inside ReservationHistory
//     const closeButton = screen.getByText('&times;');
//     fireEvent.click(closeButton);

//     // ReservationHistory should no longer be visible
//     expect(screen.queryByTestId('reservation-history')).not.toBeInTheDocument();
//   });

//   it('handles user authentication state changes correctly', () => {
//     render(<DietaryManagementPage />);

//     // Initially, user is unauthenticated
//     const welcomeMessage = screen.getByText('Welcome Guest');
//     expect(welcomeMessage).toBeInTheDocument();

//     // Mock onAuthStateChanged to simulate authenticated user
//     (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
//       callback(mockUser);
//       return vi.fn(); // Mock unsubscribe function
//     });

//     // Re-render component to trigger useEffect
//     render(<DietaryManagementPage />);

//     // Now, welcome message should display user email
//     const updatedWelcomeMessage = screen.getByText(`Welcome ${mockUser.email}`);
//     expect(updatedWelcomeMessage).toBeInTheDocument();

//     // Logout button should now be visible
//     const logoutButton = screen.getByTestId('logout-button');
//     expect(logoutButton).toBeInTheDocument();
//   });
// });
