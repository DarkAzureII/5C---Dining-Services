import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SystemDescription from './SystemDescription';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { User } from 'firebase/auth'; // Import User type

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
    <div>
      <NavBar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} onLogoClick={handleLogoClick} />
      {!showLogin && !showSignup && <SystemDescription />}
      {showLogin && <LoginForm isActive={showLogin} onCreateAccountClick={handleCreateAccountClick} />} {/* Pass the handler */}
      {showSignup && <SignupForm isActive={showSignup} onAlreadyHaveAccountClick={handleAlreadyHaveAccountClick} />}
    </div>
  );
};

export default HomePage;
