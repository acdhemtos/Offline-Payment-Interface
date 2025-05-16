import { motion } from "framer-motion";

const circleLength = 2 * Math.PI * 36;

const Tick = ({ color = "#22c55e", size = 60 }) => (
  <motion.div
    className="flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, type: "spring" }}
  >
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className="block"
    >
      {/* Colored circle */}
      <circle
        cx="40"
        cy="40"
        r="36"
        fill={color}
        stroke="none"
      />
      {/* Animated white border */}
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeDasharray={circleLength}
        strokeDashoffset={circleLength}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Tick */}
      <motion.polyline
        points="28,42 38,52 54,34"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={40}
        strokeDashoffset={40}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
      />
    </motion.svg>
  </motion.div>
);

export default Tick;