import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DiningServices');
  const [searchTerm, setSearchTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [feedbackSidebarVisible, setFeedbackSidebarVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible); // Toggle feedback sidebar
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <img
        src="wits-blue.jpg"
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
        </ul>
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
        <h2>Feedback System</h2>
        <p>Provide your feedback here.</p>
        {/* You can add more content or a feedback form here */}
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