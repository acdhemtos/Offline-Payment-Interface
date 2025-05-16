import Lottie from "lottie-react";
import tickAnimation from "../assets/tick.json"; // Adjust path if needed

const Tick = ({ size = 120, loop = false }) => (
  <div className="flex items-center justify-center">
    <Lottie
      animationData={tickAnimation}
      loop={loop}
      autoplay
      style={{ width: size, height: size }}
    />
  </div>
);

export default Tick;