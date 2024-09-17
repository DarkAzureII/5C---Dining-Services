import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Add your CSS styling here
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menuAccess");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [feedbackSidebarVisible, setFeedbackSidebarVisible] = useState(false);
  const [reservationAction, setReservationAction] = useState("view");

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!userDropdownVisible);
  };

  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible);
  };

  const handleReservationAction = (action: string) => {
    setReservationAction(action);
  };

  return (
    <div>
      {/* Background Image */}
      <img
        src="wits-white.jpg"
        alt="backgroundImage"
        className="full-screen-image"
      />

      {/* Navigation Bar */}
      <div className="nav-bar">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <img
          src="/wits logo.png"
          alt="Wits Logo"
          onClick={handleLogoutClick}
          style={{ cursor: "pointer" }}
        />
        <div className="nav-links">Dining Services</div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="search-bar"
        />
        <div className="right-items">
          <button className="feedback-button" onClick={toggleFeedbackSidebar}>
            Feedback System
          </button>

          {/* Welcome User Dropdown */}
          <div className="welcome-user-container">
            <div
              className="welcome-user"
              onClick={toggleUserDropdown}
              style={{ cursor: "pointer" }}
            >
              Welcome, {userEmail || "Guest"} ▼
            </div>

            {/* User Dropdown Tab */}
            {userDropdownVisible && (
              <div className="user-dropdown">
                <button className="logout-button" onClick={handleLogoutClick}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Menu */}
      <div className={`side-menu ${menuVisible ? "visible" : ""}`}>
        <button className="close-menu" onClick={toggleMenu}>
          &times;
        </button>

        {/* Dashboard Link */}
        <a href="/dashboard" className="dashboard-link">
          Dashboard
        </a>

        {/* Line separator */}
        <div className="separator"></div>

        <ul>
          {/* Menu Access Dropdown */}
          <li>
            <a href="#menuAccess" onClick={() => toggleDropdown("menuAccess")}>
              Menu Access
            </a>
            {openDropdown === "menuAccess" && (
              <ul className="dropdown">
                <li>
                  <a href="#breakfast">Breakfast</a>
                </li>
                <li>
                  <a href="#lunch">Lunch</a>
                </li>
                <li>
                  <a href="#dinner">Dinner</a>
                </li>
              </ul>
            )}
          </li>

          {/* Dietary Management Dropdown */}
          <li>
            <a
              href="#dietaryManagement"
              onClick={() => toggleDropdown("dietaryManagement")}
            >
              Dietary Management
            </a>
            {openDropdown === "dietaryManagement" && (
              <ul className="dropdown">
                <li>
                  <a href="#vegan">Vegan</a>
                </li>
                <li>
                  <a href="#glutenFree">Gluten-Free</a>
                </li>
                <li>
                  <a href="#halal">Halal</a>
                </li>
              </ul>
            )}
          </li>

          {/* Meal Credits Dropdown */}
          <li>
            <a
              href="#mealCredits"
              onClick={() => toggleDropdown("mealCredits")}
            >
              Meal Credits
            </a>
            {openDropdown === "mealCredits" && (
              <ul className="dropdown">
                <li>
                  <a href="#currentBalance">Current Balance</a>
                </li>
                <li>
                  <a href="#topUp">Top Up</a>
                </li>
              </ul>
            )}
          </li>

          {/* Dining Reservations Dropdown */}
          <li>
            <a
              href="#diningReservations"
              onClick={() => toggleDropdown("diningReservations")}
            >
              Dining Reservations
            </a>
            {openDropdown === "diningReservations" && (
              <ul className="dropdown">
                <li>
                  <a href="#makeReservation">Make a Reservation</a>
                </li>
                <li>
                  <a href="#viewReservations">View Reservations</a>
                </li>
                <li>
                  <a href="#updateReservation">Update Reservation</a>
                </li>
                <li>
                  <a href="#cancelReservation">Cancel Reservation</a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Feedback Sidebar */}
      <div className={`feedback-sidebar ${feedbackSidebarVisible ? "visible" : ""}`}>
        <button className="close-feedback-sidebar" onClick={toggleFeedbackSidebar}>
          &times;
        </button>
        <h2>Feedback System</h2>
        <p>Provide your feedback here.</p>
      </div>

      {/* Tabs for the Dashboard */}
      <div className="tabs">
        <button
          className={`tab-link ${activeTab === "menuAccess" ? "active" : ""}`}
          onClick={() => openTab("menuAccess")}
        >
          Menu Access
        </button>
        <button
          className={`tab-link ${
            activeTab === "dietaryManagement" ? "active" : ""
          }`}
          onClick={() => openTab("dietaryManagement")}
        >
          Dietary Management
        </button>
        <button
          className={`tab-link ${activeTab === "mealCredits" ? "active" : ""}`}
          onClick={() => openTab("mealCredits")}
        >
          Meal Credits
        </button>
        <button
          className={`tab-link ${
            activeTab === "diningReservations" ? "active" : ""
          }`}
          onClick={() => openTab("diningReservations")}
        >
          Dining Reservations
        </button>
      </div>

      {/* Tab Content for Dining Reservations */}
      <div
        className={`tab-content ${
          activeTab === "diningReservations" ? "active" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Dining Reservations</h2>

        {/* Reservation Actions Menu */}
        <div className="reservation-actions">
          <button
            className={`reservation-action ${
              reservationAction === "view" ? "active" : ""
            }`}
            onClick={() => handleReservationAction("view")}
          >
            View Reservations
          </button>
          <button
            className={`reservation-action ${
              reservationAction === "make" ? "active" : ""
            }`}
            onClick={() => handleReservationAction("make")}
          >
            Make a New Reservation
          </button>
          <button
            className={`reservation-action ${
              reservationAction === "update" ? "active" : ""
            }`}
            onClick={() => handleReservationAction("update")}
          >
            Update Reservation
          </button>
          <button
            className={`reservation-action ${
              reservationAction === "cancel" ? "active" : ""
            }`}
            onClick={() => handleReservationAction("cancel")}
          >
            Cancel Reservation
          </button>
        </div>

        {/* Conditional Rendering for Each Action */}
        {reservationAction === "view" && (
          <div>
            <h3>View Existing Reservations</h3>
            <p>Here, you can view your existing reservations.</p>
            {/* Add code to display existing reservations from Firebase */}
          </div>
        )}

        {reservationAction === "make" && (
          <div>
            <h3>Make a New Reservation</h3>
            <form className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="date" className="font-semibold">
                  Select Date:
                </label>
                <input
                  type="date"
                  id="date"
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="time" className="font-semibold">
                  Select Time:
                </label>
                <input
                  type="time"
                  id="time"
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="diningHall" className="font-semibold">
                  Select Dining Hall:
                </label>
                <select
                  id="diningHall"
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="hall1">Dining Hall 1</option>
                  <option value="hall2">Dining Hall 2</option>
                  <option value="hall3">Dining Hall 3</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
              >
                Reserve Now
              </button>
            </form>
          </div>
        )}

        {reservationAction === "update" && (
          <div>
            <h3>Update an Existing Reservation</h3>
            <p>Select a reservation to update.</p>
            {/* Add code to update a reservation */}
          </div>
        )}

        {reservationAction === "cancel" && (
          <div>
            <h3>Cancel an Existing Reservation</h3>
            <p>Select a reservation to cancel.</p>
            {/* Add code to cancel a reservation */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

