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
  const [userReview, setUserReview] = useState<{
    id: string;
    review: string;
    rating: number;
    timestamp: string;
  } | null>(null); // Store user's feedback if exists
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode

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
        `https://feedback-xu5p2zrq7a-uc.a.run.app/appFeedback?userId=${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (response.status === 200 && Array.isArray(data) && data.length > 0) {
        setUserFeedbackExists(true); // User has already submitted feedback
        setUserReview({
          id: data[0].id, // Assuming each feedback has a unique 'id'
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

      let response;
      let data;

      if (isEditing && userReview) {
        // Update existing feedback
        response = await fetch(`https://feedback-xu5p2zrq7a-uc.a.run.app/appFeedback/${userReview.id}`, {
          method: "PUT", // or "PATCH" depending on your API
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        });
      } else {
        // Submit new feedback
        response = await fetch("https://feedback-xu5p2zrq7a-uc.a.run.app/appFeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        });
      }

      data = await response.json();

      if (response.status === 201 || response.status === 200) {
        setReview(""); // Clear the input after submission
        setRating(null); // Clear the rating after submission
        setSubmitted(true); // Set submission state to true
        setError(""); // Clear any error
        fetchReviews(); // Refresh the reviews after submission

        if (isEditing) {
          setUserReview({
            id: userReview!.id, // Retain the same ID
            review: feedbackData.review,
            rating: feedbackData.rating,
            timestamp: feedbackData.timestamp,
          });
          setIsEditing(false); // Exit edit mode
        } else {
          setUserFeedbackExists(true); // Mark that the user has submitted feedback
        }
      } else {
        console.error("Error submitting feedback:", data.message);
        setError("Error submitting feedback. Please try again.");
      }
    } catch (e) {
      console.error("Error submitting feedback: ", e);
      setError("Error submitting feedback. Please try again.");
    }
  };

  // Handle Edit button click
  const handleEdit = () => {
    if (userReview) {
      setReview(userReview.review);
      setRating(userReview.rating);
      setIsEditing(true);
      setSubmitted(false);
      setError("");
    }
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setReview("");
    setRating(null);
    setError("");
  };

  return (
    <div className="p-3 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>

      {userFeedbackExists && userReview && !isEditing ? (
        <div>
          <p className="text-green-600 font-semibold">
            You have already submitted feedback. Thank you!
          </p>
          <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-bold mb-2">Your Review:</h2>
            <p className="text-gray-800">{userReview.review}</p>
            <StarRating rating={userReview.rating} readOnly={true} />
            <p className="text-gray-600 mt-2">
              Date: {new Date(userReview.timestamp).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white ml-6 px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Edit Feedback
          </button>
        </div>
      ) : submitted && !isEditing ? (
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

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {isEditing ? "Update" : "Submit Feedback"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Feedback;

