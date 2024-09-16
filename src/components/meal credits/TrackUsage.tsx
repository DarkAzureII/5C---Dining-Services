import React from "react";

const TrackUsage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Track Usage</h2>
      <p>Content for Tracking Usage.</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Monthly Transactions</h3>
        <div className="mt-2">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Money In</span>
            <span className="font-medium">Amount</span>
          </div>
          {/* Repeat this block for each transaction */}
          <div className="flex justify-between py-2">
            <span>Example Transaction 1</span>
            <span>$50.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Example Transaction 2</span>
            <span>$30.00</span>
          </div>
          {/* Add more transactions here */}
        </div>
        <div className="mt-4">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Money Out</span>
            <span className="font-medium">Amount</span>
          </div>
          {/* Repeat this block for each transaction */}
          <div className="flex justify-between py-2">
            <span>Example Expense 1</span>
            <span>$20.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Example Expense 2</span>
            <span>$15.00</span>
          </div>
          {/* Add more expenses here */}
        </div>
      </div>
    </div>
  );
};

export default TrackUsage;
