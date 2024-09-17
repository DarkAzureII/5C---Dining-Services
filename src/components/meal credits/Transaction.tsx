import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Transaction {
  amount: number;
  date: string;
}

interface TransactionProps {
  transactions: Transaction[];
}

const Transaction: React.FC<TransactionProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          setUserEmail(currentUser.email);

          // Use currentUser.email if that's how you reference the document in Firestore
          const userDocRef = doc(db, "moneyOut", currentUser.email!);

          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            console.log("Fetched data:", userData); // Correct variable name

            const amounts = userData?.Amounts || [];
            const dates = userData?.Dates || [];

            // Combine amounts and dates into transactions
            const loadedTransactions = amounts.map((amount: number, index: number) => {
              const dateObj = dates[index]?.toDate(); // Convert Firestore Timestamp to JavaScript Date
              const formattedDate = dateObj ? dateObj.toLocaleDateString("en-UK") : ""; // Format the date
              
              return {
                amount,
                date: formattedDate, // Use the formatted date string
              };
            });

            setTransactions(loadedTransactions);
          } else {
            console.log("No such document!");
            setError("No transactions found.");
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setError("Error fetching transactions.");
        }
      } else {
        setError("No user is logged in.");
      }
      setLoading(false);
    };

    fetchTransactions();
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
                  {transaction.date}
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
