import { motion } from "framer-motion";

const StatusDisplay = ({ status, message, bgColor = "bg-green-500" }) => (
  <motion.div
    className={`flex flex-col items-center justify-center flex-1 w-full mt-24`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, type: "spring" }}
  >
    <div className={`text-2xl font-bold mb-4 text-white px-8 py-4 rounded-lg ${bgColor}`}>
      {status}
    </div>
    <div className="text-base text-center">{message}</div>
  </motion.div>
);

export default StatusDisplay;