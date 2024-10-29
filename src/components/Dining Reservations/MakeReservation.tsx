import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from "../../firebaseConfig"; 

interface Reservation {
  id: string;
  resDate: string; // ISO string representing date
  resTime: string;
  venue: string;
  userID: string;
}

const MakeReservation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {initialData} = location.state || {}; // Retrieve data from navigation state

  // Initial state based on whether it's an edit or a new reservation
  const [reservationId, setReservationId] = useState(initialData?.id || '');
  const [date, setDate] = useState(initialData?.resDate || '');
  const [time, setTime] = useState(initialData?.resTime || '');
  const [diningHall, setDiningHall] = useState(initialData?.venue || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

 
  // Title and button text change dynamically based on the mode
  const formTitle = reservationId ? 'Edit Reservation' : 'Make a New Reservation';
  const buttonText = reservationId ? 'Update Reservation' : 'Reserve Now';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    // Create the reservation data object dynamically using the userEmail from props or context
    const reservationData = {
      resDate: date,
      resTime: time,
      venue: diningHall,
      userID: userId, // Dynamically passed in from location state
    };

    try {
      const url = reservationId
        ? `https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations/${reservationId}`
        : 'https://appreservations-appreservations-xu5p2zrq7a-uc.a.run.app/Reservations';

        if (reservationId) {
          await axios.put(url, reservationData);
          setMessage('Reservation updated successfully!');
        } else {
          await axios.post(url, reservationData);
          setMessage('Reservation created successfully!');
        }
    
        navigate('/dashboard', { state: { userEmail: userId } }); // Navigate back to the reservations list
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error.message || "An error occurred. Please try again.";
        setMessage(`Error: ${errorMsg}`);
      }

    setLoading(false);
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

        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default MakeReservation;
