import React, { useState } from 'react';
import './Dashboard.css'; // Add your CSS styling here
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('DiningServices');

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleLogoutClick = async () => {
    try {
      await auth.signOut(); // Sign out using Firebase auth
      navigate('/'); // Navigate to login page or another route
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div>
      {/* Background Image */}
      <img
        src="Images/wits-white.jpg"
        alt="backgroundImage"
        className="full-screen-image"
      />

      {/* Navigation Bar */}
      <div className="nav-bar">
        <img
            src="/wits logo.png"
            alt="Wits Logo"
            onClick={handleLogoutClick} // Add onClick handler for logo
            style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickability
        />
        <div className="nav-links">Dining Services</div>
        <div className="right-items">
          <button className="feedback-button">Feedback System</button>
          <div className="welcome-user">Welcome</div>
          <button className="logout-button" onClick={handleLogoutClick}>Log Out</button>
        </div>
      </div>

      {/* Tabs for the Dashboard */}
      <div className="tabs">
        <button
          className={`tab-link ${activeTab === 'DiningServices' ? 'active' : ''}`}
          onClick={() => openTab('DiningServices')}
        >
          Dining Services
        </button>
        <button
          className={`tab-link ${activeTab === 'menuAccess' ? 'active' : ''}`}
          onClick={() => openTab('menuAccess')}
        >
          Menu Access
        </button>
        <button
          className={`tab-link ${activeTab === 'dietaryManagement' ? 'active' : ''}`}
          onClick={() => openTab('dietaryManagement')}
        >
          Dietary Management
        </button>
        <button
          className={`tab-link ${activeTab === 'mealCredits' ? 'active' : ''}`}
          onClick={() => openTab('mealCredits')}
        >
          Meal Credits
        </button>
        <button
          className={`tab-link ${activeTab === 'diningReservations' ? 'active' : ''}`}
          onClick={() => openTab('diningReservations')}
        >
          Dining Reservations
        </button>
      </div>

      {/* Tab Content */}
      <div className={`tab-content ${activeTab === 'DiningServices' ? 'active' : ''}`}>
        <h2>Dining Services</h2>
        <p>Content for Dining Services.</p>
      </div>
      <div className={`tab-content ${activeTab === 'menuAccess' ? 'active' : ''}`}>
        <h2>Menu Access</h2>
        <p>Content for Menu Access.</p>
      </div>
      <div className={`tab-content ${activeTab === 'dietaryManagement' ? 'active' : ''}`}>
        <h2>Dietary Management</h2>
        <p>Content for Dietary Management.</p>
      </div>
      <div className={`tab-content ${activeTab === 'mealCredits' ? 'active' : ''}`}>
        <h2>Meal Credits</h2>
        <p>Content for Meal Credits.</p>
      </div>
      <div className={`tab-content ${activeTab === 'diningReservations' ? 'active' : ''}`}>
        <h2>Dining Reservations</h2>
        <p>Content for Dining Reservations.</p>
      </div>
    </div>
  );
};

export default Dashboard;
