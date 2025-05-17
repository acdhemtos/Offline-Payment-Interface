import Lottie from "lottie-react";// Adjust path if needed
import tickAnimation from "../assets/tick.json"; 

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