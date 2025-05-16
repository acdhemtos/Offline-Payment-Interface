import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PinDisplay from "./PinDisplay";
// import { AJAX } from "../../public/ajax";
import { messages } from "../utils/loadMessages";

const SetPin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
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
      const data = await AJAX("/api/setPin.php", { pin });

      if (data && data.code === 0) {
        alert("PIN set successfully!");
        setPin("");
        setError("");
        navigate("/app/home");
      } else {
        setError(data.message || "Failed to set PIN. Please try again.");
      }
    } catch (error) {
      console.error("Error setting PIN:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-52  min-h-screen bg-gray-100 w-full">
      <button
        onClick={() => navigate("/app/home")}
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Set Your PIN</h1>

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
