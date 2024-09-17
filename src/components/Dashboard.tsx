import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore'; 
import { db } from '../firebaseConfig';
import { query, where } from 'firebase/firestore'; 

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DiningServices');
  const [searchTerm, setSearchTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [feedbackSidebarVisible, setFeedbackSidebarVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [review, setReview] = useState('');
  const maxReviewLength = 1000;
  const [showReservationHistory, setShowReservationHistory] = useState(false);
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<{ reservationName: string, reviewText: string }[]>([]);
  const [submittedReviews, setSubmittedReviews] = useState<{ [key: string]: string }>({}); 
  const [appFeedback, setAppFeedback] = useState('');
  const [appRated, setAppRated] = useState(false);
  const [rating, setRating] = useState<number | null>(null); // For the current rating
  const [submittedRatings, setSubmittedRatings] = useState<{ [key: string]: number }>({});
  const [appRating, setAppRating] = useState<number | null>(null);

  const mockReservations = [
    { id: 1, date: '2024-09-01', time: '14:00', reservationName: 'Dinner at Wits' },
    { id: 2, date: '2024-08-25', time: '17:00', reservationName: 'Lunch at Main Hall' },
    { id: 3, date: '2024-09-15', time: '12:30', reservationName: 'Breakfast at Central' },
    { id: 4, date: '2024-08-20', time: '18:45', reservationName: 'Dinner at South Campus' }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
  
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);


  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appFeedback'));
        const feedbackList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("Feedback fetched: ", feedbackList);
        // You can now use the fetched feedback in your component state
      } catch (error) {
        console.error("Error fetching feedback: ", error);
      }
    };
  
    fetchFeedback(); // Call the function to fetch feedback
  }, []);
  
  

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible); // Toggle feedback sidebar
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);

    if (menuVisible) {
      // Close the reservation history if the menu is being closed
      setShowReservationHistory(false);
    }
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleAppFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAppFeedback(event.target.value);
  };

  const handleAppRatingChange = (rating: number) => {
    setAppRating(rating);
  };

  const toggleReservationHistory = () => {
    setShowReservationHistory(!showReservationHistory);
  };


  const toggleReviewForm = (reservationName: string) => {
    setExpandedReservation(expandedReservation === reservationName ? null : reservationName); // Toggle review form
  };

  const checkIfReviewExists = async (reservationName: string, userEmail: string | null) => {
    if (!userEmail) return false;
  
    const q = query(
      collection(db, 'reservationReviews'),
      where('reservationName', '==', reservationName),
      where('userId', '==', userEmail)
    );
  
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // If there's at least one document, the review exists
  };

  const handleSubmitReview = async (reservationName: string) => {
  const reviewExists = await checkIfReviewExists(reservationName, userEmail);

  if (review.trim() === "" || rating == null) {
    alert("Review  and rating cannot be empty.");
    return;
  }

  const user = auth.currentUser;

  try {
    // Add the review and rating to Firestore
    await addDoc(collection(db, 'reservationReviews'), {
      reservationName: reservationName,
      review: review,
      rating: rating,
      userId: user?.email,
      date: new Date()
    });

    setSubmittedReviews((prevReviews) => ({
      ...prevReviews,
      [reservationName]: review,
    }));

    setSubmittedRatings((prevRatings) => ({
      ...prevRatings,
      [reservationName]: rating,
    })); 

    setReview(''); // Clear review after submission
    setRating(null); // Clear rating after submission
    setExpandedReservation(null); // Close the form after submission

    alert("Review submitted successfully!");
  } catch (error) {
    console.error("Error submitting review: ", error);
    alert("Failed to submit the review.");
  }
};

  
  const handleSubmitAppFeedback = async () => {
    if (appFeedback.trim() === "") {
      alert("Feedback cannot be empty.");
      return;
    }
  
    try {
      // Add feedback and rating to Firestore
      await addDoc(collection(db, 'appReviews'), {
        review: appFeedback,
        rating: appRating,
        user_id: userEmail || 'Guest',
        date: new Date()
      });
  
      setAppRated(true); // Mark app as rated
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      alert("Failed to submit feedback.");
    }
  };


  useEffect(() => {
    const fetchUserReviews = async (userEmail: string | null) => {
      if (!userEmail) return;

      try {
        const q = query(
          collection(db, 'reservationReviews'),
          where('userId', '==', userEmail)
        );
        const querySnapshot = await getDocs(q);

        const reviews = querySnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.reservationName] = data.review;
          return acc;
        }, {} as { [key: string]: string });

        const ratings = querySnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.reservationName] = data.rating;
          return acc;
        }, {} as { [key: string]: number });

        setSubmittedReviews(reviews); // Store the reviews in state
        setSubmittedRatings(ratings); // Store the ratings in state
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    if (userEmail) {
      fetchUserReviews(userEmail);
    }
  }, [userEmail]);

  // On Auth state change, set the user email
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Render logic for reservations
  const renderReservationButtons = (reservation: any) => {
    const userHasReviewed = !!submittedReviews[reservation.reservationName];

    return (
      <td className="border px-4 py-2">
        {userHasReviewed ? (
          <button className="bg-gray-500 text-white py-1 px-2 rounded cursor-default">
            Reviewed
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-600"
            onClick={() => toggleReviewForm(reservation.reservationName)}
          >
            {expandedReservation === reservation.reservationName ? 'Close' : 'Review'}
          </button>
        )}
      </td>
    );
  };

  
  

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <img
        src="wits-white.jpg"
        alt="backgroundImage"
        className="fixed inset-0 w-full h-full object-cover z-0"
      /> 

      {/* Navigation Bar */}
      <div className="flex items-center px-5 py-2 bg-transparent fixed top-0 w-full z-10 shadow-md">
        <button className="text-3xl bg-none border-none cursor-pointer mr-5"
          onClick={toggleMenu}>
          &#9776;
        </button>
        <img
          src="/wits-logo.png"
          alt="Wits-Logo"
          onClick={handleLogoutClick}
          className="h-10 cursor-pointer"
        />
        <div className="ml-5 text-blue-900 text-lg font-bold">Dining Services</div>
        <div className="flex items-center ml-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border border-gray-300 rounded px-2 py-2 mx-5 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* Welcome User Dropdown */}
          <div className="">
            <div
              className="text-[#a0c3ff] text-lg font-bold mr-5 cursor-pointer"
              onClick={toggleUserDropdown}
            >
              Welcome, {userEmail || "Guest"} ▼
            </div>
            {/* User Dropdown Tab */}
            {userDropdownVisible && (
              <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-md p-2.5 w-36 text-center mt-2">
                <button 
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                  onClick={handleLogoutClick}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Menu */}
      <div className={`fixed top-0 ${menuVisible ? 'left-0' : 'left-[-275px]'} w-[275px] h-full bg-[#0c0d43] shadow-lg transition-all duration-300 z-20`}>
        <button className="absolute top-4 right-4 text-2xl bg-none border-none cursor-pointer text-white" 
          onClick={toggleMenu}>
          &times;
        </button>

        {/* Dashboard Link */}
        <a href="/dashboard" 
          className="block text-white text-lg py-2 px-4 bg-[#003080] rounded-md text-center my-12 mx-auto w-11/12 hover:bg-[#0056b3] no-underline"
          >
          Dashboard
        </a>

        {/* Line separator */}
        <div className="w-4/5 h-px bg-gray-300 my-2.5 mx-auto"></div>

        <ul className="list-none pt-7 pb-7 px-7 mt-10">
          {/* Menu Access Dropdown */}
          <li className="mb-2.5">
            <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
             href="#menuAccess" onClick={() => toggleDropdown("menuAccess")}>
              Menu Access
            </a>
            {openDropdown === "menuAccess" && (
              <ul className="list-none pt-7 pb-7 px-7 mt-10">
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#breakfast">Breakfast</a>
                </li>
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#lunch">Lunch</a>
                </li>
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#dinner">Dinner</a>
                </li>
              </ul>
            )}
          </li>

          {/* Dietary Management Dropdown */}
          <li className="mb-2.5">
            <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
              href="#dietaryManagement"
              onClick={() => toggleDropdown("dietaryManagement")}
            >
              Dietary Management
            </a>
            {openDropdown === "dietaryManagement" && (
              <ul className="list-none pt-7 pb-7 px-7 mt-10">
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#vegan">Vegan</a>
                </li>
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#glutenFree">Gluten-Free</a>
                </li>
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#halal">Halal</a>
                </li>
              </ul>
            )}
          </li>

          {/* Meal Credits Dropdown */}
          <li className="mb-2.5">
            <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
              href="#mealCredits"
              onClick={() => toggleDropdown("mealCredits")}
            >
              Meal Credits
            </a>
            {openDropdown === "mealCredits" && (
              <ul className="list-none pt-7 pb-7 px-7 mt-10">
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#currentBalance">Current Balance</a>
                </li>
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#topUp">Top Up</a>
                </li>
              </ul>
            )}
          </li>

          {/* Dining Reservations Dropdown */}
          <li className="mb-2.5">
            <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
              href="#diningReservations"
              onClick={() => toggleDropdown("diningReservations")}
            >
              Dining Reservations
            </a>
            {openDropdown === "diningReservations" && (
              <ul className="list-none pt-7 pb-7 px-7 mt-10">
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#makeReservation">Make a Reservation</a>
                </li>
                <li className="mb-2.5">
                  <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                   href="#viewReservations">View Reservations</a>
                </li>
              </ul>
            )}
          </li>

          {/*History dropdown*/}
          <li className="mb-2.5">
            <a className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
              href="#diningReservations"
              onClick={() => toggleDropdown("history")}
            >
              History
            </a>
            {openDropdown === "history" && (
              <ul className="list-none pt-7 pb-7 px-7 mt-10">
                <li className="mb-2.5">
                  <Link className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                  to="/order-history">Order History</Link> 
                </li>
                <li className="mb-2.5">
                <a
                 className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3]"
                 onClick={toggleReservationHistory}
                >
                Reservation History</a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

     {/* Reservation History Side Tab */}
       <div className={`fixed top-0 left-[275px] w-[600px] h-full bg-gray-50 shadow-lg transition-transform duration-300 ease-in-out z-[1000] ${showReservationHistory ? "translate-x-0" : "-translate-x-full"} ${!showReservationHistory ? "hidden" : ""}`}>
        <button className="absolute top-4 right-4 text-xl text-gray-700 hover:text-gray-900" onClick={() => setShowReservationHistory(false)}>
          &times;
        </button>
        <div className="p-5">
        <div className="py-2 px-4 mb-4 text-center rounded" style={{ backgroundColor: '#0c0d43', color: 'white' }}>
            <h2 className="text-2xl font-bold">Reservation History</h2>
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Reservation</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockReservations.map((reservation) => (
                <>
                  <tr key={reservation.id}>
                    <td className="border px-4 py-2">{reservation.date}</td>
                    <td className="border px-4 py-2">{reservation.time}</td>
                    <td className="border px-4 py-2">{reservation.reservationName}</td>
                    <td className="border px-4 py-2">
                    {submittedReviews[reservation.reservationName] ? (
                        <button className="bg-gray-500 text-white py-1 px-2 rounded cursor-default">
                          Reviewed
                        </button>
                      ) : (
                        <button
                          className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                          onClick={() => toggleReviewForm(reservation.reservationName)}
                        >
                          {expandedReservation === reservation.reservationName ? 'Close' : 'Review'}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Review Form for the selected reservation */}
                  {expandedReservation === reservation.reservationName && (
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
    <strong>Rating:</strong>
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star} className="mx-1">
          <input
            type="radio"
            name="rating"
            value={star}
            checked={rating === star}
            onChange={() => setRating(star)}
          />
          {star}⭐
        </label>
      ))}
    </div>
  </div>
  <div className="text-right mt-2">
    <button
                            className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                            onClick={() => handleSubmitReview(reservation.reservationName)}
                          >
                            Submit Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Show the review if it has been submitted */}
                  {submittedReviews[reservation.reservationName] && (
  <tr>
    <td colSpan={4} className="border px-4 py-2 bg-gray-100">
      <strong>Your Review:</strong>
      <p className="mt-2">{submittedReviews[reservation.reservationName]}</p>
      <strong>Your Rating: </strong>
      <p className="mt-2">{submittedRatings[reservation.reservationName]} ⭐</p>
    </td>
  </tr>
)}


                </>
              ))}
            </tbody>
          </table>

        </div>
      </div>

      {/* Tabs for the Dashboard */}
      <div className="absolute top-36 left-64 flex w-3/4">
        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "menuAccess" ? 'bg-transparent bg-opacity-20' : ''
          }`}
          onClick={() => openTab("menuAccess")}
        >
          <span className="relative z-10">Menu Access</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "menuAccess" ? 'w-1/2' : ''
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "menuAccess" ? 'w-1/2' : ''
            }`}
          ></span>
        </button>
        
        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "dietaryManagement" ? 'bg-transparent bg-opacity-20' : ''
          }`}
          onClick={() => openTab("dietaryManagement")}
        >
          <span className="relative z-10">Dietary Management</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "dietaryManagement" ? 'w-1/2' : ''
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "dietaryManagement" ? 'w-1/2' : ''
            }`}
          ></span>
        </button>
        
        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "mealCredits" ? 'bg-transparent bg-opacity-20' : ''
          }`}
          onClick={() => openTab("mealCredits")}
        >
          <span className="relative z-10">Meal Credits</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "mealCredits" ? 'w-1/2' : ''
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "mealCredits" ? 'w-1/2' : ''
            }`}
          ></span>
        </button>
        
        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "diningReservations" ? 'bg-transparent bg-opacity-20' : ''
          }`}
          onClick={() => openTab("diningReservations")}
        >
          <span className="relative z-10">Dining Reservations</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "diningReservations" ? 'w-1/2' : ''
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "diningReservations" ? 'w-1/2' : ''
            }`}
          ></span>
        </button>
      </div>
      
      {/* Feedback Sidebar */}
      <div className={`fixed top-0 right-0 w-[300px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[1000] p-5 ${feedbackSidebarVisible ? "translate-x-0" : "translate-x-full"}`}>
        <button className="absolute top-4 right-4 text-xl text-gray-700 hover:text-gray-900" onClick={toggleFeedbackSidebar}>
          &times;
        </button>
        <div className="ml-5 text-blue-900 text-xl font-bold mb-3">Feedback System</div>
        {/* Conditional Rendering based on whether the app has been rated */}
        {appRated ? (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-lg font-bold">Thank you for your feedback!</h2>
            <p className="mt-2">
              <strong>Your Review:</strong>
            </p>
            <p>{appFeedback}</p>
            <p className="mt-2">
            <strong>Your Rating:</strong> {appRating} ⭐
          </p>
          </div>
        ) : (
          <form>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us how we can improve the app..."
              maxLength={maxReviewLength}
              value={appFeedback}
              onChange={handleAppFeedbackChange}
              rows={6}
            ></textarea>
            <div className="text-sm text-gray-500 mt-2">{maxReviewLength - appFeedback.length} characters remaining</div>
                      {/* Rating system for the app */}
          <div className="my-4">
            <strong>Rate the App:</strong>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="mx-1">
                  <input
                    type="radio"
                    name="appRating"
                    value={star}
                    checked={appRating === star}
                    onChange={() => handleAppRatingChange(star)}
                  />
                  {star}⭐
                </label>
              ))}
            </div>
          </div>

            <button
              type="button"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
              onClick={handleSubmitAppFeedback}
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>

      {/* Toggle Feedback Button at the Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleFeedbackSidebar}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          {feedbackSidebarVisible ? 'Close Feedback' : 'Rate the app!'}
        </button>
      </div>

      {/* Tab Content */}
      <div className="absolute border rounded h-50 top-64 left-64 w-3/4 p-5 text-black text-center">
        {activeTab === 'DiningServices' && (
          <div>
            <h2 className="text-2xl font-bold">Dining Services</h2>
            <p>Content for Dining Services.</p>
          </div>
        )}
        {activeTab === 'menuAccess' && (
          <div>
            <h2 className="text-2xl font-bold">Menu Access</h2>
            <p>Content for Menu Access.</p>
          </div>
        )}
        {activeTab === 'dietaryManagement' && (
          <div>
            <h2 className="text-2xl font-bold">Dietary Management</h2>
            <p>Content for Dietary Management.</p>
          </div>
        )}
        {activeTab === 'mealCredits' && (
          <div>
            <h2 className="text-2xl font-bold">Meal Credits</h2>
            <p>Content for Meal Credits.</p>
          </div>
        )}
        {activeTab === 'diningReservations' && (
          <div>
            <h2 className="text-2xl font-bold">Dining Reservations</h2>
            <p>Content for Dining Reservations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

