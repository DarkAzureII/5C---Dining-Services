import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { format } from 'date-fns';

interface Reservation {
  id: string; 
  resDate: string;
  resTime: string;
  userID: string;
  venue: string;
}

const ReservationHistory: React.FC = () => {
  const [review, setReview] = useState('');
  const maxReviewLength = 1000;
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [submittedReviews, setSubmittedReviews] = useState<{ [key: string]: string }>({});
  const [rating, setRating] = useState<number | null>(null);
  const [submittedRatings, setSubmittedRatings] = useState<{ [key: string]: number }>({});
  const [mealOption, setMealOption] = useState('');
  const [mealDetails, setMealDetails] = useState('');
  const [submittedMealOptions, setSubmittedMealOptions] = useState<{ [key: string]: string }>({});
  const [submittedMealDetails, setSubmittedMealDetails] = useState<{ [key: string]: string }>({});

  // Fetch reservations from Firestore when the component mounts
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsCollection = collection(db, 'diningReservations');
        const reservationSnapshot = await getDocs(reservationsCollection);
        const reservationList = reservationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reservation[];
        setReservations(reservationList);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations(); // Call the function to fetch reservations
  }, []);

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleMealOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMealOption(event.target.value); // Set the selected meal option
  };

  const handleMealDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMealDetails(event.target.value); // Set the detailed description of the meal
  };

  const toggleReviewForm = (reservationId: string) => {
    if (expandedReservation === reservationId) {
      setExpandedReservation(null); // Close the review form if it's already open
      setReview(''); // Reset review text
      setMealOption(''); // Reset meal option
      setMealDetails(''); // Reset meal details
      setRating(null); // Reset rating
    } else {
      setExpandedReservation(reservationId); // Open the review form for the selected reservation
      setReview(''); // Reset review text
      setMealOption(''); // Reset meal option
      setMealDetails(''); // Reset meal details
      setRating(null); // Reset rating
    }
  };

  const handleSubmitReview = async (reservationId: string) => {
    if (review.trim() === "" || rating == null || mealOption ==="") {
      alert("Review, rating and meal option cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, 'reservationReviews'), {
        reservationId,
        review,
        rating,
        mealOption,
        mealDetails,
        date: new Date(),
      });

      setSubmittedReviews((prevReviews) => ({
        ...prevReviews,
        [reservationId]: review,
      }));

      setSubmittedMealOptions((prevMealOptions) => ({
        ...prevMealOptions,
        [reservationId]: mealOption,
      }));

      setSubmittedMealDetails((prevMealDetails) => ({
        ...prevMealDetails,
        [reservationId]: mealDetails,
      }));

      setSubmittedRatings((prevRatings) => ({
        ...prevRatings,
        [reservationId]: rating,
      }));

      setReview(''); // Reset after submission
      setMealOption(''); // Reset meal option after submission
      setMealDetails(''); // Reset meal details after submission
      setRating(null); // Reset after submission
      setExpandedReservation(null); // Close the review form after submission
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review: ", error);
      alert("Failed to submit the review.");
    }
  };

  const canReviewReservation = (resDate: string, resTime: string): boolean => {
    const reservationDateTime = new Date(`${resDate}T${resTime}:00`);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - reservationDateTime.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
    return hoursDifference >= 1; // Return true if more than 1 hour has passed
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, 'MMMM d, yyyy'); // Format as 'October 14, 2024'
  };

  const renderStars = (currentRating: number) => {
    return (
      <div className="flex justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${star <= currentRating ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => setRating(star)} // Set the clicked star's rating
          >
            {star <= currentRating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const displaySubmittedRatingStars = (submittedRating: number) => {
    return (
      <div className="flex justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl ${star <= submittedRating ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            {star <= submittedRating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 h-full">
      <div className="py-2 px-4 mb-4 text-center rounded" style={{ backgroundColor: '#0c0d43', color: 'white' }}>
        <h2 className="text-2xl font-bold">Reservation History</h2>
      </div>

      {/* Scrollable reservation list */}
      <div className="overflow-y-auto max-h-[500px]"> 
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Venue</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <React.Fragment key={reservation.id}>
                <tr>
                  <td className="border px-4 py-2">{formatDate(reservation.resDate)}</td>
                  <td className="border px-4 py-2">{reservation.resTime}</td>
                  <td className="border px-4 py-2">
                    {submittedMealOptions[reservation.id] 
                      ? `${submittedMealOptions[reservation.id]} at ${reservation.venue}`
                      : reservation.venue}
                  </td>
                  <td className="border px-4 py-2">
                    {submittedReviews[reservation.id] ? (
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => toggleReviewForm(reservation.id)}
                      >
                        {expandedReservation === reservation.id ? 'Close Review' : 'See Review'}
                      </button>
                    ) : (
                      canReviewReservation(reservation.resDate, reservation.resTime) ? (
                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                          onClick={() => toggleReviewForm(reservation.id)}
                        >
                          {expandedReservation === reservation.id ? 'Close Review' : 'Review'}
                        </button>
                      ) : (
                        <span className="text-gray-500">Review not available</span>
                      )
                    )}
                  </td>
                </tr>

                {expandedReservation === reservation.id && (
                  submittedReviews[reservation.id] ? (
                    <tr>
                      <td colSpan={4} className="border px-4 py-2 bg-gray-100">
                        <strong>Your Review:</strong>
                        <p className="mt-2">{submittedReviews[reservation.id]}</p>
                        <strong>Your Meal Option: </strong>
                        <p className="mt-2">{submittedMealOptions[reservation.id]}</p>
                        <strong>Meal Details: </strong>
                        <p className="mt-2">{submittedMealDetails[reservation.id]}</p>
                        <strong>Your Rating: </strong>
                        <div>{displaySubmittedRatingStars(submittedRatings[reservation.id] || 0)}</div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="border px-4 py-2 bg-gray-100">
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Write your review here..."
                          value={review}
                          onChange={handleReviewChange}
                          rows={4}
                          maxLength={maxReviewLength}
                        />
                        <div className="my-2">
                          <strong>Meal Option:</strong>
                          <select
                            value={mealOption}
                            onChange={handleMealOptionChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select a meal option</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                          </select>
                        </div>
                        <div className="my-2">
                          <strong>Elaborate on your meal:</strong>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe what you had (e.g., main dish, sides, drinks)..."
                            value={mealDetails}
                            onChange={handleMealDetailsChange}
                            rows={3}
                          />
                        </div>
                        <div className="my-2">
                          <strong>Rating:</strong>
                          {renderStars(rating || 0)}
                        </div>
                        <div className="text-right mt-2">
                          <button
                            className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition"
                            onClick={() => handleSubmitReview(reservation.id)}
                          >
                            Submit Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationHistory;