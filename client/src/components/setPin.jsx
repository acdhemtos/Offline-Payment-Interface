import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PinDisplay from "./PinDisplay";
import Cookies from "js-cookie";

const SetPin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numeric input
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits.");
      return;
    }

    try {
      const username = Cookies.get("username");
      const sessionKey = Cookies.get("session_key");

      const response = await fetch("/api/setPin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, session_key: sessionKey, pin }),
      });

      const data = await response.json();

      if (data.code === 0) {
        alert("PIN set successfully!");
        setPin("");
        setError("");
        navigate("/"); // Navigate back to home after successful PIN set
      } else {
        setError(data.message || "Failed to set PIN. Please try again.");
      }
    } catch (error) {
      console.error("Error setting PIN:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Set Your PIN</h1>

      {/* Hidden Input Field */}
      <input
        type="text"
        inputMode="numeric"
        maxLength="4"
        value={pin}
        onChange={handleInputChange}
        ref={inputRef}
        className="absolute opacity-0 pointer-events-none"
      />

      {/* Pin Display */}
      <PinDisplay
        pin={pin}
        onClick={() => inputRef.current && inputRef.current.focus()} // Focus input on click
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-32 bg-green-500 text-white text-xl font-bold rounded-lg py-2 shadow-md hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
};

export default SetPin;