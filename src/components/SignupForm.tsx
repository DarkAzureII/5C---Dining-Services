import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { postData, updateData } from "../API/MealCredits"; // Import postData and updateData

type SignupFormProps = {
  isActive: boolean;
  onAlreadyHaveAccountClick: () => void;
};

const SignupForm: React.FC<SignupFormProps> = ({
  isActive,
  onAlreadyHaveAccountClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // State for success message

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Use email as the document ID, ensuring it's suitable for Firestore
      const userId = user.email; // Using email as the document ID

      // Create account for the user with account name "Main Account"
      await postData(`MealCredits/Create/${userId}`, {
        accountName: "Main Account",
      }); // Use userId as the document ID

      // Set the initial balance to 100 Kudus as a 'moneyIn' transaction
      await updateData(`MealCredits/Update/${userId}/Main Account`, {
        amount: 100,
        transactionType: "moneyIn",
        date: new Date().toISOString(), // Use current date
        isDefault: true, // Set as default if applicable
      });

      setSuccess("Account created successfully!");
      setError(null); // Clear any previous error
      // Optionally navigate to a different page or perform further actions here
    } catch (err: any) {
      setError(err.message);
      setSuccess(null); // Clear any previous success message
    }
  };

  return (
    <div
      className={`fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white bg-opacity-80 p-5 rounded-lg shadow-lg w-96 text-center z-10
                     ${isActive ? "block" : "hidden"}`}
    >
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Sign Up
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}{" "}
        {/* Display success message */}
      </form>
      <div className="mt-4">
        <p>
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onAlreadyHaveAccountClick();
            }}
            className="text-blue-900 font-bold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
