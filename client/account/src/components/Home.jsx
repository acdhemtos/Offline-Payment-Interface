import BottomBar from "./BottomBar";
import { motion } from "framer-motion";

const Home = () => {
  const transactionHistory = [
    { id: 1, name: "John Doe", amount: 500, type: "Sent" },
    { id: 2, name: "Alice Smith", amount: 250, type: "Received" },
    { id: 3, name: "Bob Johnson", amount: 100, type: "Sent" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 w-full">
      {/* Header Section */}
      <header className="p-4 bg-blue-600 text-white text-xl font-semibold shadow-md text-center w-full">
        Transaction History
      </header>

      {/* Search Bar */}
      <div className="p-4 w-full">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg text-lg shadow-sm"
          placeholder="Search transactions..."
        />
      </div>

      {/* Transaction History Section */}
      <section className="flex-1 overflow-y-auto p-4 w-full">
        <ul className="space-y-3">
          {transactionHistory.map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                item.type === "Sent" ? "bg-red-200" : "bg-green-200"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">{item.name}</span>
                <span className="text-sm text-gray-600">{item.type}</span>
              </div>
              <span className="font-bold text-lg text-gray-800">
                {item.amount} ₹
              </span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Bottom Bar */}
      <BottomBar />
    </div>
  );
};

export default Home;
