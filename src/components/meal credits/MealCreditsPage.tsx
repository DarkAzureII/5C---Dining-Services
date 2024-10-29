import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import BalanceTab from "./Balance";
import Transaction from "./Transaction";
import TrackUsage from "./TrackUsage";
import ReservationHistory from "../Feedback System/ReservationHistory";

const MealCreditsPage: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [activeTab, setActiveTab] = useState("Balance");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [feedbackSidebarVisible, setFeedbackSidebarVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  //const [userName, setUserName] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // UseEffect to fetch user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        //setUserName(user.displayName); // You can also use displayName if available
      } else {
        setUserEmail(null);
        //setUserName(null);
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const [showReservationHistory, setShowReservationHistory] = useState(false);
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

  // Tab switching function
  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Toggle for sidebar menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Toggle for dropdowns
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Logout functionality
  const handleLogoutClick = async () => {
    try {
      await auth.signOut(); // Ensure 'auth' is properly imported and configured.
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Search change handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  // Navigate to Meal Credits page
  const handleMealCreditsClick = () => {
    navigate("/meal-credits");
  };
  const handleReservationClick = () => {
    navigate("/dining-reservations"); // Route to Dining Reservations
  };
  const handleDietaryClick = () => {
    navigate("/dietary-management"); // Route to Dietary Management
  };

  const toggleReservationHistory = () => {
    setShowReservationHistory(!showReservationHistory);
  };

  // Toggle feedback sidebar
  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible);
  };

  return (
    <div className="fixed min-h-screen overflow-y-auto">
      {/* Background Image */}
      <img
        src="wits-white.jpg"
        alt="backgroundImage"
        className="fixed inset-0 w-full h-full object-cover"
        style={{ minHeight: "100vh", minWidth: "100vw" }} // Ensures the image fills the viewport
      />

      {/* Navigation Bar */}
      <div className="flex items-center px-4 sm:px-5 py-2 bg-transparent fixed top-0 w-full z-10 shadow-md">
        <button
          test-id="menu-button"
          className="text-xl sm:text-2xl bg-none border-none cursor-pointer mr-4 sm:mr-5"
          onClick={toggleMenu}
        >
          &#9776;
        </button>
        <img
          src="/wits-logo.png"
          alt="Wits-Logo"
          onClick={handleLogoutClick}
          className="h-8 sm:h-10 cursor-pointer"
        />
        <div className="ml-3 sm:ml-5 text-blue-900 text-sm sm:text-base font-bold">
          Dining Services
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-4">
          {/* Welcome User Dropdown */}
          <div className="flex items-center">
            <span className="text-sm sm:text-base text-blue-900 font-bold mr-1 sm:mr-2">
              Welcome {userEmail || "Guest"}
            </span>
            <img
              src="https://freesvg.org/img/abstract-user-flat-3.png"
              alt="User Icon"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
        </div>
      </div>
{/* Side Menu */}
<div
        className={`fixed top-0 ${
          menuVisible ? "left-0" : "left-[-250px]"
        } w-[250px] md:w-[200px] h-full bg-[#0c0d43] shadow-lg transition-all duration-300 z-20`}
      >
        <button
          test-id="close-menu-button"
          className="absolute top-3 right-3 text-xl md:text-2xl bg-none border-none cursor-pointer text-white"
          onClick={toggleMenu}
        >
          &times;
        </button>

        {/* Dashboard Link */}
        <a
          test-id="dashboard-link"
          href="/dashboard"
          className="block text-white text-sm md:text-base py-2 px-3 bg-[#003080] rounded-md text-center my-10 mx-auto w-11/12 hover:bg-[#0056b3] no-underline"
        >
          Dashboard
        </a>

        {/* Line separator */}
        <div className="w-4/5 h-px bg-gray-300 my-2 mx-auto"></div>

        <ul className="list-none pt-5 pb-5 px-5 mt-6">
          {/* Dietary Management Dropdown */}
          <button
            className="block text-white text-xs md:text-sm py-1.5 px-2 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2"
            onClick={handleDietaryClick}
          >
            Dietary Management
          </button>

          {/* Meal Credits Button */}
          <button
            className="block text-white text-xs md:text-sm py-1.5 px-2 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2"
            onClick={handleMealCreditsClick}
          >
            Meal Credits
          </button>

          {/* Dining Reservations Button */}
          <button
            className="block text-white text-xs md:text-sm py-1.5 px-2 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2"
            onClick={handleReservationClick}
          >
            Dining Reservation
          </button>

          {/* History Dropdown */}
          <button
            className="block text-white text-xs md:text-sm py-1.5 px-2 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2"
            onClick={toggleReservationHistory}
          >
            History
          </button>
        </ul>

        {/* Reservation History Block */}
        {showReservationHistory && (
          <div className="mt-4 px-5 pb-5">
            <div className="bg-gray-50 shadow-lg p-3 rounded-md transition-transform duration-500 ease-in-out">
              <button
                className="absolute top-3 right-3 text-lg text-gray-700 hover:text-gray-900"
                onClick={() => setShowReservationHistory(false)}
              >
                &times;
              </button>
              <ReservationHistory />
            </div>
          </div>
        )}
        {/* User Email and Logout Button */}
        <div className="absolute bottom-10 left-0 w-full text-center text-white">
          <div className="text-sm mb-2">Logged in as:</div>
          <div className="flex items-center justify-center mb-2">
            <img
              src="https://freesvg.org/img/abstract-user-flat-3.png"
              alt="User Icon"
              className="w-5 h-5 mr-2"
            />
            <span>{userEmail || "Guest"}</span>
          </div>
          <button
            test-id="logout-button"
            onClick={handleLogoutClick}
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md w-4/5 mx-auto hover:bg-[#0056b3]"
          >
            Log Out
          </button>
        </div>
      </div>
      {/* Tabs for the Dashboard */}
      <div className="fixed top-36 left-64 flex w-3/4 ">
        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "Balance" ? "bg-transparent bg-opacity-20" : ""
          }`}
          onClick={() => openTab("Balance")}
        >
          <span className="relative z-10">Balance</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "Balance" ? "w-1/2" : ""
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "Balance" ? "w-1/2" : ""
            }`}
          ></span>
        </button>

        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "Transactions" ? "bg-transparent bg-opacity-20" : ""
          }`}
          onClick={() => openTab("Transactions")}
        >
          <span className="relative z-10">Transactions</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "Transactions" ? "w-1/2" : ""
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "Transactions" ? "w-1/2" : ""
            }`}
          ></span>
        </button>

        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "TrackUsage" ? "bg-transparent bg-opacity-20" : ""
          }`}
          onClick={() => openTab("TrackUsage")}
        >
          <span className="relative z-10">Track Usage</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "TrackUsage" ? "w-1/2" : ""
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "TrackUsage" ? "w-1/2" : ""
            }`}
          ></span>
        </button>
      </div>
      {/* Tab Content */}
      <div className="fixed border rounded top-64 left-64 w-3/4 p-5 text-black text-center overflow-y-scroll max-h-[60vh]">
        {activeTab === "Balance" && <BalanceTab />}

        {activeTab === "Transactions" && <Transaction />}
        {activeTab === "TrackUsage" && <TrackUsage />}
      </div>
    </div>
  );
};

export default MealCreditsPage;
