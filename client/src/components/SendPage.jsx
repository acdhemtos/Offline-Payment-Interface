import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomKeyboard from './CustomKeyboard';
import { FaRupeeSign, FaArrowLeft, FaUser, FaIdCard } from 'react-icons/fa';

const SendPage = () => {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [dotDisabled, setDotDisabled] = useState(false); // Track if dot is used
  const [cursorPosition, setCursorPosition] = useState(0); // Track cursor position
  const [isAmountEntered, setIsAmountEntered] = useState(false); // Track if amount is entered
  const [isDataFetched, setIsDataFetched] = useState(false); // Track if data is fetched from QR or database
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if data is passed from QR code scanning
    if (location.state) {
      const { id, username, amount } = location.state;
      setId(id || '');
      setUsername(username || '');
      setAmount(amount || '');
      setIsAmountEntered(!!amount);
      setIsDataFetched(true);
    }
  }, [location.state]);

  const handleAmountChange = (value) => {
    let updatedAmount = amount;
    let newCursorPosition = cursorPosition;

    if (value === '←') {
      // Handle backspace
      if (cursorPosition > 0) {
        updatedAmount = updatedAmount.slice(0, cursorPosition - 1) + updatedAmount.slice(cursorPosition);
        newCursorPosition = cursorPosition - 1;

        // Re-enable the dot if it's removed
        if (updatedAmount.indexOf('.') === -1) {
          setDotDisabled(false);
        }
      }
    } else if (value === '.') {
      if (!dotDisabled) {
        updatedAmount = updatedAmount.slice(0, cursorPosition) + '.' + updatedAmount.slice(cursorPosition);
        setDotDisabled(true); // Disable dot after first use
        newCursorPosition++;
      }
    } else {
      // Limit decimal digits to 2 after dot
      if (dotDisabled) {
        const [integerPart, decimalPart] = updatedAmount.split('.');
        if (decimalPart && decimalPart.length >= 2) {
          return; // Prevent input if there are already 2 decimal places
        }
      }
      updatedAmount = updatedAmount.slice(0, cursorPosition) + value + updatedAmount.slice(cursorPosition);
      newCursorPosition = cursorPosition + 1;
    }

    setAmount(updatedAmount);
    setCursorPosition(newCursorPosition);

    // Check if amount is entered and update state
    if (updatedAmount) {
      setIsAmountEntered(true);
    }

    // Update the input field cursor position
    setTimeout(() => {
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const [integerPart, decimalPart] = value.split('.');
    if (decimalPart && decimalPart.length > 2) {
      return; // Prevent input if there are already 2 decimal places
    }
    setAmount(value);
  };

  const handleUsernameChange = async (e) => {
    const value = e.target.value;
    setUsername(value);

    // Fetch user data from the database
    if (value) {
      try {
        const response = await fetch(`/api/get-user?username=${value}`);
        const data = await response.json();
        if (data && data.id) {
          setId(data.id);
          setIsDataFetched(true);
        } else {
          setId('');
          setIsDataFetched(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setId('');
        setIsDataFetched(false);
      }
    } else {
      setId('');
      setIsDataFetched(false);
    }
  };

  const handleOptionClick = (path) => {
    if (amount) {
      navigate(path);
    } else {
      alert('Please enter an amount');
    }
  };

  // Close the keyboard when two decimal digits are entered
  useEffect(() => {
    if (amount.includes('.') && amount.split('.')[1]?.length === 2) {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 500); // Minor delay before closing keyboard
    }
  }, [amount]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 w-full px-4">
      <header className="fixed top-0 left-0 right-0 p-4 bg-blue-600 text-white text-xl font-semibold shadow-md text-center w-full z-10">
        <button
          className="absolute top-3 left-4 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate(-1)}
          style={{ background: 'none' }}
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        Send Money
      </header>
      
      <div className="relative mb-4 w-full max-w-md mt-20">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
          ID
        </label>
        <div className="relative">
          <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg text-center text-lg bg-white cursor-pointer"
            placeholder="Enter ID"
            disabled={isDataFetched}
          />
        </div>
      </div>

      <div className="relative mb-4 w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg text-center text-lg bg-white cursor-pointer"
            placeholder="Enter Username"
            disabled={isDataFetched}
          />
        </div>
      </div>

      <div className="relative mb-4 w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
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
            onClick={() => setIsKeyboardVisible(true)}
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg text-center text-lg bg-white cursor-pointer"
            placeholder="Enter Amount"
            onFocus={(e) => setCursorPosition(e.target.selectionStart)}
            onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
            readOnly
            disabled={isDataFetched}
          />
        </div>
      </div>

      {/* Custom Keyboard */}
      {isKeyboardVisible && (
        <div className="w-full max-w-md mb-4">
          <CustomKeyboard onKeyPress={handleAmountChange} dotDisabled={dotDisabled} />
          <button
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
            onClick={() => setIsKeyboardVisible(false)}
          >
            Hide Keyboard
          </button>
        </div>
      )}

      {/* Conditionally render UPI/OPI buttons */}
      {!isKeyboardVisible && isAmountEntered && (
        <div className="flex flex-col items-center w-full max-w-md">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-600 transition w-full mb-2"
            onClick={() => handleOptionClick('/app/upi-pin')}
          >
            UPI
          </button>
          <div className="flex items-center my-4 w-full max-w-md">
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-green-600 transition w-full"
            onClick={() => handleOptionClick('/app/opi-pin')}
          >
            OPI
          </button>
        </div>
      )}
    </div>
  );
};

export default SendPage;