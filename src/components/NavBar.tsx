import React, { useState } from 'react';

type NavBarProps = {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoClick: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onSignupClick, onLogoClick }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownClick = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="flex items-center justify-between px-5 py-2 bg-white fixed top-0 w-full z-10 shadow-md">
      <div className="flex items-center">
        <img
          src="/wits logo.png"
          alt="Wits Logo"
          onClick={onLogoClick}
          className="h-10 mr-2 cursor-pointer"
        />
        <div className="text-sm font-bold text-blue-900 ml-2">Wits University</div>
      </div>
      
      <div className="flex gap-5">
        <div className="relative">
          <span 
            className="cursor-pointer"
            onClick={() => handleDropdownClick('dining')}
          >
            Dining Services
            <span className="ml-1">&#x25BC;</span>
          </span>
          {activeDropdown === 'dining' && (
            <div className="absolute top-full left-0 bg-white p-2 rounded shadow-md w-64">
              <p className="">
                The Dining Services App aims to manage campus dining facilities
                and meal plans, providing a seamless and personalized dining
                experience. It features real-time menu access, dietary management
                tools, meal credit tracking, dining reservations, and a feedback
                system. The app includes a user-friendly dashboard for viewing
                menus, managing dietary preferences, and tracking meal credits,
                supported by robust APIs for menu data, dietary management, meal
                credits, reservations, and feedback
              </p>
            </div>
          )}
        </div>
        <div className="relative">
          <span 
            className="cursor-pointer"
            onClick={() => handleDropdownClick('docs')}
          >
            Documentation
            <span className="ml-1">&#x25BC;</span>
          </span>
          {activeDropdown === 'docs' && (
            <div className="absolute top-full left-0 bg-white p-2 rounded shadow-md w-48">
              <ul className="text-xs">
                <li><a href="README.md" className="hover:text-blue-500">Project Overview</a></li>
                <li><a href="ARCHITECTURE.md" className="hover:text-blue-500">Architecture</a></li>
                <li><a href="CONTRIBUTING.md" className="hover:text-blue-500">How to Contribute</a></li>
                <li><a href="VERSION_CONTROL.md" className="hover:text-blue-500">About Versioning</a></li>
                <li><a href="CHANGELOG.md" className="hover:text-blue-500">Notable Changes</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <button 
          className=" text-blue-900 px-3 py-2 rounded hover:bg-blue-200 mr-2"
          onClick={onLoginClick}
        >
          Login
        </button>
        <button 
          className=" text-blue-900 px-3 py-2 rounded hover:bg-blue-200"
          onClick={onSignupClick}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default NavBar;