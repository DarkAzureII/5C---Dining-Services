import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Feedback from "../Feedback System/Feedback";
import DietaryPreferencesHandler from "./DietaryPreferencesHandler";
import ReservationHistory from '../Feedback System/ReservationHistory';

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
    <div className="relative min-h-screen overflow-y-auto">
      {/* Background Image */}
      <img
        src="wits-white.jpg"
        alt="backgroundImage"
        className="fixed inset-0 w-full h-full object-cover z-0"
      />
      {/* Navigation Bar */}
      <div className="flex items-center px-5 py-2 bg-transparent fixed top-0 w-full z-10 shadow-md">
        <button
          test-id="menu-button"
          className="text-3xl bg-none border-none cursor-pointer mr-5"
          onClick={toggleMenu}
        >
          &#9776;
        </button>
        <img
          src="/wits-logo.png"
          alt="Wits-Logo"
          onClick={handleLogoutClick}
          className="h-10 cursor-pointer"
        />
        <div className="ml-5 text-blue-900 text-lg font-bold">
          Dining Services
        </div>
        <div className="flex items-center ml-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border border-gray-300 rounded px-2 py-2 mx-5 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Welcome User Dropdown */}
          <div>
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
      <div
        className={`fixed top-0 ${
          menuVisible ? "left-0" : "left-[-275px]"
        } w-[275px] h-full bg-[#0c0d43] shadow-lg transition-all duration-300 z-20`}
      >
        <button
          test-id = "close-menu-button"
          className="absolute top-4 right-4 text-2xl bg-none border-none cursor-pointer text-white"
          onClick={toggleMenu}
        >
          &times;
        </button>

        {/* Dashboard Link */}
        <a
          test-id="dashboard-link"
          href="/dashboard"
          className="block text-white text-lg py-2 px-4 bg-[#003080] rounded-md text-center my-12 mx-auto w-11/12 hover:bg-[#0056b3] no-underline"
        >
          Dashboard
        </a>

        {/* Line separator */}
        <div className="w-4/5 h-px bg-gray-300 my-2.5 mx-auto"></div>

        <ul className="list-none pt-7 pb-7 px-7 mt-10">
          {/* Dietary Management Dropdown */}
          <button
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2.5"
            onClick={handleDietaryClick}
          >Dietary Management
          </button>


          {/* Meal Credits Button */}
          <button
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2.5"
            onClick={handleMealCreditsClick}
          >
            Meal Credits
          </button>

          {/* Dining Reservations Button */}
          <button
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2.5"
            onClick={handleReservationClick}
          >
            Dining Reservation
          </button>
          {/* History Dropdown */}
          <button
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2.5"
            onClick={toggleReservationHistory}
          >
            History
          </button>
        </ul>
      </div>

      {/* Reservation History Side Tab */}
      {showReservationHistory && (
      <div
        className="fixed top-0 left-[275px] w-[600px] h-full bg-gray-50 shadow-lg transition-transform duration-500 ease-in-out z-[1000] translate-x-0"
      >
      <button
        className="absolute top-4 right-4 text-xl text-gray-700 hover:text-gray-900"
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
      {activeTab === "DietaryManagement" && <DietaryPreferencesHandler/>}
      </div>
    </div>
  );
};

export default DietaryManagementPage;
