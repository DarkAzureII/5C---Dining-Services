import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebaseConfig"; // Ensure Firebase Auth and Firestore are correctly initialized
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

const Reservations = ({ reservationAction }: { reservationAction: string }) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check Firebase Auth state and set userEmail
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Use user email instead of UID
      } else {
        setUserEmail(null); // Handle the case where the user is not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userEmail) return; // Skip if no userEmail

      try {
        const q = query(collection(db, 'diningReservations'), where('userID', '==', userEmail)); // Query by email (userID)
        const querySnapshot = await getDocs(q);

        const fetchedReservations: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedReservations.push({ id: doc.id, ...doc.data() });
        });

        setReservations(fetchedReservations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservations: ', error);
        setLoading(false);
      }
    };

    if (reservationAction === 'view' && userEmail) {
      fetchReservations();
    }
  }, [reservationAction, userEmail]);

  return (
    <div className="reservations">
      {/* Conditional Rendering for Each Action */}
      {reservationAction === 'view' && (
        <div>
          {loading ? (
            <p>Loading reservations...</p>
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
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No reservations found.</p>
          )}
        </div>
      )}

      {reservationAction === 'make' && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Make a New Reservation</h3>
          <form className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="date" className="font-semibold">
                Select Date:
              </label>
              <input
                type="date"
                id="date"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="time" className="font-semibold">
                Select Time:
              </label>
              <input
                type="time"
                id="time"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="diningHall" className="font-semibold">
                Select Dining Hall:
              </label>
              <select
                id="diningHall"
                className="border border-gray-300 rounded-lg p-2"
              >
                <option value="hall1">Dining Hall 1</option>
                <option value="hall2">Dining Hall 2</option>
                <option value="hall3">Dining Hall 3</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Reserve Now
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reservations;