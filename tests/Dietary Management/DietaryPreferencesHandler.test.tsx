import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { vi, it, describe,expect, beforeEach } from "vitest";
import axios from "axios";

// Mock axios
const mockAxios = new MockAdapter(axios);

// Mock API Base URL
const API_BASE_URL = 'https://appdietary-appdietary-xu5p2zrq7a-uc.a.run.app/DietaryManagement';

// Mock side effect functions
const displayMessage = vi.fn();
const getPreferences = vi.fn();
const setSelectedPreference = vi.fn();
const setDescription = vi.fn();
const setAllergies = vi.fn();
const setEditingPreferenceId = vi.fn();

// Function under test
async function handleSubmit({
  userId,
  selectedPreference,
  description,
  cleanedAllergies,
  editingPreferenceId,
}) {
  try {
    const newPreference = {
      userID: userId,
      type: selectedPreference,
      addNotes: description,
      allergens: cleanedAllergies,
    };

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
}

describe('Preference Form Submission', () => {
  beforeEach(() => {
    // Reset mocks
    mockAxios.reset();
    vi.clearAllMocks();
  });

  it('should update an existing preference', async () => {
    const userId = 'user123';
    const editingPreferenceId = 'pref123';
    const selectedPreference = 'Vegan';
    const description = 'No meat products';
    const cleanedAllergies = 'None';

    // Mock successful response for PUT request
    mockAxios.onPut(`${API_BASE_URL}/${editingPreferenceId}`).reply(200);

    // Call the function
    await handleSubmit({
      userId,
      selectedPreference,
      description,
      cleanedAllergies,
      editingPreferenceId,
    });

    // Assert that the PUT request was made with correct data
    expect(mockAxios.history.put.length).toBe(1);
    expect(mockAxios.history.put[0].url).toBe(`${API_BASE_URL}/${editingPreferenceId}`);
    expect(mockAxios.history.put[0].data).toEqual(
      JSON.stringify({
        userID: userId,
        type: selectedPreference,
        addNotes: description,
        allergens: cleanedAllergies,
      })
    );

    // Assert that side effects are called
    expect(displayMessage).toHaveBeenCalledWith("Preference updated successfully!", "success");
    expect(getPreferences).toHaveBeenCalled();
    expect(setSelectedPreference).toHaveBeenCalledWith("");
    expect(setDescription).toHaveBeenCalledWith("");
    expect(setAllergies).toHaveBeenCalledWith("");
    expect(setEditingPreferenceId).toHaveBeenCalledWith(null);
  });

  it('should add a new preference', async () => {
    const userId = 'user123';
    const selectedPreference = 'Vegan';
    const description = 'No meat products';
    const cleanedAllergies = 'None';

    // Mock successful response for POST request
    mockAxios.onPost(API_BASE_URL).reply(200);

    // Call the function without editingPreferenceId
    await handleSubmit({
      userId,
      selectedPreference,
      description,
      cleanedAllergies,
      editingPreferenceId: null,
    });

    // Assert that the POST request was made with correct data
    expect(mockAxios.history.post.length).toBe(1);
    expect(mockAxios.history.post[0].url).toBe(API_BASE_URL);
    expect(mockAxios.history.post[0].data).toEqual(
      JSON.stringify({
        userID: userId,
        type: selectedPreference,
        addNotes: description,
        allergens: cleanedAllergies,
      })
    );

    // Assert that side effects are called
    expect(displayMessage).toHaveBeenCalledWith("Preference added successfully!", "success");
    expect(getPreferences).toHaveBeenCalled();
    expect(setSelectedPreference).toHaveBeenCalledWith("");
    expect(setDescription).toHaveBeenCalledWith("");
    expect(setAllergies).toHaveBeenCalledWith("");
    expect(setEditingPreferenceId).toHaveBeenCalledWith(null);
  });

  it('should handle errors during preference submission', async () => {
    const userId = 'user123';
    const selectedPreference = 'Vegan';
    const description = 'No meat products';
    const cleanedAllergies = 'None';

    // Mock failed response for POST request
    mockAxios.onPost(API_BASE_URL).reply(500);

    // Call the function
    await handleSubmit({
      userId,
      selectedPreference,
      description,
      cleanedAllergies,
      editingPreferenceId: null,
    });

    // Assert that error message is displayed
    expect(displayMessage).toHaveBeenCalledWith("An error occurred. Please try again.", "error");

    // Ensure no state updates are called when there's an error
    expect(getPreferences).not.toHaveBeenCalled();
    expect(setSelectedPreference).not.toHaveBeenCalled();
    expect(setDescription).not.toHaveBeenCalled();
    expect(setAllergies).not.toHaveBeenCalled();
    expect(setEditingPreferenceId).not.toHaveBeenCalled();
  });
});