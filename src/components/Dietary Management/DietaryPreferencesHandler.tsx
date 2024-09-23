import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import DietaryPreferencesList from "./DietaryPreferencesList";

interface DietaryPreference {
  id?: string;
  type: string;
  addNotes?: string;
  allergens?: string;
  userID?: string;
}

const DietaryPreferencesHandler: React.FC = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [selectedPreference, setSelectedPreference] = useState("");
  const [description, setDescription] = useState("");
  const [allergies, setAllergies] = useState("");
  const [editingPreferenceId, setEditingPreferenceId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // State to display success or error messages
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null); // Message type

  const userId = auth.currentUser?.email || ""; // Get the current user's email
  const preferencesCollectionRef = collection(db, "dietaryManagement");

  const getPreferences = async () => {
    try {
      const q = query(preferencesCollectionRef, where("userID", "==", userId)); // Fetch for logged-in user
      const data = await getDocs(q);
      const preferencesData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as DietaryPreference[];
      setDietaryPreferences(preferencesData);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useEffect(() => {
    getPreferences(); // Fetch preferences on mount
  }, []);

  const displayMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
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

      // Reset fields
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
      getPreferences(); // Refresh preferences
      displayMessage("Preference deleted successfully!", "success");
    } catch (error) {
      displayMessage("Failed to delete preference. Please try again.", "error");
    }
  };

  const handleEditPreference = (preference: DietaryPreference) => {
    setSelectedPreference(preference.type);
    setDescription(preference.addNotes || "");
    setAllergies(preference.allergens || "");
    setEditingPreferenceId(preference.id || null);
  };

  return (
    <div className="container mx-auto p-2 bg-white rounded-lg shadow-md">
      {message && (
        <div
          className={`p-4 mb-4 text-white ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } rounded`}
        >
          {message}
        </div>
      )}

      {/* Form for adding/updating preferences */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner w-full">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Choose a preference</label>
          <select
            value={selectedPreference}
            onChange={(e) => setSelectedPreference(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select...</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Halal">Halal</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Allergies</label>
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Enter any allergies"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter any special notes"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <button
          onClick={handleAddOrUpdatePreference}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {editingPreferenceId ? "Update Preference" : "Add Preference"}
        </button>
      </div>

      
    </div>
  );
};

export default DietaryPreferencesHandler;
