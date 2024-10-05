import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

interface Reservation {
  id: string;
  resDate: string; // ISO string representing date
  resTime: string;
  venue: string;
  userID: string;
}

interface ViewReservationsProps {
  userEmail: string | null;
}

const ViewReservations: React.FC<ViewReservationsProps> = ({ userEmail }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userEmail) return;

      try {
        const response = await fetch(
          `https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations?userID=${userEmail}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reservations.");
        }

        const data = await response.json();

        const today = new Date();
        const upcomingReservations: Reservation[] = data.filter(
          (reservation: Reservation) => new Date(reservation.resDate) >= today
        );

        setReservations(upcomingReservations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userEmail]);

  const handleEdit = (reservation: Reservation) => {
    navigate('/dining-reservations', {
      state: { reservationId: reservation.id, initialData: reservation, userEmail }
    });
  };

  const handleDelete = async (reservationId: string) => {
    try {
      const response = await fetch(
        `https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations/${reservationId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reservation.");
      }

      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      alert('Reservation cancelled successfully.');
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      alert(`Error deleting reservation: ${errorMsg}`);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : reservations.length > 0 ? (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="bg-blue-100 border-l-4 border-blue-500 shadow-md p-4 rounded-lg text-left hover:bg-blue-200 transition-colors"
            >
              <p className="font-semibold">
                Date: {new Date(reservation.resDate).toLocaleDateString()}
              </p>
              <p className="font-semibold">Time: {reservation.resTime}</p>
              <p className="font-semibold">Venue: {reservation.venue}</p>

              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(reservation)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="text-red-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No upcoming reservations found.</p>
      )}
    </div>
  );
};

export default ViewReservations;
