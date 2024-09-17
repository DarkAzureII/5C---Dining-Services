import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { getDietaryPreferences, addDietaryPreference, deleteDietaryPreference, updateDietaryPreference } from "../api/dietaryAPI";

interface DietaryPreference {
  id?: string;
  name: string;
  description?: string;
  lastUpdated?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menuAccess");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [feedbackSidebarVisible, setFeedbackSidebarVisible] = useState(false);

  // Mocked dietary preferences
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([
    { id: "1", name: "Vegan", description: "No animal products" },
    { id: "2", name: "Gluten-Free", description: "Avoid gluten" },
    { id: "3", name: "Halal", description: "Meat prepared according to Islamic law" },
  ]);

  const [selectedPreference, setSelectedPreference] = useState("");
  const [allergens, setAllergens] = useState("");
  const [description, setDescription] = useState("");

  // Track the preference being edited
  const [editingPreferenceId, setEditingPreferenceId] = useState<string | null>(null);

  const userId = "U5JzTbGdubTbTlXqztOriSZHaJJ3"; // Replace with actual logged-in user ID

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle adding new or updating existing preference
  const handleAddOrUpdatePreference = async () => {
    if (editingPreferenceId) {
      // Update existing preference
      const updatedPreferences = dietaryPreferences.map((preference) =>
        preference.id === editingPreferenceId
          ? { ...preference, name: selectedPreference, description }
          : preference
      );
      setDietaryPreferences(updatedPreferences);
    } else {
      // Add new preference
      const newPreference: DietaryPreference = { id: `${Math.random()}`, name: selectedPreference, description };
      setDietaryPreferences([...dietaryPreferences, newPreference]);
    }

    // Clear form fields
    setSelectedPreference("");
    setAllergens("");
    setDescription("");
    setEditingPreferenceId(null); // Reset editing state
  };

  // Handle deleting a preference
  const handleDeletePreference = async (preferenceId: string) => {
    const updatedPreferences = dietaryPreferences.filter((preference) => preference.id !== preferenceId);
    setDietaryPreferences(updatedPreferences);
  };

  // Handle clicking the update button for a specific preference
  const handleEditPreference = (preference: DietaryPreference) => {
    setSelectedPreference(preference.name);
    setDescription(preference.description || "");
    setEditingPreferenceId(preference.id || null);
  };

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const toggleFeedbackSidebar = () => {
    setFeedbackSidebarVisible(!feedbackSidebarVisible); // Toggle feedback sidebar
  };

  return (
    <div>
      <img src="wits-white.jpg" alt="backgroundImage" className="full-screen-image" />
      <div className="nav-bar">
        <button className="menu-button" onClick={() => setMenuVisible(!menuVisible)}>
          &#9776;
        </button>
        <img src="/wits logo.png" alt="Wits Logo" onClick={() => auth.signOut()} style={{ cursor: "pointer" }} />
        <div className="nav-links">Dining Services</div>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="search-bar" />
        <div className="right-items">
          <button className="feedback-button" onClick={toggleFeedbackSidebar}>
            Feedback System
          </button>
          <div className="welcome-user-container">
            <div className="welcome-user" style={{ cursor: "pointer" }}>
              Welcome, {userEmail || "Guest"} ▼
            </div>
          </div>
        </div>
      </div>

      <div className={`side-menu ${menuVisible ? "visible" : ""}`}>
        <button className="close-menu" onClick={() => setMenuVisible(false)}>&times;</button>
        <a href="/dashboard" className="dashboard-link">Dashboard</a>
        <ul>
          <li><a href="#menuAccess" onClick={() => openTab("menuAccess")}>Menu Access</a></li>
          <li><a href="#dietaryManagement" onClick={() => openTab("dietaryManagement")}>Dietary Management</a></li>
          <li><a href="#mealCredits" onClick={() => openTab("mealCredits")}>Meal Credits</a></li>
          <li><a href="#diningReservations" onClick={() => openTab("diningReservations")}>Dining Reservations</a></li>
        </ul>
      </div>

      <div className="tabs">
        <button className={`tab-link ${activeTab === "menuAccess" ? "active" : ""}`} onClick={() => openTab("menuAccess")}>
          Menu Access
        </button>
        <button className={`tab-link ${activeTab === "dietaryManagement" ? "active" : ""}`} onClick={() => openTab("dietaryManagement")}>
          Dietary Management
        </button>
        <button className={`tab-link ${activeTab === "mealCredits" ? "active" : ""}`} onClick={() => openTab("mealCredits")}>
          Meal Credits
        </button>
        <button className={`tab-link ${activeTab === "diningReservations" ? "active" : ""}`} onClick={() => openTab("diningReservations")}>
          Dining Reservations
        </button>
      </div>

      <div className={`tab-content ${activeTab === "dietaryManagement" ? "active" : ""}`}>
        <h2></h2>
        <div className="dietary-management">
          <div className="input-group">
            <label>Choose a preference</label>
            <select value={selectedPreference} onChange={(e) => setSelectedPreference(e.target.value)}>
              <option value="">Select...</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Halal">Halal</option>
            </select>

            <label>Allergens</label>
            <textarea value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="Enter any allergies"></textarea>

            <label>Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter any special notes or description"></textarea>

            {/* Ensure the button always shows, with dynamic label */}
            <button className="add-btn" onClick={handleAddOrUpdatePreference}>
              {editingPreferenceId ? "Update Preference" : "Add Preference"}
            </button>
          </div>

          <div className="preference-list">
            <h3>Your Dietary Preferences</h3>
            {dietaryPreferences.length === 0 ? (
              <p>No dietary preferences found.</p>
            ) : (
              <ul>
                {dietaryPreferences.map((preference) => (
                  <li key={preference.id}>
                    <p><strong>{preference.name}</strong>: {preference.description}</p>
                    <button className="update-btn" onClick={() => handleEditPreference(preference)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeletePreference(preference.id!)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={`feedback-sidebar ${feedbackSidebarVisible ? "visible" : ""}`}>
        <button className="close-feedback-sidebar" onClick={toggleFeedbackSidebar}>
          &times;
        </button>
        <h2>Feedback System</h2>
        <p>Provide your feedback here.</p>
      </div>
    </div>
  );
};

export default Dashboard;











