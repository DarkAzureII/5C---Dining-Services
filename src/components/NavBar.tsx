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
          data-testid="wits-logo"
          src="/wits-logo.png"
          alt="Wits-Logo"
          onClick={onLogoClick}
          className="h-8 sm:h-10 cursor-pointer"
        />
        <div className="text-xs sm:text-sm font-bold text-[#003080]">Wits University</div>
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
