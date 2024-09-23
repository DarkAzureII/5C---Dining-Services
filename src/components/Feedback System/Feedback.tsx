import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Make sure the path is correct

const Feedback: React.FC = () => {
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<
    Array<{ id: string; review: string; timestamp: Date }>
  >([]);

  // Function to fetch reviews from Firestore
  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        review: doc.data().review,
        timestamp: doc.data().timestamp.toDate(),
      }));
      setReviews(fetchedReviews);
    } catch (e) {
      console.error("Error fetching reviews: ", e);
    }
  };

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (review.trim() === "") {
      setError("Please enter your feedback before submitting.");
      return;
    }

    try {
      // Add review to Firestore
      await addDoc(collection(db, "reviews"), {
        review: review,
        timestamp: new Date(),
      });

      setReview(""); // Clear the input
      setSubmitted(true);
      setError(""); // Clear any error

      // Re-fetch reviews after submitting a new one
      fetchReviews();
    } catch (e) {
      console.error("Error adding review: ", e);
      setError("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>

      {submitted ? (
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

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">User Reviews</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li
                key={review.id}
                className="mb-4 p-4 bg-white shadow rounded-lg"
              >
                <p className="text-gray-800">{review.review}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
