import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { auth } from '../../firebaseConfig'; // Ensure Firebase Auth is properly imported

interface Reservation {
  id: string;
  resDate: string;
  resTime: string;
  userId: string; // Using email
  venue: string;
  review?: string;
  rating?: number;
  mealOption?: string;
  mealDetails?: string;
  reviewId?: string;
}

const ReservationHistory: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store user email
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [mealOption, setMealOption] = useState('');
  const [mealDetails, setMealDetails] = useState('');
  const maxReviewLength = 1000;

  // API URL
  const apiUrl = 'https://feedback-xu5p2zrq7a-uc.a.run.app';

  // Fetch the current authenticated user's email
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Use the user's email as the identifier
      } else {
        setUserEmail(null); // No user logged in
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch reservations and their reviews
  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch Reservations
        const reservationsResponse = await fetch(`${apiUrl}/userReservations?userID=${encodeURIComponent(userEmail)}`);
        if (!reservationsResponse.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await reservationsResponse.json();
        const reservationsData = Array.isArray(data) ? data : [];

        // Sort reservations by date and time in descending order
        const sortedReservations = reservationsData.sort((a: Reservation, b: Reservation) => {
          const dateA = new Date(`${a.resDate}T${a.resTime}:00`).getTime();
          const dateB = new Date(`${b.resDate}T${b.resTime}:00`).getTime();
          return dateB - dateA; // Descending order
        });

        // Fetch Reviews for All Reservations in Parallel
        const reviewsPromises = sortedReservations.map(async (reservation) => {
          const reviewResponse = await fetch(`${apiUrl}/reservationReviews/${encodeURIComponent(reservation.id)}`);
          if (!reviewResponse.ok) {
            console.error(`Failed to fetch review for reservation ID: ${reservation.id}`);
            return { reservationId: reservation.id, reviewData: null };
          }
          const reviewData = await reviewResponse.json();
          return { reservationId: reservation.id, reviewData };
        });

        const reviewsResults = await Promise.all(reviewsPromises);

        // Map reviews to reservations
        const reservationsWithReviews = sortedReservations.map((reservation) => {
          const reviewResult = reviewsResults.find((r) => r.reservationId === reservation.id);
          if (reviewResult && Array.isArray(reviewResult.reviewData) && reviewResult.reviewData.length > 0) {
            // Assuming only one review per reservation per user
            const userReview = reviewResult.reviewData.find((r: any) => r.userID === userEmail);
            if (userReview) {
              return {
                ...reservation,
                review: userReview.review,
                rating: userReview.rating,
                mealOption: userReview.mealOption,
                mealDetails: userReview.mealDetails,
                reviewId: userReview.id,
              };
            }
          }
          return reservation;
        });

        setReservations(reservationsWithReviews);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

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
      resetForm();
    } else {
      setExpandedReservation(reservationId); // Open the review form for the selected reservation
      resetForm();
    }
  };

  const resetForm = () => {
    setReview(''); // Reset review text
    setMealOption(''); // Reset meal option
    setMealDetails(''); // Reset meal details
    setRating(null); // Reset rating
  };

  const handleSubmitReview = async (reservationId: string) => {
    if (!userEmail) {
      alert('User not authenticated.');
      return;
    }

    if (review.trim() === '' || rating == null || mealOption === '' || mealDetails.trim() === '') {
      alert('Review, rating, meal option, and meal details cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reservationReviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId,
          userID: userEmail, // Use email as the user identifier
          review,
          rating,
          mealOption,
          mealDetails,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const data = await response.json();

      // Update the reservation with the new review
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.id === reservationId
            ? {
                ...res,
                review: review,
                rating: rating,
                mealOption: mealOption,
                mealDetails: mealDetails,
                reviewId: data.review.id,
              }
            : res
        )
      );

      resetForm(); // Reset after submission
      setExpandedReservation(null); // Close the review form after submission
      alert('Review submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit the review.');
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
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-xl ${star <= currentRating ? 'text-yellow-500' : 'text-gray-400'}`}
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
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${star <= submittedRating ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            {star <= submittedRating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 mt-4 h-full">
        <p className="text-center">Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mt-4 h-full">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 h-full">
      <div className="py-1 px-3 mb-4 text-center rounded bg-[#0c0d43] text-white">
        <h2 className="text-xl font-bold">Reservation History</h2>
      </div>

      {/* Responsive table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 w-1/5">Date</th>
              <th className="border px-2 py-1 w-1/6">Time</th>
              <th className="border px-2 py-1 w-1/3">Venue</th>
              <th className="border px-2 py-1 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-2">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <tr className="hover:bg-gray-100">
                    <td className="border px-1 py-1 break-words">
                      {format(new Date(reservation.resDate), 'MMM d, yyyy')}
                    </td>
                    <td className="border px-1 py-1 text-center">
                      {reservation.resTime}
                    </td>
                    <td className="border px-1 py-1 break-words">
                      {reservation.mealOption
                        ? `${reservation.mealOption} at ${reservation.venue}`
                        : reservation.venue}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {reservation.review ? (
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-xs"
                          onClick={() => toggleReviewForm(reservation.id)}
                        >
                          {expandedReservation === reservation.id ? 'Close' : 'View'}
                        </button>
                      ) : (
                        canReviewReservation(reservation.resDate, reservation.resTime) ? (
                          <button
                            className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition text-xs"
                            onClick={() => toggleReviewForm(reservation.id)}
                          >
                            {expandedReservation === reservation.id ? 'Close' : 'Review'}
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">Not Available</span>
                        )
                      )}
                    </td>
                  </tr>

                  {expandedReservation === reservation.id && (
                    reservation.review ? (
                      <tr>
                        <td colSpan={4} className="border px-2 py-1 bg-gray-100">
                          <div className="space-y-1">
                            <div>
                              <strong>Your Review:</strong>
                              <p className="mt-0.5 break-words">{reservation.review}</p>
                            </div>
                            <div>
                              <strong>Meal Option:</strong>
                              <p className="mt-0.5 break-words">{reservation.mealOption}</p>
                            </div>
                            <div>
                              <strong>Meal Details:</strong>
                              <p className="mt-0.5 break-words">{reservation.mealDetails}</p>
                            </div>
                            <div>
                              <strong>Your Rating:</strong>
                              <div>{displaySubmittedRatingStars(reservation.rating || 0)}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4} className="border px-2 py-1 bg-gray-100">
                          <div className="flex flex-col space-y-2">
                            {/* Review Textarea */}
                            <div className="w-full">
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Write your review here..."
                                value={review}
                                onChange={handleReviewChange}
                                rows={2}
                                maxLength={maxReviewLength}
                              />
                            </div>

                            {/* Meal Option Select */}
                            <div className="w-full">
                              <label className="block text-xs font-semibold mb-1">Meal Option:</label>
                              <select
                                value={mealOption}
                                onChange={handleMealOptionChange}
                                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                              >
                                <option value="">Select a meal option</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                              </select>
                            </div>

                            {/* Meal Details */}
                            <div className="w-full">
                              <label className="block text-xs font-semibold mb-1">Elaborate on your meal:</label>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-xs"
                                placeholder="Describe what you had (e.g., main dish, sides, drinks)..."
                                value={mealDetails}
                                onChange={handleMealDetailsChange}
                                rows={2}
                              />
                            </div>

                            {/* Rating */}
                            <div className="w-full">
                              <label className="block text-xs font-semibold mb-1">Rating:</label>
                              {renderStars(rating || 0)}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-right">
                              <button
                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition text-xs"
                                onClick={() => handleSubmitReview(reservation.id)}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationHistory;