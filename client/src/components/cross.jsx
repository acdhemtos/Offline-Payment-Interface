import Lottie from "lottie-react";
import crossAnimation from "../assets/cross.json"; // Adjust path if needed

const Cross = ({ size = 120, loop = false }) => (
  <div className="flex items-center justify-center">
    <Lottie
      animationData={crossAnimation}
      loop={loop}
      autoplay
      style={{ width: size, height: size }}
    />
  </div>
);

export default Cross;