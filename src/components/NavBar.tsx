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
    <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-white fixed top-0 w-full z-10 shadow-md">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <img
          test-id="wits-logo"
          src="/wits-logo.png"
          alt="Wits-Logo"
          onClick={onLogoClick}
          className="h-8 sm:h-10 cursor-pointer"
        />
        <div className="text-xs sm:text-sm font-bold text-[#003080]">Wits University</div>
      </div>
      
      {/* Nav Items and Dropdown */}
      <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-bold">
        <div className="relative">
          <span 
            className="cursor-pointer"
            onClick={() => handleDropdownClick('docs')}
          >
            Documentation
            <span className="ml-1 text-xs">&#x25BC;</span>
          </span>
          {activeDropdown === 'docs' && (
            <div className="absolute top-full left-0 bg-white p-2.5 rounded-lg shadow-lg w-44 sm:w-50 text-xs sm:text-sm">
              <ul className="space-y-2">
                <li><a href="README.md" className="hover:text-[#abcaff]">Project Overview</a></li>
                <li><a href="ARCHITECTURE.md" className="hover:text-[#abcaff]">Architecture</a></li>
                <li><a href="CONTRIBUTING.md" className="hover:text-[#abcaff]">How to Contribute</a></li>
                <li><a href="VERSION_CONTROL.md" className="hover:text-[#abcaff]">About Versioning</a></li>
                <li><a href="CHANGELOG.md" className="hover:text-[#abcaff]">Notable Changes</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Login and Signup Buttons */}
      <div className="flex items-center gap-2">
        <button 
          className="bg-white text-[#003080] px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-[#abcaff]"
          onClick={onLoginClick}
        >
          Login
        </button>
        <button 
          className="bg-white text-[#003080] px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-[#abcaff]"
          onClick={onSignupClick}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default NavBar;
