import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomKeyboard from './CustomKeyboard';
import PinDisplay from './PinDisplay';
import { motion } from 'framer-motion';

const OPIPINVerification = () => {
  const [pin, setPin] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const navigate = useNavigate();

  const handlePinChange = (value) => {
    if (value === '←') {
      setPin(pin.slice(0, -1)); // Handle backspace
    } else if (pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin); // Add digit to pin if there's space
      if (newPin.length === 4) {
        setIsKeyboardVisible(false); // Hide keyboard automatically once PIN is filled
      }
    }
  };

  const verifyPin = () => {
    const devicePassword = '1234'; // Replace with actual device password logic
    if (pin === devicePassword) {
      alert('OPI PIN verified successfully');
      navigate('/home');
    } else {
      alert('Invalid OPI PIN');
      setPin(''); // Clear the PIN inputs if incorrect
    }
  };

  // Check if the PIN is filled with 4 digits and the keyboard is not visible
  const shouldShowVerifyButton = pin.length === 4 && !isKeyboardVisible;

  return (
    <motion.div
      className="flex flex-col min-h-screen items-center justify-center bg-gray-100 w-full px-4"
      initial={{ x: '100vw' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
    >
      <h1 className="text-3xl font-bold text-blue-500 mb-8">Enter OPI PIN</h1>

      {/* PIN Display */}
      <PinDisplay pin={pin} onClick={() => {
        if (pin.length < 4) {
          setIsKeyboardVisible(true); // Show keyboard when clicking on the PIN display
        }
      }} />

      {/* Show custom keyboard */}
      {isKeyboardVisible && pin.length < 4 && (
        <div className="w-full max-w-md mb-4">
          <CustomKeyboard onKeyPress={handlePinChange} />
        </div>
      )}

      {/* Verify PIN button */}
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

export default OPIPINVerification;