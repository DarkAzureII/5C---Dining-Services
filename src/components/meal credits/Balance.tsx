import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

interface Account {
  name: string;
  balance: number;
}

const BalanceTab: React.FC = () => {
  const [user, setUser] = useState<any | null>(null); // `any` type can be used for user object
  const [accounts, setAccounts] = useState<string[]>([]); // Stores account names
  const [balances, setBalances] = useState<number[]>([]); // Stores corresponding balances
  const [newAccountName, setNewAccountName] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null); // To manage which account's dropdown is visible
  const [defaultAccountIndex, setDefaultAccountIndex] = useState<number | null>(null); // Track default account

  // Fetch the authenticated user and their accounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userRef = db.collection("mealCredits").doc(user.email);
          const doc = await userRef.get();

          if (doc.exists) {
            const userData = doc.data();
            if (userData && userData.accounts && userData.balances) {
              setAccounts(userData.accounts); // Set accounts from Firestore
              setBalances(userData.balances); // Set balances from Firestore
            }
          } else {
            console.error("User not found in the mealCredits collection.");
          }
        } catch (error) {
          console.error("Error fetching user accounts:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddAccount = async () => {
    if (!user) {
      console.error("No user is authenticated");
      return;
    }

    if (newAccountName.trim()) {
      try {
        const userRef = db.collection("mealCredits").doc(user.email);
        const doc = await userRef.get();

        if (doc.exists) {
          // User exists, update the accounts and balances arrays
          const existingData = doc.data();
          const updatedAccounts = [...existingData.accounts, newAccountName]; // Add new account
          const updatedBalances = [...existingData.balances, 0.0]; // Add corresponding balance

          // Update the document with the new accounts and balances
          await userRef.update({
            accounts: updatedAccounts,
            balances: updatedBalances,
          });

          // Update local state
          setAccounts(updatedAccounts);
          setBalances(updatedBalances);
        } else {
          console.error("User not found in the mealCredits collection.");
        }

        // Clear input after adding
        setNewAccountName("");
      } catch (error) {
        console.error("Error adding account:", error);
      }
    }
  };

  const handleDeleteAccount = async (index: number) => {
    const updatedAccounts = accounts.filter((_, i) => i !== index);
    const updatedBalances = balances.filter((_, i) => i !== index);
    setAccounts(updatedAccounts);
    setBalances(updatedBalances);

    if (user) {
      const userRef = db.collection("mealCredits").doc(user.email);
      try {
        await userRef.update({
          accounts: updatedAccounts,
          balances: updatedBalances,
        });
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }

    // If the deleted account was the default, reset default
    if (defaultAccountIndex === index) {
      setDefaultAccountIndex(null);
    }
  };

  const handleSetDefaultAccount = (index: number) => {
    setDefaultAccountIndex(index);
    setDropdownVisible(null); // Close dropdown after setting default
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

                  {/* Account name with default tag */}
                  <span className="font-semibold">
                    {account}{" "}
                    {defaultAccountIndex === index && <span>(Default)</span>}
                  </span>
                </div>

                {/* Account balance */}
                <span>{balances[index]?.toFixed(2)} Kudus</span>

                {/* Dropdown menu for options (delete, set as default) */}
                {dropdownVisible === index && (
                  <div className="absolute top-full left-0 bg-white border shadow-md rounded mt-2 w-32 z-10">
                    <button
                      onClick={() => handleDeleteAccount(index)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSetDefaultAccount(index)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Set as Default
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
