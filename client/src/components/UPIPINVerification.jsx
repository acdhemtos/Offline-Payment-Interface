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

    console.log("Receiver:", receiver);
    console.log("Amount:", amount);
    console.log("Name:", name);
    console.log("Session Key:", sessionKey);
    console.log("PIN:", pin);

    if (!receiver || !sessionKey || !amount || !name) {
      alert("Missing required data. Please try again.");
      return;
    }

    const data = await AJAX("/api/send.php", {
      receiver,
      amount: amount * 100,
      pin,
    });

    console.log(data);

    if (data.code === 0) {
      alert("Transaction successful!");
      navigate("/app/home");
    } else {
      console.error("Login failed with code:", data.code);
      alert(messages[data.code - 1] || "Login failed. Please try again.");
      alert(data.message || "Transaction failed. Please try again.");
      setPin("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const shouldShowVerifyButton = pin.length === 4;

  return (
    <motion.div
      className="flex flex-col min-h-screen items-center justify-center bg-gray-100 w-full px-4"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
    >
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
    </motion.div>
  );
};

export default UPIPINVerification;
