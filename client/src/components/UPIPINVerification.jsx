import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import PinDisplay from "./PinDisplay";
import { motion } from "framer-motion";
import { AJAX } from "../utils/ajax";
import { messages } from "../utils/loadMessages";

const UPIPINVerification = () => {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState(null); // success or failure
  const [resultMessage, setResultMessage] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsername = async () => {
    try {
      const username = Cookies.get("username");
      const response = await fetch("/api/getName.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (data && data.name) {
        const capitalizedUsername =
          data.name.charAt(0).toUpperCase() + data.name.slice(1);
        setName(capitalizedUsername);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const verifyPin = async () => {
    const sessionKey = Cookies.get("session_key");
    const name = localStorage.getItem("name");
    const { receiver, amount } = location.state || {};

    if (!receiver || !sessionKey || !amount || !name) {
      setResult("failure");
      setResultMessage("Missing required data. Please try again.");
      return;
    }

    const data = await AJAX("/api/send.php", {
      receiver,
      amount: amount * 100,
      pin,
    });

    if (data.code === 0) {
      setResult("success");
    } else {
      setResult("failure");
      setResultMessage(messages[data.code - 1] || data.message || "Transaction failed. Please try again.");
      setPin("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const shouldShowVerifyButton = pin.length === 4 && !result;

  return (
    <motion.div
      className="flex flex-col min-h-screen items-center justify-center bg-gray-100 w-full px-4 relative"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
    >
      {result ? (
        <>
          {/* Back button on top left */}
          <button
            className="absolute top-6 left-6 px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
            onClick={() => {
              setResult(null);
              setResultMessage("");
              setPin("");
            }}
          >
            Back
          </button>
          {/* Centered status and message */}
          <div className="flex flex-col items-center justify-center flex-1 w-full mt-24">
            <div className={`text-2xl font-bold mb-4 ${result === "success" ? "text-green-600 bg-green-500 " : "text-red-600 bg-red-500"}`}>
              {result === "success" ? "Transaction Successful" : "Transaction Failed"}
            </div>
            <div className="text-base text-center">{resultMessage}</div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-blue-500 mb-6">
            PIN Verification
          </h1>
          <input
            type="text"
            inputMode="numeric"
            maxLength="4"
            value={pin}
            onChange={handleInputChange}
            ref={inputRef}
            className="absolute opacity-0 pointer-events-none"
          />
          <PinDisplay
            pin={pin}
            onClick={() => inputRef.current && inputRef.current.focus()}
          />
          {shouldShowVerifyButton && (
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 hover:from-blue-600 hover:to-indigo-600 transition-transform duration-300"
              onClick={verifyPin}
            >
              Verify PIN
            </button>
          )}
        </>
      )}
    </motion.div>
  );
};

export default UPIPINVerification;