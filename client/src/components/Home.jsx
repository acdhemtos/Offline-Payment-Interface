import BottomBar from "./BottomBar";
import { motion } from "framer-motion";

const Home = () => {
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 w-full">
      {/* Bottom Bar */}
      <BottomBar />
    </div>
  );
};

export default Home;
