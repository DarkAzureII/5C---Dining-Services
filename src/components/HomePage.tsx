import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import SystemDescription from './SystemDescription';
import { auth } from '../firebaseConfig';
import { User } from 'firebase/auth';
import RightSidebarFooter from './RightSidebarFooter';

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    navigate('/auth?mode=login');
  };

  const handleSignupClick = () => {
    navigate('/auth?mode=signup');
  };

  const handleLogoClick = () => {
    // Any other logic when logo is clicked
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} onLogoClick={handleLogoClick} />

      {/* Fixed heading directly below NavBar */}
      <div className="fixed top-[60px] left-0 w-full h-[20%] bg-[#0c0d43] text-white flex items-center px-4 py-2 z-50">
        <img src="wits-logo.png" alt="Wits Logo" className="w-[80px] h-auto rounded-lg border-2 border-white" />
        <h1 className="ml-5 text-xl font-bold">Smart Campus!</h1>
      </div>

      {/* Main Image Section - Fixed below the heading */}
      <div className="fixed top-[calc(60px+20%)] left-0 w-full h-[calc(100vh-60px-20%)] overflow-y-auto z-40">
        <img
          src="Wits-DH.jpg"
          alt="Main Image"
          className="w-full h-full object-cover md:object-fill"
          style={{ minHeight: '100%', minWidth: '100%' }}
        />
      </div>

      {/* Overlay Content on top of the Image */}
      <div className="absolute top-[calc(60px+20%)] w-full h-[calc(100vh-60px-20%)] flex z-50">
        {/* Responsive layout for System Description and Right Sidebar Footer */}
        <div className="flex-grow flex justify-center items-center px-4 mt-[-4]">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl p-4">
            <SystemDescription />
          </div>
        </div>

        {/* Right Sidebar Footer */}
        <div className="w-1/4 md:w-1/6 p-4">
          <RightSidebarFooter />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
