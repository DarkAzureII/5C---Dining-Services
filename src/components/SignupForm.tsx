import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { postData, updateData } from "../API/MealCredits";

type SignupFormProps = {
  isActive: boolean;
  onAlreadyHaveAccountClick: () => void; // Existing prop for toggling to login
  onToggle: () => void; // New prop for toggling between forms
};

const SignupForm: React.FC<SignupFormProps> = ({
  isActive,
  onAlreadyHaveAccountClick,
  onToggle, // Destructure the new onToggle prop
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

      const userId = user.email;

      await postData(`MealCredits/Create/${userId}`, {
        accountName: "Main Account",
      });

      await updateData(`MealCredits/Update/${userId}/Main Account`, {
        amount: 100,
        transactionType: "moneyIn",
        date: new Date().toISOString(),
        isDefault: true,
      });

      setSuccess("Account created successfully!");
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-white bg-opacity-90 p-3 rounded-md shadow-md 
                  w-full max-w-xs text-center z-10 sm:max-w-sm md:max-w-md
                  ${isActive ? "block" : "hidden"}`}
    >
      <h2 className="text-lg font-semibold mb-2 sm:text-xl">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          test-id="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        />
        <input
          test-id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        />
        <input
          test-id="confirm-password-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        />
        <button
          type="submit"
          className="w-full py-1 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          Sign Up
        </button>
        {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
        {success && <p className="text-green-500 text-xs sm:text-sm">{success}</p>}
      </form>
      <div className="mt-2">
        <p className="text-xs sm:text-sm">
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
