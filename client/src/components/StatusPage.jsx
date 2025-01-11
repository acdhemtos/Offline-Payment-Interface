import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const StatusPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-green-200 w-full">
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="flex flex-col items-center justify-center mt-6">
        <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
        <h1 className="text-2xl font-bold text-blue-500 mt-4 mb-6">Your transaction was successful!</h1>
      </div>
    </div>
  );
};

export default StatusPage;