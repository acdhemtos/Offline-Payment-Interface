const CustomKeyboard = ({ onKeyPress, dotDisabled }) => {
  const handleButtonClick = (value) => {
    onKeyPress(value);
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-white rounded-lg shadow-lg">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          className="w-full h-20 bg-gray-200 text-2xl rounded-lg hover:bg-gray-300 flex items-center justify-center"
          onClick={() => handleButtonClick(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="w-full h-20 bg-red-500 text-white text-2xl rounded-lg hover:bg-red-600 flex items-center justify-center"
        onClick={() => handleButtonClick('←')}
      >
        ←
      </button>
      <button
        className="w-full h-20 bg-gray-200 text-2xl rounded-lg hover:bg-gray-300 flex items-center justify-center"
        onClick={() => handleButtonClick(0)}
      >
        0
      </button>
      <button
        className={`w-full h-20 ${dotDisabled ? 'bg-gray-300' : 'bg-gray-200'} text-2xl rounded-lg hover:bg-gray-300 flex items-center justify-center`}
        onClick={() => !dotDisabled && handleButtonClick('.')}
        disabled={dotDisabled} // Disable dot if already used
      >
        .
      </button>
    </div>
  );
};

export default CustomKeyboard;