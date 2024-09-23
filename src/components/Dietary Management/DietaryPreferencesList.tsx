import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";

interface DietaryPreference {
  id?: string;
  type: string;
  addNotes?: string;
  allergens?: string;
  userID?: string;
}

const DietaryPreferencesList: React.FC = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [message, setMessage] = useState<string | null>(null); 
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const userId = auth.currentUser?.email || ""; // Get the current user's email
  const preferencesCollectionRef = collection(db, "dietaryManagement");

  // Fetch preferences for the logged-in user
  const getPreferences = async () => {
    try {
      const q = query(preferencesCollectionRef, where("userID", "==", userId)); // Query by userId
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

  // Display a message for a short period
  const displayMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  // Handle deletion of a preference
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

  // Handle editing a preference (placeholder logic)
  const handleEditPreference = (preference: DietaryPreference) => {
    // Logic to handle editing could be added here
    console.log("Editing preference", preference);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner w-full mt-6">
      {message && (
        <div
          className={`p-4 mb-4 text-white ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } rounded`}
        >
          {message}
        </div>
      )}

      {dietaryPreferences.length === 0 ? (
        <p>No dietary preferences found.</p>
      ) : (
        <ul>
          {dietaryPreferences.map((preference) => (
            <li
              key={preference.id}
              className="mb-4 p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{preference.type}</p>
                  <p className="text-gray-600">{preference.addNotes}</p>
                  <p className="text-gray-600">
                    Allergies: {preference.allergens || "None"}
                  </p>
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
  );
};

export default DietaryPreferencesList;
