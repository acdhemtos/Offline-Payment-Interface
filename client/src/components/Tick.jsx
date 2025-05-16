import { Player } from "lottie-react";
import tickAnimation from "../assets/tick.json"; // Adjust path if needed

const Tick = ({ size = 120, loop = false }) => (
  <div className="flex items-center justify-center">
    <Player
      autoplay
      loop={loop}
      src={tickAnimation}
      style={{ width: size, height: size }}
    />
  </div>
);

export default Tick;