import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { fetchData } from "../../API/MealCredits"; // Assuming your API methods are in API.ts

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

  const filterTransactionsByMonth = (
    transactions: Transaction[],
    month: number,
    year: number
  ) => {
    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userId = currentUser.email;

          // Fetch data from API
          const data = await fetchData(`MealCredits/Retrieve/${userId}`);

          // Find the default account
          const defaultAccount = data.accounts.find(
            (account: any) => account.isDefault === true
          );

          if (defaultAccount) {
            // Extract moneyIn and moneyOut from the default account
            const moneyInTransactions: Transaction[] = defaultAccount.moneyIn || [];
            const moneyOutTransactions: Transaction[] = defaultAccount.moneyOut || [];

            // Filter transactions by selected month and year
            const filteredMoneyIn = filterTransactionsByMonth(
              moneyInTransactions,
              selectedMonth,
              selectedYear
            );
            const filteredMoneyOut = filterTransactionsByMonth(
              moneyOutTransactions,
              selectedMonth,
              selectedYear
            );

            setMoneyInTransactions(filteredMoneyIn);
            setMoneyOutTransactions(filteredMoneyOut);
          } else {
            console.error("No default account found.");
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      } else {
        console.error("No user is currently authenticated.");
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [selectedMonth, selectedYear]);

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
          data-testid="year-input"
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

      {loading && <p>Loading transactions...</p>}
    </div>
  );
};

export default TrackUsage;
