import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from "../../firebaseConfig"; 

interface DietaryPreference {
  id?: string;
  type: string;
  addNotes?: string;
  allergens?: string; 
  userID?: string;
}

const API_BASE_URL = 'https://appdietary-appdietary-xu5p2zrq7a-uc.a.run.app/DietaryManagement';

const DietaryManagement: React.FC = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [selectedPreference, setSelectedPreference] = useState("");
  const [description, setDescription] = useState("");
  const [allergies, setAllergies] = useState<string>(""); 
  const [editingPreferenceId, setEditingPreferenceId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  // Fetch the current user's email from Firebase Auth
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.email);
      } else {
        setUserId(null); // User is not logged in
      }
    });
    return () => unsubscribe(); // Clean up the subscription
  }, []);

  // Fetch preferences from the API when the user is authenticated
  const getPreferences = async () => {
    if (!userId) return; // Exit if no user ID

    try {
      const response = await axios.get(API_BASE_URL, { params: { userID: userId } });
      const preferencesData = response.data as DietaryPreference[];
      setDietaryPreferences(preferencesData);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getPreferences(); // Fetch preferences when user is available
    }
  }, [userId]);

  // Function to handle success or error message display
  const displayMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000); // Clear message after 3 seconds
  };

  // Validate and format the allergies input before saving it
  const validateAllergies = (allergies: string): string => {
    // Remove leading/trailing spaces and extra commas, enforce valid allergy format
    const cleanedAllergies = allergies
      .split(',')
      .map((allergy) => allergy.trim()) // Trim spaces around each word
      .filter((allergy) => allergy.length > 0) // Remove empty entries
      .join(', '); // Rejoin as a clean, comma-separated string

    // Ensure only letters and commas are allowed (you can adjust this regex if needed)
    const validCharacters = /^[a-zA-Z\s,]+$/;
    if (!validCharacters.test(cleanedAllergies)) {
      displayMessage("Please enter only valid allergy names (letters and commas).", "error");
      return ""; // Return empty string if invalid
    }

    return cleanedAllergies;
  };

  const handleAddOrUpdatePreference = async () => {
    if (!userId) {
      displayMessage("User is not authenticated.", "error");
      return;
    }

    // Validate the allergies string
    const cleanedAllergies = validateAllergies(allergies);
    if (!cleanedAllergies) {
      return; // Stop if validation failed
    }

    // Check if user already has a dietary preference
    const existingPreference = dietaryPreferences.find(
      (preference) => preference.userID === userId
    );

    // If the user has a preference and is not editing, show an error message
    if (existingPreference && !editingPreferenceId) {
      displayMessage("You already have a dietary preference. Please update it instead of adding a new one.", "error");
      return;
    }

    try {
      const newPreference = { userID: userId, type: selectedPreference, addNotes: description, allergens: cleanedAllergies };

      if (editingPreferenceId) {
        // Update existing preference
        await axios.put(`${API_BASE_URL}/${editingPreferenceId}`, newPreference);
        displayMessage("Preference updated successfully!", "success");
      } else {
        // Add new preference
        await axios.post(API_BASE_URL, newPreference);
        displayMessage("Preference added successfully!", "success");
      }

      // Refresh preferences and reset form fields
      getPreferences();
      setSelectedPreference("");
      setDescription("");
      setAllergies(""); // Reset allergies
      setEditingPreferenceId(null);
    } catch (error) {
      displayMessage("An error occurred. Please try again.", "error");
    }
  };

  const handleDeletePreference = async (preferenceId: string) => {
    try {
      // Optimistically update the preferences list before the API call
      setDietaryPreferences((prevPreferences) =>
        prevPreferences.filter((preference) => preference.id !== preferenceId)
      );

      // Now perform the delete operation
      await axios.delete(`${API_BASE_URL}/${preferenceId}`);
      
      displayMessage("Preference deleted successfully!", "success");

      // Re-fetch preferences to ensure the local state is in sync with the server
      getPreferences(); 
    } catch (error) {
      displayMessage("Failed to delete preference. Please try again.", "error");
      // If there is an error, refetch the preferences to recover the correct state
      getPreferences();
    }
  };

  const handleEditPreference = (preference: DietaryPreference) => {
    setSelectedPreference(preference.type);
    setDescription(preference.addNotes || "");
    setAllergies(preference.allergens || ""); // Set the allergies string
    setEditingPreferenceId(preference.id || null);
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
      {message && (
        <div className={`p-4 mb-4 text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded`}>
          {message}
        </div>
      )}

      <div className="flex justify-between space-x-6">
        {/* Left: Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner w-1/2">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Choose a preference</label>
            <select value={selectedPreference} onChange={(e) => setSelectedPreference(e.target.value)} className="block w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select...</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Halal">Halal</option>
            </select>
          </div>

          {/* Allergies Box */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Allergies (comma separated)</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)} // Store allergies as a string
              placeholder="Enter allergies, separated by commas(Type 'None' if you do not have any)"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          {/* Description Box */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter any special notes or description"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <button onClick={handleAddOrUpdatePreference} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            {editingPreferenceId ? "Update Preference" : "Add Preference"}
          </button>
        </div>

        {/* Right: List of dietary preferences */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner w-1/2">
          {dietaryPreferences.length === 0 ? (
            <p className="text-center">No dietary preferences found.</p>
          ) : (
            <ul>
              {dietaryPreferences.map((preference) => (
                <li key={preference.id} className="mb-4 p-6 bg-white rounded-lg shadow-md">
                  <div className="flex flex-col text-left">
                    <div>
                      <p className="font-semibold text-lg">Preference: {preference.type}</p>
                      <p className="font-semibold text-lg">Allergies: {preference.allergens || "None"}</p>
                      <p className="font-semibold text-lg">Additional Notes: {preference.addNotes || "None"}</p>
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button onClick={() => handleEditPreference(preference)} className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDeletePreference(preference.id!)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietaryManagement;
