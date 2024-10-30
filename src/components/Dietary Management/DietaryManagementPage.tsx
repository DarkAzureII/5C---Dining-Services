import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Feedback from "../Feedback System/Feedback";
import DietaryPreferencesHandler from "./DietaryPreferencesHandler";
import ReservationHistory from "../Feedback System/ReservationHistory";

const DietaryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("DietaryManagement");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [feedbackSidebarVisible, setFeedbackSidebarVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // UseEffect to fetch user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserName(user.displayName);
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };
  // Tab switching function
  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleMealCreditsClick = () => {
    navigate("/meal-credits");
  };

  const handleReservationClick = () => {
    navigate("/dining-reservations"); // Route to Dining Reservations
  };
  const handleDietaryClick = () => {
    navigate("/dietary-management"); // Route to Dietary Management
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleReservationHistory = () => {
    setShowReservationHistory(!showReservationHistory);
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
          data-testid="menu-button"
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
          menuVisible ? "left-0" : "left-[-300px]"
        } w-[300px] lg:w-[400px] xl:w-[450px] h-full bg-[#0c0d43] shadow-lg transition-all duration-300 z-20`}
      >
        <button
          data-testid="close-menu-button"
          className="absolute top-3 right-3 text-xl md:text-2xl bg-none border-none cursor-pointer text-white"
          onClick={toggleMenu}
        >
          &times;
        </button>

        {/* Dashboard Link */}
        <a
          data-testid="dashboard-link"
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
            data-testid="logout-button"
            onClick={handleLogoutClick}
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md w-4/5 mx-auto hover:bg-[#0056b3]"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Reservation History Block - Conditional Rendering */}
      {showReservationHistory && (
        <div className="fixed top-0 left-[300px] lg:left-[400px] xl:left-[450px] w-[350px] lg:w-[500px] xl:w-[600px] h-full bg-gray-50 shadow-lg transition-transform duration-500 ease-in-out z-30">
          <button
            className="absolute top-3 right-3 text-lg text-gray-700 hover:text-gray-900"
            onClick={() => setShowReservationHistory(false)}
          >
            &times;
          </button>
          <ReservationHistory />
        </div>
      )}

      {/* Tabs for the Dashboard */}
      <div className="fixed top-36 left-64 flex w-3/4 ">
        <button
          className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
            activeTab === "DietaryManagement"
              ? "bg-transparent bg-opacity-20"
              : ""
          }`}
          onClick={() => openTab("DietaryManagement")}
        >
          <span className="relative z-10">Dietary Management</span>
          <span
            className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "DietaryManagement" ? "w-1/2" : ""
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
              activeTab === "DietaryManagement" ? "w-1/2" : ""
            }`}
          ></span>
        </button>
      </div>
      {/* Tab Content */}
      <div className="fixed grow bg-transparent border rounded top-64 left-64 w-3/4 p-5 text-black text-center overflow-y-scroll max-h-[80vh]">
        {activeTab === "DietaryManagement" && <DietaryPreferencesHandler />}
      </div>
    </div>
  );
};

export default DietaryManagementPage;
