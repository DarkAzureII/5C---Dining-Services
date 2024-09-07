import React from 'react';
import './NavBar.css';

type NavBarProps = {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoClick: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onSignupClick, onLogoClick }) => {
  const handleDropdownClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    const dropdownContent = event.currentTarget.nextElementSibling as HTMLElement;
    dropdownContent.style.display =
      dropdownContent.style.display === 'block' ? 'none' : 'block';
  };

  return (
    <div className="nav-bar">
      <img
        src="/wits logo.png"
        alt="Wits Logo"
        onClick={onLogoClick}
        style={{ cursor: 'pointer' }} 
      />
      <div className="nav-description">Wits University</div>
      <div className="nav-links">
        <div className="nav-item">
          <span onClick={handleDropdownClick}>Dining Services</span>
          <span className="arrow" onClick={handleDropdownClick}>&#x25BC;</span>
          <div className="dropdown-content">
            <p>
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
        </div>
        <div className="nav-item">
            <span onClick={handleDropdownClick}>Documentation</span>
            <span className="arrow" onClick={handleDropdownClick}>&#x25BC;</span>
            <div className="dropdown-content">
              <ul>
                  <li><a href="README.md">Project Overview</a></li>
                  <li><a href="ARCHITECTURE.md">Architecture</a></li>
                  <li><a href="CONTRIBUTING.md">How to Contribute</a></li>
                  <li><a href="VERSION_CONTROL.md">About Versioning</a></li>
                  <li><a href="CHANGELOG.md">Notable Changes</a></li>
              </ul>
          </div>
        </div>
      </div>
      <div className="login-signup-buttons">
        <button className="nav-button" onClick={onLoginClick}>
          Login
        </button>
        <button className="nav-button" onClick={onSignupClick}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default NavBar;
