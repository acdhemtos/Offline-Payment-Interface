import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getRelativePath } from "../utils/utils";
import CustomKeyboard from "./CustomKeyboard";
import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";

const ReceivePage = () => {
  const [amount, setAmount] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [dotDisabled, setDotDisabled] = useState(false); // Track if dot is used
  const [cursorPosition, setCursorPosition] = useState(0); // Track cursor position
  const [qrData, setQrData] = useState("₹1000");
  const [scannedId, setScannedId] = useState("");
  const [isAmountDisabled, setIsAmountDisabled] = useState(false); // Track if amount input is disabled
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleAmountChange = (value) => {
    let updatedAmount = amount;
    let newCursorPosition = cursorPosition;

    if (value === "←") {
      // Handle backspace
      if (cursorPosition > 0) {
        updatedAmount =
          updatedAmount.slice(0, cursorPosition - 1) +
          updatedAmount.slice(cursorPosition);
        newCursorPosition = cursorPosition - 1;

        // Re-enable the dot if it's removed
        if (updatedAmount.indexOf(".") === -1) {
          setDotDisabled(false);
        }
      }
    } else if (value === ".") {
      if (!dotDisabled) {
        updatedAmount =
          updatedAmount.slice(0, cursorPosition) +
          "." +
          updatedAmount.slice(cursorPosition);
        setDotDisabled(true); // Disable dot after first use
        newCursorPosition++;
      }
    } else {
      // Limit decimal digits to 2 after dot
      if (dotDisabled) {
        const [integerPart, decimalPart] = updatedAmount.split(".");
        if (decimalPart && decimalPart.length >= 2) {
          return; // Prevent input if there are already 2 decimal places
        }
      }
      updatedAmount =
        updatedAmount.slice(0, cursorPosition) +
        value +
        updatedAmount.slice(cursorPosition);
      newCursorPosition = cursorPosition + 1;
    }

    setAmount(updatedAmount);
    setCursorPosition(newCursorPosition);

    // Update the input field cursor position
    setTimeout(() => {
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);

    // Close keyboard if 2 numbers are input after dot
    if (dotDisabled) {
      const [integerPart, decimalPart] = updatedAmount.split(".");
      if (decimalPart && decimalPart.length === 2) {
        setTimeout(() => {
          setIsKeyboardVisible(false);
        }, 500); // Short delay before closing the keyboard
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart && decimalPart.length > 2) {
      return; // Prevent input if there are already 2 decimal places
    }
    setAmount(value);
  };

  const generateQRCode = async () => {
    // Mock QR code generation
    setQrData(`Receive ₹${amount}`);
    setIsAmountDisabled(true); // Disable the amount input

    // Access camera for scanning
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Error accessing camera: " + error.message);
    }
  };

  const handleScan = () => {
    // Mock scan action
    const mockScannedId = "123456"; // Replace with actual scanning logic
    setScannedId(mockScannedId);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 w-full px-4">
      <button
        className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="text-2xl" />
      </button>

      {/* QR Code Display */}
      <div className="p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg mt-20 shadow-lg">
        <QRCodeSVG value={qrData} size={256} />
      </div>

      {/* Scanned ID Display */}
      <div className="mt-4 p-3 w-full max-w-md border border-gray-300 rounded-lg text-center text-lg bg-white bg-opacity-20 backdrop-blur-lg">
        Scanned ID: {scannedId}
      </div>

      {/* Amount Input */}
      <div className="relative mt-4 w-full max-w-md">
        <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="tel"
          className={`pl-10 p-3 w-full border border-gray-300 rounded-lg text-center text-lg bg-white bg-opacity-20 backdrop-blur-lg cursor-pointer ${
            isAmountDisabled ? "bg-gray-200" : ""
          }`}
          placeholder="Enter Amount"
          value={amount}
          onChange={handleInputChange}
          onClick={() => setIsKeyboardVisible(true)}
          onFocus={(e) => setCursorPosition(e.target.selectionStart)}
          onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
          disabled={isAmountDisabled}
        />
      </div>

      {/* Custom Keyboard */}
      {isKeyboardVisible && (
        <div className="w-full max-w-md mb-4">
          <CustomKeyboard
            onKeyPress={handleAmountChange}
            dotDisabled={dotDisabled}
          />
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition"
            onClick={() => setIsKeyboardVisible(false)}
          >
            Hide Keyboard
          </button>
        </div>
      )}

      {/* Generate QR Code and Start Camera Button */}
      {!isKeyboardVisible && (
        <button
          className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-600 transition mb-4"
          onClick={generateQRCode}
        >
          Generate QR Code
        </button>
      )}

      {/* Camera Feed & Canvas for Scanning */}
      <div className="mt-6 w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border border-gray-300"
          onClick={handleScan}
        />
      </div>
    </div>
  );
};

export default ReceivePage;
