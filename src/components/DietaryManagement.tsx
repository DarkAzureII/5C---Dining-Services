import React, { useState } from 'react';
import { auth } from "../firebaseConfig";
//import { getDietaryPreferences, addDietaryPreference, deleteDietaryPreference, updateDietaryPreference } from "../api/dietaryAPI";

interface DietaryPreference {
  id?: string;
  name: string;
  description?: string;
  lastUpdated?: string;
}

const DietaryManagement: React.FC = () => {
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([
    { id: "1", name: "Vegan", description: "No animal products" },
    { id: "2", name: "Gluten-Free", description: "Avoid gluten" },
    { id: "3", name: "Halal", description: "Meat prepared according to Islamic law" },
  ]);

  const [selectedPreference, setSelectedPreference] = useState("");
  const [allergens, setAllergens] = useState("");
  const [description, setDescription] = useState("");
  const [editingPreferenceId, setEditingPreferenceId] = useState<string | null>(null);

  const userId = "U5JzTbGdubTbTlXqztOriSZHaJJ3"; // Replace with actual logged-in user ID

  const handleAddOrUpdatePreference = async () => {
    if (editingPreferenceId) {
      const updatedPreferences = dietaryPreferences.map((preference) =>
        preference.id === editingPreferenceId
          ? { ...preference, name: selectedPreference, description }
          : preference
      );
      setDietaryPreferences(updatedPreferences);
    } else {
      const newPreference: DietaryPreference = { id: `${Math.random()}`, name: selectedPreference, description };
      setDietaryPreferences([...dietaryPreferences, newPreference]);
    }

    setSelectedPreference("");
    setAllergens("");
    setDescription("");
    setEditingPreferenceId(null);
  };

  const handleDeletePreference = async (preferenceId: string) => {
    const updatedPreferences = dietaryPreferences.filter((preference) => preference.id !== preferenceId);
    setDietaryPreferences(updatedPreferences);
  };

  const handleEditPreference = (preference: DietaryPreference) => {
    setSelectedPreference(preference.name);
    setDescription(preference.description || "");
    setEditingPreferenceId(preference.id || null);
  };

  return (
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
  );
}

export default DietaryManagement;