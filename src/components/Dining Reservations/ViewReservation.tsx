import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from "../../firebaseConfig"; 

interface Reservation {
  id: string;
  resDate: string; // ISO string representing date
  resTime: string;
  venue: string;
  userID: string;
}

const API_BASE_URL = 'https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations';



const ViewReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const navigate = useNavigate();

   // Fetch the current user's email from Firebase Auth
   const [userId, setUserId] = useState<string | null>(null);

 
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUserId(user.email);
        } else {
          setUserId(null); // User is not logged in
        }
      });
      return () => unsubscribe(); // Clean up the subscription
    }, []);

    // Fetch preferences from the API when the user is authenticated
    const fetchReservations = async () => {
      if (!userId) return; // Exit if no user ID
  
      try {
        const response = await axios.get(API_BASE_URL, { params: { userID: userId } });
        const reservationData = response.data as Reservation[];
        const today = new Date();
        const upcomingReservations: Reservation[] = reservationData.filter(
          (reservation: Reservation) => new Date(reservation.resDate) >= today
        );

        setReservations(upcomingReservations);
        setLoading(false)

      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
  
    useEffect(() => {
      if (userId) {
        fetchReservations(); // Fetch reservations when user is available
      }
    }, [userId]);



      // Function to handle success or error message display
      const displayMessage = (msg: string, type: "success" | "error") => {
      setMessage(msg);
      setMessageType(type);
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000); // Clear message after 3 seconds
  };



  const handleEdit = (reservation: Reservation) => {

    if (!userId) {
      displayMessage("User is not authenticated.", "error");
      return;
    }

    alert(reservation.id);

    navigate('/dining-reservations', {
      state: {initialData: reservation }
    });

  };

  const handleDelete = async (reservationId: string) => {

    displayMessage("hello", "success");

    try {

      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));

      await axios.delete(`${API_BASE_URL}/${reservationId}`);

      displayMessage('Reservation cancelled successfully.', "success");

    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      alert(`Error deleting reservation: ${errorMsg}`);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
    {message && (
      <div className={`p-4 mb-4 text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded`}>
        {message}
      </div>
    )}

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
    </div>
  );
};

export default ViewReservations;
