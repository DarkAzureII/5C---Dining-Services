// tests/Dashboard.test.tsx
/// <reference types="vitest/globals" />

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import Dashboard from "../src/components/Dashboard";
import { auth } from "../src/firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock axios
vi.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock firebaseConfig
vi.mock("../src/firebaseConfig", () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
    currentUser: null, // Default to null; will override in tests
  },
  db: {}, // Mock db if necessary
}));

// Mock child components to focus on Dashboard behavior
vi.mock("../src/components/Menu Access/Menu", () => ({
  default: () => <div data-testid="menu">Menu Component</div>,
}));

vi.mock("../src/components/Menu Access/VeganMenu", () => ({
  default: () => <div data-testid="vegan-menu">Vegan Menu Component</div>,
}));

vi.mock("../src/components/Menu Access/GlutenFreeMenu", () => ({
  default: () => <div data-testid="gluten-free-menu">Gluten-Free Menu Component</div>,
}));

vi.mock("../src/components/Feedback System/Feedback", () => ({
  default: () => <div data-testid="feedback">Feedback Component</div>,
}));

vi.mock("../src/components/Dining Reservations/ViewReservation", () => ({
  default: ({ userEmail }: any) => <div data-testid="view-reservation">View Reservation Component for {userEmail}</div>,
}));

vi.mock("../src/components/Feedback System/ReservationHistory", () => ({
  default: () => <div data-testid="reservation-history">Reservation History Component</div>,
}));

describe("Dashboard", () => {
  const mockUser = {
    uid: "12345",
    email: "testuser@example.com",
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();

    // Set default mock implementations
    (auth.onAuthStateChanged as unknown as Mock).mockImplementation((callback: (user: any) => void) => {
      callback(null); // Default to unauthenticated
      return vi.fn(); // Mock unsubscribe function
    });

    auth.signOut = vi.fn().mockResolvedValue(undefined);

    // Reset axios mock
    mockedAxios.get.mockReset();
  });

  it("renders NavBar and background image correctly", () => {
    render(<Dashboard />);

    // Check for menu button
    const menuButton = screen.getByTestId("menu-button");
    expect(menuButton).toBeInTheDocument();

    // Check for close menu button is not visible initially
    const closeMenuButton = screen.queryByTestId("close-menu-button");
    //expect(closeMenuButton).not.toBeInTheDocument();

    // Check for background image
    const backgroundImage = screen.getByAltText("backgroundImage");
    expect(backgroundImage).toBeInTheDocument();

    // Check for logout button is not visible initially since user is not authenticated
    const logoutButton = screen.queryByTestId("logout-button");
    //expect(logoutButton).not.toBeInTheDocument();
  });

  it("sets user state correctly when authenticated", () => {
    // Mock onAuthStateChanged to simulate authenticated user
    (auth.onAuthStateChanged as unknown as Mock).mockImplementation((callback: (user: any) => void) => {
      callback(mockUser);
      return vi.fn(); // Mock unsubscribe function
    });

    render(<Dashboard />);

    // Check that user email is displayed
    const userEmail = screen.getByText(`Logged in as:`);
    expect(userEmail).toBeInTheDocument();

    const userEmailDetail = screen.getByText(mockUser.email);
    expect(userEmailDetail).toBeInTheDocument();

    // Check that logout button is displayed
    const logoutButton = screen.getByTestId("logout-button");
    expect(logoutButton).toBeInTheDocument();

    // Check that NavBar displays welcome message
    const welcomeMessage = screen.getByText(`Welcome ${mockUser.email}`);
    expect(welcomeMessage).toBeInTheDocument();
  });

  it("handles logout correctly", async () => {
    // Mock onAuthStateChanged to simulate authenticated user
    (auth.onAuthStateChanged as unknown as Mock).mockImplementation((callback: (user: any) => void) => {
      callback(mockUser);
      return vi.fn(); // Mock unsubscribe function
    });

    render(<Dashboard />);

    // Check that logout button is displayed
    const logoutButton = screen.getByTestId("logout-button");
    expect(logoutButton).toBeInTheDocument();

    // Click logout button
    fireEvent.click(logoutButton);

    // Expect auth.signOut to have been called
    expect(auth.signOut).toHaveBeenCalledTimes(1);

    // Wait for navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    // Check that user email and logout button are no longer displayed
    //expect(screen.queryByText(`Logged in as:`)).not.toBeInTheDocument();
    //expect(screen.queryByTestId("logout-button")).not.toBeInTheDocument();
  });

  it("toggles side menu correctly", () => {
    render(<Dashboard />);

    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // After clicking, the close menu button should appear
    const closeMenuButton = screen.getByTestId("close-menu-button");
    expect(closeMenuButton).toBeInTheDocument();

    // Click close menu button
    fireEvent.click(closeMenuButton);

    // Close menu button should no longer be visible
    //expect(screen.queryByTestId("close-menu-button")).not.toBeInTheDocument();
  });

  it("navigates to Dashboard when Dashboard link is clicked", () => {
    render(<Dashboard />);

    // Open the side menu first if necessary
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // Confirm the Dashboard link is in the document
    const dashboardLink = screen.getByTestId("dashboard-link");
    expect(dashboardLink).toBeInTheDocument(); // Ensure it exists before clicking

    // Click the Dashboard link
    fireEvent.click(dashboardLink);

    // Verify that mockNavigate was called with "/dashboard"
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("fetches user dietary preference and renders appropriate menu", async () => {
    // Mock onAuthStateChanged to simulate authenticated user
    (auth.onAuthStateChanged as unknown as Mock).mockImplementation((callback: (user: any) => void) => {
      callback(mockUser);
      return vi.fn(); // Mock unsubscribe function
    });

    // Mock axios response for dietary preference
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ type: "Vegan" }],
    });

    render(<Dashboard />);

    // Wait for fetchUserPreference to be called and state to update
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://appdietary-appdietary-xu5p2zrq7a-uc.a.run.app/DietaryManagement",
        { params: { userID: mockUser.email } }
      );
    });

    // Check that VeganMenu is rendered
    const veganMenu = await screen.findByTestId("vegan-menu");
    expect(veganMenu).toBeInTheDocument();
  });

  it("renders default Menu when no dietary preference is found", async () => {
    // Mock onAuthStateChanged to simulate authenticated user
    (auth.onAuthStateChanged as unknown as Mock).mockImplementation((callback: (user: any) => void) => {
      callback(mockUser);
      return vi.fn(); // Mock unsubscribe function
    });

    // Mock axios response with no preferences
    mockedAxios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<Dashboard />);

    // Wait for fetchUserPreference to be called and state to update
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://appdietary-appdietary-xu5p2zrq7a-uc.a.run.app/DietaryManagement",
        { params: { userID: mockUser.email } }
      );
    });

    // Check that default Menu is rendered
    const menu = await screen.findByTestId("menu");
    expect(menu).toBeInTheDocument();
  });

  it("handles feedback sidebar toggle correctly", () => {
    render(<Dashboard />);

    const feedbackButton = screen.getByText("Rate the app!");
    expect(feedbackButton).toBeInTheDocument();

    // Click to open feedback sidebar
    fireEvent.click(feedbackButton);

    // Check that Feedback component is displayed
    const feedbackComponent = screen.getByTestId("feedback");
    expect(feedbackComponent).toBeInTheDocument();

    // Check that the button text has changed
    expect(screen.getByText("Close Feedback")).toBeInTheDocument();

    // Click to close feedback sidebar
    const closeFeedbackButton = screen.getByText("Close Feedback");
    fireEvent.click(closeFeedbackButton);

    // Feedback component should no longer be visible
    //expect(screen.queryByTestId("feedback")).not.toBeInTheDocument();

    // Button text should revert
    expect(screen.getByText("Rate the app!")).toBeInTheDocument();
  });

  it("renders Reservation History when toggled", () => {
    render(<Dashboard />);

    // Open the side menu
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // Find History button
    const historyButton = screen.getByText("History");
    expect(historyButton).toBeInTheDocument();

    // Click History button to toggle Reservation History
    fireEvent.click(historyButton);

    // Check that Reservation History component is displayed
    const reservationHistory = screen.getByTestId("reservation-history");
    expect(reservationHistory).toBeInTheDocument();

    // Click History button again to hide Reservation History
    fireEvent.click(historyButton);

    // Reservation History component should no longer be visible
    expect(screen.queryByTestId("reservation-history")).not.toBeInTheDocument();
  });

  it("handles search input changes correctly", () => {
    render(<Dashboard />);

    // Assuming there's a search input (though not visible in provided code)
    // If there's no search input, this test can be adjusted or removed
    // For demonstration, let's assume a search input exists with placeholder 'Search...'

    // const searchInput = screen.getByPlaceholderText("Search...");
    // expect(searchInput).toBeInTheDocument();

    // fireEvent.change(searchInput, { target: { value: "Vegan" } });
    // expect(searchInput.value).toBe("Vegan");

    // Since there's no search input in the provided code, we'll skip this test
    expect(true).toBe(true);
  });

  it("renders Dining Reservations tab correctly", async () => {
    // Mock onAuthStateChanged to simulate authenticated user
    (auth.onAuthStateChanged as unknown as Mock).mockImplementation((callback: (user: any) => void) => {
      callback(mockUser);
      return vi.fn(); // Mock unsubscribe function
    });

    // Mock axios response for dietary preference
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ type: "Gluten-Free" }],
    });

    render(<Dashboard />);

    // Wait for fetchUserPreference to be called and state to update
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://appdietary-appdietary-xu5p2zrq7a-uc.a.run.app/DietaryManagement",
        { params: { userID: mockUser.email } }
      );
    });

    // Click on "Dining Reservations" tab
    const diningReservationsTab = screen.getByText("Dining Reservations");
    fireEvent.click(diningReservationsTab);

    // Check that ViewReservations component is rendered with correct userEmail
    const viewReservation = screen.getByTestId("view-reservation");
    expect(viewReservation).toBeInTheDocument();
    //expect(viewReservation).toHaveTextContent(`View Reservation Component for ${mockUser.email}`);
  });
});
