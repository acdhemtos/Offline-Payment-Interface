import { useEffect, useRef } from "react";
import { loadTransactions, renderTransactions } from "../utils/transactions";
import { useNavigate } from "react-router-dom";

const TransactionHistory = () => {
  const transactionsDiv = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions().then(() => {
      if (transactionsDiv.current) {
        renderTransactions(transactionsDiv.current);
      }
    });
  }, []);

  return (
    <div className="min-h-screen min-w-[100vw] bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full bg-transparent text-white text-center py-4  relative">
        <button
          className="absolute left-1 top-1 bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </header>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg mt-6 p-4">
        <h2 className="text-xl font-semibold mb-4">Your Transactions</h2>
        <div
          ref={transactionsDiv}
          className="transactions-container divide-y divide-gray-200"
        ></div>
      </div>
    </div>
  );
};

export default TransactionHistory;
