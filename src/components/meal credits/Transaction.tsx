import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { fetchData } from "../../API/MealCredits";

interface Transaction {
  amount: number;
  date: string;
}

const Transaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError(null);

      if (currentUser) {
        try {
          const userId = currentUser.email;
          setUserEmail(userId);

          // Fetch data from the API
          const data = await fetchData(`MealCredits/Retrieve/${userId}`);

          // Find the default account
          const defaultAccount = data.accounts.find(
            (account: any) => account.isDefault
          );

          if (defaultAccount) {
            // Extract the moneyOut transactions
            const moneyOutTransactions = Object.entries(
              defaultAccount.moneyOut || {}
            ).map(([date, amount]) => ({
              date,
              amount: typeof amount === "number" ? amount : parseFloat(amount as string), // Ensure the amount is a number
            }));

            setTransactions(moneyOutTransactions as Transaction[]);
          } else {
            setError("No default account found.");
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setError("Error fetching transactions.");
        }
      } else {
        setError("No user is logged in.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  -{transaction.amount.toFixed(2)} Kudus
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("en-UK")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
