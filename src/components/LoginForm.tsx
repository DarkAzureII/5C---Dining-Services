import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Assuming you have Firebase initialized
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { postData, updateData } from "../API/MealCredits";

type LoginFormProps = {
  isActive: boolean;
  onCreateAccountClick: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({
  isActive,
  onCreateAccountClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && user.email) {
        const Email = user.email;

        // Check if the user document already exists in Firestore
        const userDocRef = doc(db, "Credits", Email);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // User doesn't exist, create a new document
          await postData(`MealCredits/Create/${Email}`, {
            accountName: "Main Account",
          });

          // Set initial balance as 100 Kudus
          await updateData(`MealCredits/Update/${Email}/Main Account`, {
            amount: 100,
            transactionType: "moneyIn",
            date: new Date().toISOString(),
            isDefault: true,
          });
        }

        navigate("/dashboard");
      } else {
        setError("Failed to retrieve user email");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during Google sign-in");
      }
    }
  };

  return (
    <div
      className={`fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white bg-opacity-80 p-5 rounded-lg shadow-lg w-96 text-center z-10
                     ${isActive ? "block" : "hidden"}`}
    >
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          test-id="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          test-id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2 px-4 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-md shadow hover:bg-gray-100 focus:outline-none transition duration-200"
        >
          <img
            src="https://th.bing.com/th/id/OIP.Din44az7iZZDfbsrD1kfGQHaHa?rs=1&pid=ImgDetMain"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>
        {error && <p className="text-red-500">invalid credentials</p>}
      </form>
      <div className="mt-4">
        <p>
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCreateAccountClick();
            }}
            className="text-blue-900 font-bold hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
