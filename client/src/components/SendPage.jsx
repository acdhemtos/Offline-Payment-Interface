import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRupeeSign, FaArrowLeft, FaIdCard } from "react-icons/fa";
import { AJAX } from "../utils/ajax";
import biometric from "../utils/biometric";

const SendPage = () => {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [isAmountEntered, setIsAmountEntered] = useState(false);
  const [disableUserId, setDisableUserId] = useState(false);
  const [disableName, setDisableName] = useState(false);
  const [disableAmount, setDisableAmount] = useState(false);
  const [showOpiOption, setShowOpiOption] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (location.state?.qrData) {
      const { username, amount, name, sender } = location.state.qrData;

      setId(username || sender  ||"");
      setUsername(name || "");
      setAmount(amount / 100 || "");

      setDisableUserId(!!username || !!sender);
      setDisableName(!!name);
      setDisableAmount(!!amount);

      setShowOpiOption(!!username && !!name && !!amount);
      setShowOpiOption(!!sender && !!name);
      setIsAmountEntered(!!amount);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart && decimalPart.length > 2) {
      return;
    }
    setAmount(value);

    setIsAmountEntered(!!value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const data = await AJAX("/api/getName.php", { name_username: id });

          if (data && data.name) {
            setUsername(data.name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [id]);

  const handleOptionClick = (path) => {
    if (amount) {
      const qrData = `$ ${id} ${amount} ${username} $`;
      navigate(path, { state: { qrData, receiver: id, rN: username, amount } });
    } else {
      alert("Please enter an amount");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full px-4">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 bg-blue-600 text-white text-xl font-semibold shadow-md text-center w-full z-10">
        <button
          className="absolute top-3 left-4 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate("/app/home")}
          style={{ background: "none" }}
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        Send Money
      </header>

      <div className="mt-24 w-full max-w-md mx-auto flex flex-col gap-4 px-2">
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
            htmlFor="username"
          >
            Sending Money To
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`pl-14 pr-3 py-2 w-full  text-lg bg-transparent capitalize text-right ${
                disableName
                  ? "bg-gray-200 cursor-not-allowed border-gray-300 focus:outline-none"
                  : "border-gray-300"
              }`}
              readOnly={disableName}
            />
          </div>
        </div>

        {/* ID Input */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
            htmlFor="id"
          >
            ID
          </label>
          <div className="relative">
            <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className={`pl-14 pr-3 py-2 w-full border rounded-lg text-lg bg-white ${
                disableUserId
                  ? "bg-slate-100 cursor-not-allowed border-gray-300 focus:outline-none"
                  : "border-gray-300"
              }`}
              placeholder="Enter ID"
              readOnly={disableUserId}
            />
          </div>
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
            htmlFor="amount"
          >
            Amount
          </label>
          <div className="relative">
            <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="tel"
              id="amount"
              value={amount}
              onChange={handleInputChange}
              className={`pl-14 pr-3 py-2 w-full border rounded-lg text-lg bg-white ${
                disableAmount
                  ? "bg-slate-100 cursor-not-allowed border-gray-300 focus:outline-none"
                  : "border-gray-300"
              }`}
              placeholder="Enter Amount"
              readOnly={disableAmount}
            />
          </div>
        </div>
      </div>

            {isAmountEntered && (
        <div className="mt-80 flex flex-col items-center w-full max-w-md mx-auto px-2">
          {showOpiOption ? (
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-green-600 transition w-full"
              onClick={async () => {
                const isAuthenticated = await biometric();
                if (isAuthenticated) {
                  if (!!location.state?.qrData?.sender && !!location.state?.qrData?.name) {
                    // Redirect to fast-send if sender and name are present
                    handleOptionClick("/fast-send");
                  } else {
                    // Redirect to opi-pin otherwise
                    handleOptionClick("/app/opi-pin");
                  }
                } else {
                  console.warn("Biometric authentication failed. Please try again.");
                }
              }}
            >
              Offline Send
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-600 transition w-full"
              onClick={() => handleOptionClick("/app/upi-pin")}
            >
              Send Money
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SendPage;
