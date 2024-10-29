import React from "react";
import { auth } from "../firebaseConfig"; // Make sure Firebase auth is imported

const RightSidebarFooter: React.FC = () => {
  // Function to check if user is logged in
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
    e.preventDefault(); // Prevent default navigation
    if (auth.currentUser) {
      // If user is logged in, redirect to the desired link
      window.location.href = url;
    } else {
      // If user is not logged in, prompt them to log in or sign in
      alert("Please log in or sign up first to access this feature.");
    }
  };

  return (
    <div className="fixed top-[calc(60px+20%)] right-0 h-[calc(100vh-0px-20%)] w-[200px] md:w-[250px] bg-[#c7c7c7c8] text-black flex flex-col p-4">
      
      {/* Top Section: Dining Services Description */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Dining Services</h2>
        <p className="text-sm">
          Dining Services provides students with convenient access to healthy and affordable meals on campus. Our offerings include a variety of menu options, dietary management, and more.
        </p>
      </div>
      
      {/* Separator Line */}
      <div className="border-b-2 border-black my-4"></div>
      
      {/* Bottom Section: Dining Services Components */}
      <div className="flex-grow">
        <h3 className="text-md font-semibold mb-2">Components:</h3>
        <ul className="space-y-2">
          <li>
            <a href="/menu-access" onClick={(e) => handleLinkClick(e, "/menu-access")} className="hover:text-gray-600">
              Menu Access
            </a>
          </li>
          <li>
            <a href="/dietary-management" onClick={(e) => handleLinkClick(e, "/dietary-management")} className="hover:text-gray-600">
              Dietary Management
            </a>
          </li>
          <li>
            <a href="/dining-reservations" onClick={(e) => handleLinkClick(e, "/dining-reservations")} className="hover:text-gray-600">
              Dining Reservations
            </a>
          </li>
          <li>
            <a href="/meal-credits" onClick={(e) => handleLinkClick(e, "/meal-credits")} className="hover:text-gray-600">
              Meal Credits
            </a>
          </li>
          <li>
            <a href="/feedback-system" onClick={(e) => handleLinkClick(e, "/feedback-system")} className="hover:text-gray-600">
              Feedback System
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightSidebarFooter;
