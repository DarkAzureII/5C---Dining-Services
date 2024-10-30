// tests/Dining Reservations/ViewReservations.test.tsx

/// <reference types="vitest/globals" />

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ViewReservations from "../../src/components/Dining Reservations/ViewReservation"; // Adjust the import path as needed
import { auth } from "../../src/firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();

const API_BASE_URL = "https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations";

// Partially mock react-router-dom to preserve MemoryRouter and other components
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock only useNavigate
  };
});

// Mock axios globally
vi.mock("axios");
const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

// Mock firebaseConfig to ensure auth functions are mocked
vi.mock("../../src/firebaseConfig", () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
    currentUser: null, // Default to null; will override in tests
  },
  db: {}, // Mock db if necessary
}));

describe("ViewReservations Component", () => {
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
    mockedAxios.delete.mockReset();
  });

  afterEach(() => {
    // Clear navigate mock after each test
    mockNavigate.mockClear();
  });

  // Helper function to render the component within MemoryRouter
  const renderComponent = () => {
    const MockedRoutes = () => (
      <MemoryRouter initialEntries={["/view-reservations"]}>
        <Routes>
          <Route path="/view-reservations" element={<ViewReservations />} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    return render(<MockedRoutes />);
  };

  it("renders correctly when no upcoming reservations are found", async () => {
    // Mock the GET request with empty data
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    renderComponent();

    // Wait for reservations to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    // Check that loading message is not present
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });

});
