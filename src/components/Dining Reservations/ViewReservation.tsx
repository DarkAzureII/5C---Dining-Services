import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

interface ViewReservationsProps {
  userEmail: string | null;
}

const ViewReservations: React.FC<ViewReservationsProps> = ({ userEmail }) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userEmail) return;

      try {
        const q = query(
          collection(db, "diningReservations"),
          where("userID", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);

        const fetchedReservations: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedReservations.push({ id: doc.id, ...doc.data() });
        });

        setReservations(fetchedReservations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userEmail]);

  return (
    <div>
      {reservations.length > 0 ? (
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
  );
};

export default ViewReservations;
