import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Firebase Auth import

interface Reservation {
  id?: string;
  resDate: string; // ISO string representing date
  resTime: string;
  venue: string;
  userID: string;
}

const MakeReservation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId: initialReservationId, initialData } = location.state || {}; // Retrieve data from navigation state

  const [date, setDate] = useState(initialData?.resDate || '');
  const [time, setTime] = useState(initialData?.resTime || '');
  const [diningHall, setDiningHall] = useState(initialData?.venue || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store userEmail
  const [reservationId, setReservationId] = useState<string | null>(initialReservationId || null); // Store reservationId

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set the email instead of userId
      } else {
        setUserEmail(null); // Clear the userEmail if no user is authenticated
        navigate('/login'); // Redirect to login page if the user is not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const formTitle = reservationId ? 'Edit Reservation' : 'Make a New Reservation';
  const buttonText = reservationId ? 'Update Reservation' : 'Reserve Now';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!userEmail) {
      setMessage('Error: User is not authenticated');
      setLoading(false);
      return;
    }
  
    const reservationData: Omit<Reservation, 'id'> = {
      resDate: date,
      resTime: time,
      venue: diningHall,
      userID: userEmail, // Get the userEmail from Firebase Auth
    };
  
    try {
      let url = 'https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations';
      let method = 'POST';
  
      if (reservationId) {
        // If editing, update the existing reservation with the reservationId
        url = `https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations/${reservationId}`;
        method = 'PUT';
      }
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });
  
      const contentType = response.headers.get('content-type');
  
      if (!response.ok) {
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json(); // Parse JSON error response
        } else {
          errorData = await response.text(); // Handle non-JSON error response
        }
        setMessage(`Error: ${errorData}`);
        setLoading(false);
        return;
      }
  
      // If the response is OK, handle the success case
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json(); // Parse JSON success response
      } else {
        responseData = await response.text(); // Handle non-JSON success response
      }
  
      const newReservationId = responseData.id || reservationId; // Get the new reservationId from the response
      
      if (!reservationId) {
        setReservationId(newReservationId); // Update the form with the new ID for future edits
      }
  
      setMessage(reservationId ? 'Reservation updated successfully!' : 'Reservation created successfully!');
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      setMessage(`Error: ${errorMsg}`);
    }
  
    setLoading(false);
  };
  
  
  const handleDelete = async () => {
    if (!reservationId) return; // No reservation to delete
    try {
      const response = await fetch(
        `https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations/${reservationId}`,
        {
          method: 'DELETE',
        }
      );
  
      if (response.ok) {
        setMessage('Reservation deleted successfully.');
        setReservationId(null); // Clear the reservationId after deletion
        navigate('/dashboard'); // Redirect to the dashboard after deletion
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      setMessage(`Error: ${errorMsg}`);
    }
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">{formTitle}</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="date" className="font-semibold">Select Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
            <p className="text-red-500 text-sm mt-1">
             Please note: Reservations must be made at least one day in advance.
  </p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="time" className="font-semibold">Select Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="diningHall" className="font-semibold">Select Dining Hall:</label>
          <select
            id="diningHall"
            value={diningHall}
            onChange={(e) => setDiningHall(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Choose a dining hall</option>
            <option value="Dining Hall 1">Dining Hall 1</option>
            <option value="Dining Hall 2">Dining Hall 2</option>
            <option value="Dining Hall 3">Dining Hall 3</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4" disabled={loading}>
          {loading ? 'Processing...' : buttonText}
        </button>

        {reservationId && (
          <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4" onClick={handleDelete}>
            Delete Reservation
          </button>
        )}

        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default MakeReservation;