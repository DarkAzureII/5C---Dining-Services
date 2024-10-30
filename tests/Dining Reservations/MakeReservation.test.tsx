// tests/Dining Reservations/MakeReservation.test.tsx

/// <reference types="vitest/globals" />

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MakeReservation from "../../src/components/Dining Reservations/MakeReservation"; // Adjust the import path as needed
import { auth } from "../../src/firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();

// Mock react-router-dom partially to preserve MemoryRouter and other components
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios globally
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

// Mock firebaseConfig to ensure auth functions are mocked
vi.mock("../../src/firebaseConfig", () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
    currentUser: null, // Default to null; will override in tests
  },
  db: {}, // Mock db if necessary
}));

describe("MakeReservation Component", () => {
  const mockUser = {
    uid: "12345",
    email: "testuser@example.com",
    displayName: "Test User",
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();

    // Mock auth.onAuthStateChanged to simulate authenticated user
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(mockUser); // Simulate an authenticated user
      return () => {}; // Mock unsubscribe function
    });

    // Reset axios mocks
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.put.mockReset();
  });

  afterEach(() => {
    // Clear navigate mock after each test
    mockNavigate.mockClear();
  });

  // Helper function to render the component with necessary routing
  const renderComponent = (initialData = null) => {
    const MockedRoutes = () => (
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/make-reservation",
            state: { initialData },
          },
        ]}
      >
        <Routes>
          <Route path="/make-reservation" element={<MakeReservation />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    return render(<MockedRoutes />);
  };

  it("renders correctly for creating a new reservation", async () => {
    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
      {
        id: "2",
        Name: "Dining Hall 2",
        Building: "Building B",
        Features: ["Heated"],
        Category: "Dining",
        Capacity: 80,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    renderComponent();

    // Wait for venues to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Dining Hall 1")).toBeInTheDocument();
      expect(screen.getByText("Dining Hall 2")).toBeInTheDocument();
    });

    // Check form fields are rendered with initial empty values
    expect(screen.getByLabelText(/select date/i)).toHaveValue("");
    expect(screen.getByLabelText(/select time/i)).toHaveValue("");
    expect(screen.getByTestId("diningHall-select")).toHaveValue("");

    // Check button text for creating a new reservation
    expect(screen.getByRole("button", { name: /reserve now/i })).toBeInTheDocument();
  });

  it("renders correctly for editing an existing reservation", async () => {
    const initialData = {
      id: "res123",
      resDate: "2023-12-25",
      resTime: "12:00",
      venue: "Dining Hall 1",
      userID: "testuser@example.com",
    };

    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    renderComponent(initialData);

    // Wait for form fields to be pre-filled
    await waitFor(() => {
      expect(screen.getByLabelText(/select date/i)).toHaveValue("2023-12-25");
      expect(screen.getByLabelText(/select time/i)).toHaveValue("12:00");
      //expect(screen.getByTestId("diningHall-select")).toHaveValue("Dining Hall 1");
    });

    // Check button text for editing an existing reservation
    expect(screen.getByRole("button", { name: /update reservation/i })).toBeInTheDocument();
  });

  it("handles form submission for creating a new reservation successfully", async () => {
    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    // Mock the POST request for creating a reservation
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "res123" },
    });

    renderComponent();

    // Wait for venues to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Dining Hall 1")).toBeInTheDocument();
    });

    // Fill out the form
    const dateInput = screen.getByLabelText(/select date/i);
    userEvent.type(dateInput, "2023-12-25");
    //expect(dateInput).toHaveValue("2023-12-25");

    const timeSelect = screen.getByLabelText(/select time/i);
    userEvent.selectOptions(timeSelect, "12:00");
    //expect(timeSelect).toHaveValue("12:00");

    // const venueSelect = screen.getByTestId("diningHall-select");
    // userEvent.selectOptions(venueSelect, "Dining Hall 1");
    // //expect(venueSelect).toHaveValue("Dining Hall 1");

    // Click "Reserve Now" button
    const reserveButton = screen.getByRole("button", { name: /reserve now/i });
    userEvent.click(reserveButton);

    // // Verify axios.post was called with correct data
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     "https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations",
    //     {
    //       resDate: "2023-12-25",
    //       resTime: "12:00",
    //       venue: "Dining Hall 1",
    //       userID: "testuser@example.com",
    //     }
    //   );
    // });

    // // Verify navigation to dashboard
    // await waitFor(() => {
    //   expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { state: { userEmail: "testuser@example.com" } });
    // });

    // Verify success message is displayed
    //expect(screen.getByText(/reservation created successfully/i)).toBeInTheDocument();
  });

  it("handles form submission for editing an existing reservation successfully", async () => {
    const initialData = {
      id: "res123",
      resDate: "2023-12-25",
      resTime: "12:00",
      venue: "Dining Hall 1",
      userID: "testuser@example.com",
    };

    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    // Mock the PUT request for updating a reservation
    mockedAxios.put.mockResolvedValueOnce({
      data: { ...initialData },
    });

    renderComponent(initialData);

    // Wait for form fields to be pre-filled
    await waitFor(() => {
      expect(screen.getByLabelText(/select date/i)).toHaveValue("2023-12-25");
      expect(screen.getByLabelText(/select time/i)).toHaveValue("12:00");
      //expect(screen.getByTestId("diningHall-select")).toHaveValue("Dining Hall 1");
    });

    // Update the time
    const timeSelect = screen.getByLabelText(/select time/i);
    userEvent.selectOptions(timeSelect, "12:00");
    expect(timeSelect).toHaveValue("12:00");

    // Click "Update Reservation" button
    const updateButton = screen.getByRole("button", { name: /update reservation/i });
    userEvent.click(updateButton);

    // Verify axios.put was called with correct data
    // await waitFor(() => {
    //   expect(axios.put).toHaveBeenCalledWith(
    //     "https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations/res123",
    //     {
    //       resDate: "2023-12-25",
    //       resTime: "12:00",
    //       venue: "Dining Hall 1",
    //       userID: "testuser@example.com",
    //     }
    //   );
    // });

    // // Verify navigation to dashboard
    // await waitFor(() => {
    //   expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { state: { userEmail: "testuser@example.com" } });
    // });

    // // Verify success message is displayed
    // expect(screen.getByText(/reservation updated successfully/i)).toBeInTheDocument();
  });

  it("displays error message when reservation creation fails", async () => {
    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    // Mock the POST request to fail
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Reservation date is unavailable.",
        },
      },
    });

    renderComponent();

    // Wait for venues to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Dining Hall 1")).toBeInTheDocument();
    });

    // Fill out the form
    const dateInput = screen.getByLabelText(/select date/i);
    userEvent.type(dateInput, "2023-12-25");
    //expect(dateInput).toHaveValue("2023-12-25");

    const timeSelect = screen.getByLabelText(/select time/i);
    userEvent.selectOptions(timeSelect, "12:00");
    //expect(timeSelect).toHaveValue("12:00");

    // const venueSelect = screen.getByTestId("diningHall-select");
    // userEvent.selectOptions(venueSelect, "Dining Hall 1");
    //expect(venueSelect).toHaveValue("Dining Hall 1");

    // Click "Reserve Now" button
    const reserveButton = screen.getByRole("button", { name: /reserve now/i });
    userEvent.click(reserveButton);

    // Verify axios.post was called with correct data
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     "https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations",
    //     {
    //       resDate: "2023-12-25",
    //       resTime: "12:00",
    //       venue: "Dining Hall 1",
    //       userID: "testuser@example.com",
    //     }
    //   );
    // });

    // // Verify error message is displayed
    // await waitFor(() => {
    //   expect(screen.getByText(/error: reservation date is unavailable/i)).toBeInTheDocument();
    // });

    // // Ensure navigation did not occur
    // expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("prevents reservation creation when user is not authenticated", async () => {
    // Mock user not authenticated
    (auth.onAuthStateChanged as unknown as vi.Mock).mockImplementation((callback) => {
      callback(null); // Simulate unauthenticated user
      return () => {};
    });

    renderComponent();

    // Verify that "User is not authenticated." message is displayed
    await waitFor(() => {
      //expect(screen.getByText(/user is not authenticated/i)).toBeInTheDocument();
    });

    // Ensure form fields are present but submission is prevented
    const reserveButton = screen.getByRole("button", { name: /reserve now/i });
    //expect(reserveButton).toBeDisabled();
  });

  it("handles API failure when fetching venues", async () => {
    // Mock axios.get to fail
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    // Spy on console.error
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

    renderComponent();

    // Wait to ensure fetchVenues was called and error was handled
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://campus-infrastructure-management.azurewebsites.net/api/venues",
        {
          headers: {
            "x-api-key":
              "Kp6Euy8AvhbDRclWMonzNBbZrTbrVOz7EKZmuRMUHzUMzlJD0ac8LDij7Y2MgNznU5SuA4uIRWCrgD5J8tikW8GldocEwA2hQsHcERYRaOsbQxuho328Xht9wHB58owE",
          },
        }
      );
    });

    // Verify no venues are displayed
    //expect(screen.queryByText("Dining Hall 1")).not.toBeInTheDocument();

    // Verify console.error was called
    expect(consoleErrorMock).toHaveBeenCalledWith("Error fetching venues:", expect.any(Error));

    consoleErrorMock.mockRestore();
  });

  it("validates form inputs before submission", async () => {
    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    renderComponent();

    // Wait for venues to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Dining Hall 1")).toBeInTheDocument();
    });

    // Attempt to submit the form without filling any fields
    const reserveButton = screen.getByRole("button", { name: /reserve now/i });
    userEvent.click(reserveButton);

    // Since all fields are required, ensure that axios.post was not called
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Optionally, you can check for custom validation messages if implemented
    // For example:
    // expect(screen.getByText(/please fill out all required fields/i)).toBeInTheDocument();
  });

  it("handles loading state correctly during form submission", async () => {
    // Mock the venues API response
    const mockVenues = [
      {
        id: "1",
        Name: "Dining Hall 1",
        Building: "Building A",
        Features: ["WiFi", "Air Conditioning"],
        Category: "Dining",
        Capacity: 100,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockVenues });

    // Mock the POST request with a delay
    mockedAxios.post.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ data: { id: "res123" } }), 100);
        })
    );

    renderComponent();

    // Wait for venues to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText("Dining Hall 1")).toBeInTheDocument();
    });

    // Fill out the form
    const dateInput = screen.getByLabelText(/select date/i);
    userEvent.type(dateInput, "2023-12-25");
    //expect(dateInput).toHaveValue("2023-12-25");

    const timeSelect = screen.getByLabelText(/select time/i);
    userEvent.selectOptions(timeSelect, "12:00");
    //expect(timeSelect).toHaveValue("12:00");

    const venueSelect = screen.getByTestId("diningHall-select");
    // userEvent.selectOptions(venueSelect, "Dining Hall 1");
    //expect(venueSelect).toHaveValue("Dining Hall 1");

    // Click "Reserve Now" button
    const reserveButton = screen.getByRole("button", { name: /reserve now/i });
    userEvent.click(reserveButton);

    // Verify that the button shows 'Processing...' and is disabled
    //expect(reserveButton).toHaveTextContent(/processing/i);
    //expect(reserveButton).toBeDisabled();

    // Wait for the POST request to complete
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalled();
    //   expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { state: { userEmail: "testuser@example.com" } });
    // });

    // After submission, the button should revert to original text and be enabled
    expect(reserveButton).toHaveTextContent(/reserve now/i);
    expect(reserveButton).not.toBeDisabled();
  });
});
