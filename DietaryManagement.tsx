import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebaseConfig"; // Assuming db is initialized Firebase Firestore instance
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore"; 

interface DietaryPreference {
  id?: string;
  type: string;
  addNotes?: string;
  allergens?: string;
  userID?: string;
}

const DietaryManagement: React.FC = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [selectedPreference, setSelectedPreference] = useState("");
  const [description, setDescription] = useState("");
  const [allergies, setAllergies] = useState("");
  const [editingPreferenceId, setEditingPreferenceId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // State to display success or error messages
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null); // Message type

  const userId = auth.currentUser?.email || ""; // Get the current user's email

  // Firestore Collection reference
  const preferencesCollectionRef = collection(db, "dietaryManagement");

  // Fetch preferences from Firestore
  const getPreferences = async () => {
    try {
      const q = query(preferencesCollectionRef, where("userID", "==", userId)); // Only fetch preferences for the logged-in user
      const data = await getDocs(q);
      const preferencesData = data.docs.map(doc => ({ ...doc.data(), id: doc.id })) as DietaryPreference[];
      setDietaryPreferences(preferencesData);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useEffect(() => {
    getPreferences(); // Fetch preferences on component mount
  }, []);

  // Function to handle success or error message display
  const displayMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000); // Clear message after 3 seconds
  };

  const handleAddOrUpdatePreference = async () => {
    try {
      if (editingPreferenceId) {
        const preferenceDoc = doc(db, "dietaryManagement", editingPreferenceId);
        await updateDoc(preferenceDoc, {
          type: selectedPreference,
          addNotes: description,
          allergens: allergies,
          userID: userId,
        });
        displayMessage("Preference updated successfully!", "success");
      } else {
        await addDoc(preferencesCollectionRef, {
          type: selectedPreference,
          addNotes: description,
          allergens: allergies,
          userID: userId,
        });
        displayMessage("Preference added successfully!", "success");
      }

      // Refresh preferences and reset form fields
      getPreferences();
      setSelectedPreference("");
      setDescription("");
      setAllergies("");
      setEditingPreferenceId(null);
    } catch (error) {
      displayMessage("An error occurred. Please try again.", "error");
    }
  };

  const handleDeletePreference = async (preferenceId: string) => {
    try {
      const preferenceDoc = doc(db, "dietaryManagement", preferenceId);
      await deleteDoc(preferenceDoc);
      getPreferences(); // Refresh the preferences list after deleting
      displayMessage("Preference deleted successfully!", "success");
    } catch (error) {
      displayMessage("Failed to delete preference. Please try again.", "error");
    }
  };

  const handleEditPreference = (preference: DietaryPreference) => {
    // Populate form with the selected preference data
    setSelectedPreference(preference.type);
    setDescription(preference.addNotes || "");
    setAllergies(preference.allergens || "");
    setEditingPreferenceId(preference.id || null);
  };

  return (
    <div className="container mx-auto p-2 bg-white rounded-lg shadow-md" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
      {/* Display success or error message */}
      {message && (
        <div className={`p-4 mb-4 text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded`}>
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Left: Form for adding or updating preferences */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner w-full md:w-1/2">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Choose a preference</label>
            <select 
              value={selectedPreference} 
              onChange={(e) => setSelectedPreference(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Halal">Halal</option>
            </select>
          </div>

          {/* Allergies Box */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Allergies </label>
            <textarea 
              value={allergies} 
              onChange={(e) => setAllergies(e.target.value)} 
              placeholder="Enter any allergies"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description (optional)</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter any special notes or description"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button 
            onClick={handleAddOrUpdatePreference}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {editingPreferenceId ? "Update Preference" : "Add Preference"}
          </button>
        </div>

        {/* Right: List of dietary preferences */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner w-full md:w-1/2">
          {dietaryPreferences.length === 0 ? (
            <p>No dietary preferences found.</p>
          ) : (
            <ul>
              {dietaryPreferences.map((preference) => (
                <li key={preference.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{preference.type}</p>
                      <p className="text-gray-600">{preference.addNotes}</p>
                      <p className="text-gray-600">Allergies: {preference.allergens || "None"}</p>
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleEditPreference(preference)} 
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePreference(preference.id!)} 
                        className="text-red-500 hover:underline"
                      >
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
}

export default DietaryManagement;











