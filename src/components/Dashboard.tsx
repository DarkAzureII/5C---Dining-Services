import React, { useState } from 'react';
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
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const tabs = ['DiningServices', 'menuAccess', 'dietaryManagement', 'mealCredits', 'diningReservations'];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <img
        src="Images/wits-white.jpg"
        alt="backgroundImage"
        className="fixed inset-0 w-full h-full object-cover z-0"
      />

      {/* Navigation Bar */}
      <div className="fixed top-0 w-full bg-white shadow-md z-10 flex items-center p-4">
        <img
          src="/wits logo.png"
          alt="Wits Logo"
          onClick={handleLogoutClick}
          className="h-10 cursor-pointer"
        />
        <div className="ml-5 text-blue-900 text-lg font-bold">Dining Services</div>
        <div className="ml-auto flex items-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-20">
            Feedback System
          </button>
          <div className="text-black text-lg font-bold mr-24">Welcome</div>
          <button
            className=" text-blue-900 px-4 py-2 rounded hover:bg-red-600  mr-20 transition-colors duration-300"
            onClick={handleLogoutClick}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs for the Dashboard */}
      <div className="absolute top-36 left-64 flex w-3/4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 px-5 text-black transition-all duration-300 group relative ${
              activeTab === tab ? 'bg-white bg-opacity-20' : ''
            }`}
            onClick={() => openTab(tab)}
          >
            <span className="relative z-10">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            {/* Underline animation for the left and right sides */}
            <span
              className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
                activeTab === tab ? 'w-1/2' : ''
              }`}
            ></span>
            <span
              className={`absolute bottom-0 right-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-1/2 ${
                activeTab === tab ? 'w-1/2' : ''
              }`}
            ></span>
          </button>
        ))}
      </div>


      {/* Tab Content */}
      <div className="absolute top-64 left-0 w-full p-5 text-black text-center">
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