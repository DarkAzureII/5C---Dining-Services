// ReservationHistory.js
import React from 'react';

const ReservationHistory = () => {
  // Sample data or API call can be added here
  const reservationData = [
    { id: 1, date: '2024-09-01', reservation: 'Dinner at Wits' },
    { id: 2, date: '2024-08-25', reservation: 'Lunch at Main Hall' },
  ];

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Reservation History</h1>
      <ul className="list-disc pl-5">
        {reservationData.map((reservation) => (
          <li key={reservation.id} className="mb-2">
            {reservation.date} - {reservation.reservation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationHistory;