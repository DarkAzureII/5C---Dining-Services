// tests/Dining Reservations/ViewReservations.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { rest } from 'msw';
import { it, expect, describe, beforeAll, afterAll, afterEach, vi } from 'vitest';
import ViewReservation from "../../src/components/Dining Reservations/ViewReservation";

// Mock server setup
const server = setupServer(
  // Successful fetch of reservations
  rest.get("https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations", (req, res, ctx) => {
    const userID = req.url.searchParams.get("userID");
    if (userID) {
      return res(
        ctx.json([
          {
            id: "1",
            resDate: "2023-10-10T00:00:00Z",
            resTime: "12:00",
            venue: "Dining Hall 1",
            userID,
          },
          {
            id: "2",
            resDate: "2023-10-12T00:00:00Z",
            resTime: "13:00",
            venue: "Dining Hall 2",
            userID,
          },
        ])
      );
    }
    return res(ctx.status(404));
  }),

  // Successful delete of a reservation
  rest.delete("https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations/:reservationId", (req, res, ctx) => {
    return res(ctx.status(204)); // No content response on delete
  })
);

// Enable the mock server before all tests
beforeAll(() => server.listen());
// Reset any request handlers that are declared as a part of tests
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished
afterAll(() => server.close());

describe("ViewReservations", () => {
  it("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <ViewReservation userEmail="testuser@example.com" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("fetches and displays reservations", async () => {
    render(
      <MemoryRouter>
        <ViewReservation userEmail="testuser@example.com" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Date: 10\/10\/2023/i)).toBeInTheDocument();
      expect(screen.getByText(/Time: 12:00/i)).toBeInTheDocument();
      expect(screen.getByText(/Venue: Dining Hall 1/i)).toBeInTheDocument();
    });
  });

  it("handles deletion of a reservation", async () => {
    render(
      <MemoryRouter>
        <ViewReservation userEmail="testuser@example.com" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Date: 10\/10\/2023/i)).toBeInTheDocument();
    });

    // Click on the Cancel button
    fireEvent.click(screen.getByText(/Cancel/i));

    // Verify the reservation has been removed
    await waitFor(() => {
      expect(screen.queryByText(/Date: 10\/10\/2023/i)).not.toBeInTheDocument();
      expect(screen.getByText(/No upcoming reservations found./i)).toBeInTheDocument();
    });
  });

  it("shows an error message on fetch failure", async () => {
    server.use(
      rest.get("https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <MemoryRouter>
        <ViewReservation userEmail="testuser@example.com" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error fetching reservations: /i)).toBeInTheDocument();
    });
  });
});
