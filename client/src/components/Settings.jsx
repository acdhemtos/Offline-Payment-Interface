import { useState } from "react";
import PinDisplay from "./PinDisplay";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Settings = () => {
  const [upiPin, setUpiPin] = useState("");
  const [upiPinConfirm, setUpiPinConfirm] = useState("");
  const [opiPin, setOpiPin] = useState("");
  const [opiPinConfirm, setOpiPinConfirm] = useState("");
  const [isUpiPinSet, setIsUpiPinSet] = useState(false);
  const [isOpiPinSet, setIsOpiPinSet] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showUpiInput, setShowUpiInput] = useState(false);
  const [showOpiInput, setShowOpiInput] = useState(false);
  const [isUpiPinConfirmed, setIsUpiPinConfirmed] = useState(false);
  const [isOpiPinConfirmed, setIsOpiPinConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleSetUpiPin = (e) => {
    e.preventDefault();
    if (upiPin !== upiPinConfirm) {
      alert("UPI PINs do not match. Please try again.");
      return;
    }
    setIsUpiPinConfirmed(true); // Set the PIN as confirmed
    alert("Please confirm your UPI PIN again.");
  };

  const handleConfirmUpiPin = (e) => {
    e.preventDefault();
    if (upiPin !== upiPinConfirm) {
      alert("UPI PINs do not match. Please try again.");
      return;
    }
    setIsUpiPinSet(true);
    setShowUpiInput(false);
    setIsUpiPinConfirmed(false);
    alert("UPI PIN set successfully!");
  };

  const handleSetOpiPin = (e) => {
    e.preventDefault();
    if (opiPin !== opiPinConfirm) {
      alert("OPI PINs do not match. Please try again.");
      return;
    }
    setIsOpiPinConfirmed(true); // Set the PIN as confirmed
    alert("Please confirm your OPI PIN again.");
  };

  const handleConfirmOpiPin = (e) => {
    e.preventDefault();
    if (opiPin !== opiPinConfirm) {
      alert("OPI PINs do not match. Please try again.");
      return;
    }
    setIsOpiPinSet(true);
    setShowOpiInput(false);
    setIsOpiPinConfirmed(false);
    alert("OPI PIN set successfully!");
  };

  const handleResetUpiPin = (e) => {
    e.preventDefault();
    setUpiPin("");
    setUpiPinConfirm("");
    setIsUpiPinSet(false);
    setShowUpiInput(false);
    alert("UPI PIN has been reset.");
  };

  const handleResetOpiPin = (e) => {
    e.preventDefault();
    setOpiPin("");
    setOpiPinConfirm("");
    setIsOpiPinSet(false);
    setShowOpiInput(false);
    alert("OPI PIN has been reset.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
      <header className="fixed top-0 left-0 right-0 p-4 bg-blue-600 text-white text-xl font-semibold shadow-md text-center w-full z-10">
        <button
          className="absolute top-3 left-4 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(-1)}
          style={{ background: "none" }}
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        Settings
      </header>

      {/* Set or Reset UPI PIN */}
      {!showOpiInput && (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 text-gray-900 mb-8 transform transition-all hover:scale-105">
          {showUpiInput ? (
            <>
              {isUpiPinConfirmed ? (
                <form onSubmit={handleConfirmUpiPin} className="mt-6 space-y-4">
                  <PinDisplay
                    pin={upiPin}
                    onClick={() => setIsKeyboardVisible(true)}
                  />
                  {isKeyboardVisible && (
                    <>
                      <input
                        type="password"
                        value={upiPin}
                        onChange={(e) => setUpiPin(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500"
                        placeholder="Re-enter UPI PIN"
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-medium bg-green-500 hover:bg-green-600 text-white transition-transform transform hover:scale-105"
                  >
                    Confirm UPI PIN
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSetUpiPin} className="mt-6 space-y-4">
                  <PinDisplay
                    pin={upiPin}
                    onClick={() => setIsKeyboardVisible(true)}
                  />
                  {isKeyboardVisible && (
                    <>
                      <input
                        type="password"
                        value={upiPin}
                        onChange={(e) => setUpiPin(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500"
                        placeholder="Enter UPI PIN"
                      />
                      <input
                        type="password"
                        value={upiPinConfirm}
                        onChange={(e) => setUpiPinConfirm(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500"
                        placeholder="Re-enter UPI PIN"
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-medium bg-green-500 hover:bg-green-600 text-white transition-transform transform hover:scale-105"
                  >
                    Set UPI PIN
                  </button>
                </form>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowUpiInput(true)}
              className={`w-full py-3 px-6 rounded-xl font-semibold ${
                isUpiPinSet
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-transform transform hover:scale-105 shadow-lg`}
            >
              {isUpiPinSet ? "Reset UPI PIN" : "Set UPI PIN"}
            </button>
          )}
        </div>
      )}

      {/* Set or Reset OPI PIN */}
      {!showUpiInput && (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 text-gray-900 transform transition-all hover:scale-105">
          {showOpiInput ? (
            <>
              {isOpiPinConfirmed ? (
                <form onSubmit={handleConfirmOpiPin} className="mt-6 space-y-4">
                  <PinDisplay
                    pin={opiPin}
                    onClick={() => setIsKeyboardVisible(true)}
                  />
                  {isKeyboardVisible && (
                    <>
                      <input
                        type="password"
                        value={opiPin}
                        onChange={(e) => setOpiPin(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500"
                        placeholder="Re-enter OPI PIN"
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-medium bg-green-500 hover:bg-green-600 text-white transition-transform transform hover:scale-105"
                  >
                    Confirm OPI PIN
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSetOpiPin} className="mt-6 space-y-4">
                  <PinDisplay
                    pin={opiPin}
                    onClick={() => setIsKeyboardVisible(true)}
                  />
                  {isKeyboardVisible && (
                    <>
                      <input
                        type="password"
                        value={opiPin}
                        onChange={(e) => setOpiPin(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500"
                        placeholder="Enter OPI PIN"
                      />
                      <input
                        type="password"
                        value={opiPinConfirm}
                        onChange={(e) => setOpiPinConfirm(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500"
                        placeholder="Re-enter OPI PIN"
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-medium bg-green-500 hover:bg-green-600 text-white transition-transform transform hover:scale-105"
                  >
                    Set OPI PIN
                  </button>
                </form>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowOpiInput(true)}
              className={`w-full py-3 px-6 rounded-xl font-semibold ${
                isOpiPinSet
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white transition-transform transform hover:scale-105 shadow-lg`}
            >
              {isOpiPinSet ? "Reset OPI PIN" : "Set OPI PIN"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
