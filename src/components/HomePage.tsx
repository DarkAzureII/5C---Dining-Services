import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SystemDescription from './SystemDescription';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { User } from 'firebase/auth'; // Import User type
import RightSidebarFooter from './RightSidebarFooter'; // Import RightSidebarFooter component

const HomePage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<User | null>(null); // User state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);  // Set to show login form
    setShowSignup(false); // Hide signup form
  };

  const handleSignupClick = () => {
    setShowSignup(true);  // Set to show signup form
    setShowLogin(false);  // Hide login form
  };

  const handleLogoClick = () => {
    setShowSignup(false);  // Set to show signup form
    setShowLogin(false); 
  };

  const handleCreateAccountClick = () => {
    setShowSignup(true);  // Set to show signup form
    setShowLogin(false);  // Hide login form
  };

  const handleAlreadyHaveAccountClick = () => {
    setShowSignup(false);  // Set to show signup form
    setShowLogin(true);  // Hide login form
  };

  return (
    <div className='flex flex-col'>
      <NavBar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} onLogoClick={handleLogoClick} />

      {/* Centered content container */}
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md">
          {!showLogin && !showSignup && <SystemDescription />}
          {showLogin && <LoginForm isActive={showLogin} onCreateAccountClick={handleCreateAccountClick} />}
          {showSignup && <SignupForm isActive={showSignup} onAlreadyHaveAccountClick={handleAlreadyHaveAccountClick} />}
        </div>
      </div>
      
      {/* Render heading immediately after NavBar */}
      <div className="fixed top-[60px] left-0 w-full h-[20%] bg-[#0c0d43] text-white flex items-center z-[1000]">
        <img src="wits-logo.png" alt="Wits Logo" className="ml-12 w-[100px] h-auto rounded-lg border-2 border-white" />
        <h1 className="ml-5 text-xl font-bold">Smart Campus!</h1>
      </div>

      {/* Main Image Section */}
      <div className="mt-[10%] w-full h-[calc(100vh-60px-20%)] flex justify-center items-center">
        <img src="Wits-DH.jpg" alt="Main Image" className="w-full h-1/2 object-cover" />
      </div>

      {/* Right Sidebar Footer */}
      <RightSidebarFooter />
    </div>
  );
};

export default HomePage;
