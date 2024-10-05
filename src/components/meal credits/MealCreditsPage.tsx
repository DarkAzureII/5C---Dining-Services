import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import BalanceTab from "./Balance";
import Transaction from "./Transaction";
import TrackUsage from "./TrackUsage";
const MealCreditsPage: React.FC = () => {
  const navigate = useNavigate();

  // States

  // Sample transactions
  const transactions = [
    { amount: 25.75, date: "2024-09-01" },
    { amount: 10.0, date: "2024-09-03" },
    { amount: 5.5, date: "2024-09-10" },
  ];
  const [activeTab, setActiveTab] = useState("Balance");
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
        setUserName(user.displayName); // You can also use displayName if available
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    });

    // Clean up the subscription
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

  // Toggle feedback sidebar
  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible);
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
        <button
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
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-5 transition duration-300 ease-in-out"
            onClick={toggleFeedbackSidebar}
          >
            Feedback System
          </button>

          {/* Welcome User Dropdown */}
          <div className="">
            <div
              className="text-[#a0c3ff] text-lg font-bold mr-5 cursor-pointer"
              onClick={toggleUserDropdown}
            >
              Welcome, {userName || userEmail || "Guest"} ▼
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
          className="absolute top-4 right-4 text-2xl bg-none border-none cursor-pointer text-white"
          onClick={toggleMenu}
        >
          &times;
        </button>

        {/* Dashboard Link */}
        <a
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
         {/* Dining Reservations Dropdown */}
         <button
            className="block text-white text-sm py-2 px-4 bg-[#003080] rounded-md text-center shadow-md w-full mx-auto no-underline hover:bg-[#0056b3] mb-2.5"
            onClick={handleReservationClick} // Use the new handler
          >
            Dining Reservation
          </button>
        </ul>
      </div>
      {/* Tabs for the Dashboard */}
      <div className="absolute top-36 left-64 flex w-3/4 ">
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
      <div className="absolute border rounded top-64 left-64 w-3/4 p-5 text-black text-center overflow-y-auto max-h-[80vh]">
        {/* {activeTab === "MealCredits" && (
          <div>
            <h2 className="text-2xl font-bold">Meal Credits</h2>
            <p>Track your meal credits.</p>
          </div>
        )} */}
        {activeTab === "Balance" && <BalanceTab />}

        {activeTab === "Transactions" && (
          <Transaction transactions={transactions} />
        )}
        {activeTab === "TrackUsage" && <TrackUsage />}
      </div>

      {/* Feedback Sidebar */}
      {feedbackSidebarVisible && (
        <div className="fixed right-0 top-0 w-[275px] h-full bg-[#e6f7ff] shadow-lg transition-all duration-300 z-20">
          {/* Sidebar content */}
          <button
            className="absolute top-4 left-4 text-2xl bg-none border-none cursor-pointer text-gray-600"
            onClick={toggleFeedbackSidebar}
          >
            &times;
          </button>
          {/* Feedback system content goes here */}
        </div>
      )}
      
    </div>
  );
};

export default MealCreditsPage;
