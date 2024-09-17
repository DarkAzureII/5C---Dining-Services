import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

interface Account {
  name: string;
  balance: number;
}

const BalanceTab: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccountName, setNewAccountName] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch current user's accounts from Firestore
  useEffect(() => {
    const fetchAccounts = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        setUserEmail(currentUser.email);

        const userDocRef = doc(db, "mealCredits", currentUser.email);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setAccounts(userData.accounts || []);
        }
      }
    };

    fetchAccounts();
  }, []);

  // Function to handle adding a new account
  const handleAddAccount = async () => {
    if (newAccountName.trim() && userEmail) {
      const userDocRef = doc(db, "mealCredits", userEmail);
      const userDocSnapshot = await getDoc(userDocRef);

      // If user document doesn't exist, create it with the new account
      if (!userDocSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: userEmail,
          accounts: [{ name: newAccountName, balance: 0.0 }]
        });
      } else {
        // If the document exists, update the accounts array
        await updateDoc(userDocRef, {
          accounts: arrayUnion({ name: newAccountName, balance: 0.0 })
        });
      }

      // Update local state
      setAccounts((prevAccounts) => [
        ...prevAccounts,
        { name: newAccountName, balance: 0.0 }
      ]);

      setNewAccountName(""); // Clear input after adding
    }
  };

  // Function to handle deleting an account
  const handleDeleteAccount = async (index: number) => {
    if (userEmail) {
      const userDocRef = doc(db, "mealCredits", userEmail);

      // Get the current document
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedAccounts = userData.accounts.filter((_: Account, i: number) => i !== index);

        // Update the document with the filtered accounts array
        await updateDoc(userDocRef, {
          accounts: updatedAccounts
        });

        // Update local state
        setAccounts(updatedAccounts);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Balance</h2>

      {/* Display list of accounts with balance */}
      <div className="mt-4">
        {accounts.length === 0 ? (
          <p>No accounts available. Add a new account to get started.</p>
        ) : (
          <ul className="space-y-4">
            {accounts.map((account, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white shadow-md p-4 rounded relative"
              >
                <div className="flex items-center">
                  {/* Three dots button */}
                  <button
                    onClick={() =>
                      setDropdownVisible(dropdownVisible === index ? null : index)
                    }
                    className="mr-4 focus:outline-none"
                  >
                    &#x22EE; {/* Vertical ellipsis (three dots) */}
                  </button>

                  {/* Account name */}
                  <span className="font-semibold">{account.name}</span>
                </div>

                {/* Account balance */}
                <span>{account.balance.toFixed(2)} Kudus</span>

                {/* Dropdown menu for delete option */}
                {dropdownVisible === index && (
                  <div className="absolute top-full left-0 bg-white border shadow-md rounded mt-2 w-32 z-10">
                    <button
                      onClick={() => handleDeleteAccount(index)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add account form */}
      <div className="mt-8">
        <input
          type="text"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          placeholder="Account Name"
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAddAccount}
          className="ml-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Add Account
        </button>
      </div>
    </div>
  );
};

export default BalanceTab;
