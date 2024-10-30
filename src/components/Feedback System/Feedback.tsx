import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig"; // Firebase authentication

// StarRating component to handle the rating visually with stars
const StarRating: React.FC<{
  rating: number | null;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
}> = ({ rating, setRating, readOnly = false }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            rating && star <= rating ? "text-yellow-500" : "text-gray-400"
          } ${readOnly ? "" : "hover:text-yellow-400"}`}
          onClick={() => !readOnly && setRating && setRating(star)}
        >
          {star <= (rating || 0) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

const Feedback: React.FC = () => {
  const [review, setReview] = useState(""); // User feedback input
  const [rating, setRating] = useState<number | null>(null); // User rating input
  const [submitted, setSubmitted] = useState(false); // Tracks submission state
  const [error, setError] = useState(""); // Error handling for empty input
  const [reviews, setReviews] = useState<
    Array<{ id: string; review: string; rating: number; timestamp: string }>
  >([]); // Array to store fetched reviews
  const [userEmail, setUserEmail] = useState<string | null>(null); // Store current user's email
  const [userFeedbackExists, setUserFeedbackExists] = useState(false); // Check if user already provided feedback
  const [userReview, setUserReview] = useState<{ review: string; rating: number; timestamp: string } | null>(null); // Store user's feedback if exists

  // Fetch the current authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set the email instead of userId
        checkUserFeedback(user.email!); // Pass the email to checkUserFeedback
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check if the user has already submitted feedback
  const checkUserFeedback = async (email: string) => {
    try {
      const response = await fetch(
        `https://feedback-xu5p2zrq7a-uc.a.run.app/appFeedback?userId=${email}`
      );
      const data = await response.json();

      if (response.status === 200 && Array.isArray(data) && data.length > 0) {
        setUserFeedbackExists(true); // User has already submitted feedback
        setUserReview({
          review: data[0].review,
          rating: data[0].rating,
          timestamp: data[0].timestamp,
        }); // Set the user's review, rating, and timestamp
      }
    } catch (e) {
      console.error("Error checking user feedback: ", e);
    }
  };

  // Fetch reviews from the API
  const fetchReviews = async () => {
    try {
      const response = await fetch("https://feedback-xu5p2zrq7a-uc.a.run.app/appFeedback");
      const data = await response.json();
      if (response.ok) {
        setReviews(data);
      } else {
        console.error("Error fetching reviews: ", data.message);
      }
    } catch (e) {
      console.error("Error fetching reviews: ", e);
    }
  };

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle feedback submission (both review and rating)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (review.trim() === "" || rating === null) {
      setError("Please provide both feedback and a rating before submitting.");
      return;
    }

    try {
      if (!userEmail) {
        setError("You must be logged in to submit feedback.");
        return;
      }

      const feedbackData = {
        review,
        rating,
        userId: userEmail, // Use email as userId
        timestamp: new Date().toISOString(),
      };

      const response = await fetch("https://feedback-xu5p2zrq7a-uc.a.run.app/appFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setReview(""); // Clear the input after submission
        setRating(null); // Clear the rating after submission
        setSubmitted(true); // Set submission state to true
        setError(""); // Clear any error
        fetchReviews(); // Refresh the reviews after submission
        setUserFeedbackExists(true); // Mark that the user has submitted feedback
      } else {
        console.error("Error submitting feedback:", data.message);
        setError("Error submitting feedback. Please try again.");
      }
    } catch (e) {
      console.error("Error adding review: ", e);
      setError("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>

      {userFeedbackExists && userReview ? (
        <div>
          <p className="text-green-600 font-semibold">
            You have already submitted feedback. Thank you!
          </p>
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-bold mb-4">Your Review:</h3>
            <p className="text-gray-800">{userReview.review}</p>
            <StarRating rating={userReview.rating} readOnly={true} />
            <p className="text-gray-600 mt-4">
              Date: {new Date(userReview.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : submitted ? (
        <p className="text-green-600 font-semibold">
          Thank you for your feedback!
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-gray-700 mb-2">
              Your Feedback:
            </label>
            <textarea
              id="feedback"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Let us know your thoughts..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700 mb-2">
              Your Rating:
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default Feedback;