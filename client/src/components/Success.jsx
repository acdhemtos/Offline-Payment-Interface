import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300">
      <div className="backdrop-blur-lg bg-white/30 border border-white/20 shadow-2xl rounded-3xl px-10 py-12 text-center max-w-md w-full">
        <FaCheckCircle className="text-green-500 text-7xl mb-6 mx-auto drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Payment Successful
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Your transaction has been completed successfully.
        </p>
        <button
          onClick={() => navigate("/app/home")}
          className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;