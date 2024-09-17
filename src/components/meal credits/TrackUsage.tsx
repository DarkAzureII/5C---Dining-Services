import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Transaction {
  amount: number;
  date: string;
}

const TrackUsage: React.FC = () => {
  const [moneyInTransactions, setMoneyInTransactions] = useState<Transaction[]>(
    []
  );
  const [moneyOutTransactions, setMoneyOutTransactions] = useState<
    Transaction[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  ); // Default to current month
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterTransactionsByMonth = (
    transactions: Transaction[],
    month: number,
    year: number
  ) => {
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date); // Convert date string back to Date object
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const username = currentUser.email;

          // Fetch "Money In" transactions
          const moneyInDocRef = doc(db, "moneyIn", username || "");
          const moneyInDocSnapshot = await getDoc(moneyInDocRef);

          if (moneyInDocSnapshot.exists()) {
            const moneyInData = moneyInDocSnapshot.data();
            const moneyInAmounts = moneyInData?.Amounts || [];
            const moneyInDates = moneyInData?.Dates || [];

            // Combine amounts and dates for "Money In"
            const loadedMoneyInTransactions = moneyInAmounts.map(
              (amount: number, index: number) => {
                const dateObj = moneyInDates[index]?.toDate();
                const formattedDate = dateObj ? dateObj.toISOString() : ""; // Store the date as ISO string
                return { amount, date: formattedDate };
              }
            );

            // Filter "Money In" transactions by selected month and year
            const filteredMoneyIn = filterTransactionsByMonth(
              loadedMoneyInTransactions,
              selectedMonth,
              selectedYear
            );
            setMoneyInTransactions(filteredMoneyIn);
          } else {
            setError("No Money In transactions found.");
          }

          // Fetch "Money Out" transactions
          const moneyOutDocRef = doc(db, "moneyOut", username || "");
          const moneyOutDocSnapshot = await getDoc(moneyOutDocRef);

          if (moneyOutDocSnapshot.exists()) {
            const moneyOutData = moneyOutDocSnapshot.data();
            const moneyOutAmounts = moneyOutData?.Amounts || [];
            const moneyOutDates = moneyOutData?.Dates || [];

            // Combine amounts and dates for "Money Out"
            const loadedMoneyOutTransactions = moneyOutAmounts.map(
              (amount: number, index: number) => {
                const dateObj = moneyOutDates[index]?.toDate();
                const formattedDate = dateObj ? dateObj.toISOString() : ""; // Store the date as ISO string
                return { amount, date: formattedDate };
              }
            );

            // Filter "Money Out" transactions by selected month and year
            const filteredMoneyOut = filterTransactionsByMonth(
              loadedMoneyOutTransactions,
              selectedMonth,
              selectedYear
            );
            setMoneyOutTransactions(filteredMoneyOut);
          } else {
            setError("No Money Out transactions found.");
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
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Track Usage</h2>

      {/* Month and Year Selection */}
      <div className="flex space-x-4 my-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border p-2"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2"
        />
      </div>

      {/* Money In Section */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">
          Money In - {selectedMonth}/{selectedYear}
        </h3>
        <div className="mt-2">
          {moneyInTransactions.length > 0 ? (
            moneyInTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{`Transaction ${index + 1}`}</span>
                <span>{transaction.amount.toFixed(2)} Kudus</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>No Money In transactions for this month.</p>
          )}
        </div>
      </div>

      {/* Money Out Section */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">
          Money Out - {selectedMonth}/{selectedYear}
        </h3>
        <div className="mt-2">
          {moneyOutTransactions.length > 0 ? (
            moneyOutTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{`Expense ${index + 1}`}</span>
                <span>{transaction.amount.toFixed(2)} Kudus</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>No Money Out transactions for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackUsage;
