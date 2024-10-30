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

interface Venue {
  id: string;
  Name: string;
  Building: string;
  Features: string[];
  Category: string;
  Capacity: number;
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

// Integrated API 

  const [venues, setVenues] = useState<string[]>([]); // Stores only names of venues with "Dining" category

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('https://campus-infrastructure-management.azurewebsites.net/api/venues', {
          headers: {
            'x-api-key': 'Kp6Euy8AvhbDRclWMonzNBbZrTbrVOz7EKZmuRMUHzUMzlJD0ac8LDij7Y2MgNznU5SuA4uIRWCrgD5J8tikW8GldocEwA2hQsHcERYRaOsbQxuho328Xht9wHB58owE',
          },
        });

        // Filter venues by category "Dining" and extract names
        const diningVenues = response.data
          .filter((venue: Venue) => venue.Category === 'Dining')
          .map((venue: Venue) => venue.Name);

        setVenues(diningVenues); // Update state with names of dining venues
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

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
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Choose a time</option>
            {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"].map((timeOption) => (
              <option key={timeOption} value={timeOption}>
                {timeOption}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="diningHall" className="font-semibold">Select Venue:</label>
          <select
        id="diningHall"
        value={diningHall}
        onChange={(e) => setDiningHall(e.target.value)}
        className="border border-gray-300 rounded-lg p-2"
        required
      >
        <option value="">Choose a venue</option>
        {venues.map((venueName) => (
          <option key={venueName} value={venueName}>
            {venueName}
          </option>
        ))}
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
