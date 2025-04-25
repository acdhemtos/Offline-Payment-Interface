import { FiArrowLeft } from "react-icons/fi";

export default function TransactionList() {
  const transactions = [
    { id: 1, title: "Starbucks", amount: "-$5.50", date: "Apr 20, 2025" },
    { id: 2, title: "Salary", amount: "+$2,500.00", date: "Apr 18, 2025" },
    { id: 3, title: "Amazon", amount: "-$120.00", date: "Apr 17, 2025" },
  ];

  const goBack = () => {
    window.location.hash = "=1";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] p-4 text-white relative">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition"
      >
        <FiArrowLeft className="h-5 w-5" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>

      <div className="grid gap-4">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl flex justify-between items-center"
          >
            <div>
              <h2 className="text-base font-medium">{txn.title}</h2>
              <p className="text-sm text-white/70">{txn.date}</p>
            </div>
            <span
              className={`text-lg font-semibold ${
                txn.amount.startsWith("-") ? "text-red-400" : "text-green-400"
              }`}
            >
              {txn.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
