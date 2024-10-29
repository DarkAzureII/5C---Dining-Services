import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { User } from 'firebase/auth'; // Import User type
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<User | null>(null); // User state

  const location = useLocation(); // Get the current location object
  const navigate = useNavigate(); // Get navigate function for navigation

  // Check mode from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    if (mode === 'login') {
      setShowLogin(true);
      setShowSignup(false);
    } else if (mode === 'signup') {
      setShowSignup(true);
      setShowLogin(false);
    }
  }, [location.search]); // Re-run when search params change

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);  // Show login form
    setShowSignup(false); // Hide signup form
    navigate('/auth?mode=login'); // Update URL to reflect login mode
  };

  const handleSignupClick = () => {
    setShowSignup(true);  // Show signup form
    setShowLogin(false);  // Hide login form
    navigate('/auth?mode=signup'); // Update URL to reflect signup mode
  };

  const handleLogoClick = () => {
    setShowSignup(false); // Hide signup form
    setShowLogin(false); // Hide login form
    navigate('/auth'); // Navigate to base auth page without specific mode
  };

  const handleCreateAccountClick = () => {
    setShowSignup(true); // Show signup form
    setShowLogin(false); // Hide login form
    navigate('/auth?mode=signup'); // Update URL to reflect signup mode
  };

  const handleAlreadyHaveAccountClick = () => {
    setShowSignup(false); // Hide signup form
    setShowLogin(true); // Show login form
    navigate('/auth?mode=login'); // Update URL to reflect login mode
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar 
        onLoginClick={handleLoginClick} 
        onSignupClick={handleSignupClick} 
        onLogoClick={handleLogoClick} 
      />

      {/* Centered content container */}
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-md">
          {showLogin && (
            <LoginForm 
              isActive={showLogin} 
              onCreateAccountClick={handleCreateAccountClick} 
              onToggle={handleSignupClick} // Pass click handler for toggling to Signup
            />
          )}
          {showSignup && (
            <SignupForm 
              isActive={showSignup} 
              onAlreadyHaveAccountClick={handleAlreadyHaveAccountClick} 
              onToggle={handleLoginClick} // Pass click handler for toggling to Login
            />
          )}
        </div>
      </div>

      {/* Main Image Section - Fixed below the heading */}
      <div className="fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] overflow-y-auto"  style={{ maxHeight: 'calc(100vh - 60px)' }}>
        
        <img
          src="Wits-DH.jpg"
          alt="Main Image"
          className="w-full h-full object-cover md:object-fill"
          style={{ minHeight: '100%', minWidth: '100%' }}
        />
      </div>
    </div>
  );
};

export default AuthPage;
