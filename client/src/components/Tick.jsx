import { motion } from "framer-motion";

const radius = 36;
const strokeWidth = 5;
const circleLength = 2 * Math.PI * radius;

const Tick = ({ color = "#22c55e", size = 60 }) => (
  <motion.div
    className="flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className="block"
    >
      {/* Background circle */}
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill={color}
        stroke="none"
      />

      {/* Animated ring draw */}
      <motion.circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeDasharray={circleLength}
        strokeDashoffset={circleLength}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      />

      {/* Tick mark with bounce effect */}
      <motion.polyline
        points="28,42 38,52 54,34"
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={40}
        strokeDashoffset={40}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ strokeDashoffset: 0, scale: 1, opacity: 1 }}
        transition={{
          strokeDashoffset: { delay: 0.6, duration: 0.4, ease: "easeOut" },
          scale: { delay: 0.6, duration: 0.3, type: "spring", stiffness: 500 },
          opacity: { delay: 0.6, duration: 0.3 },
        }}
      />
    </motion.svg>
  </motion.div>
);

export default Tick;
