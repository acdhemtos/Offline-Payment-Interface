import React from 'react';

const PinDisplay = ({ pin, onClick }) => {
  return (
    <div
      className={`flex space-x-4 mb-6 cursor-pointer ${pin.length === 0 ? 'bg-gray-200' : ''}`}
      onClick={onClick}
    >
      {Array(4)
        .fill('')
        .map((_, index) => (
          <div
            key={index}
            className={`w-16 h-16 flex items-center justify-center text-center text-3xl font-semibold border-2 border-gray-300 rounded-lg ${pin.length === 0 ? 'bg-gray-200' : ''}`}
          >
            {/* Animated dot or placeholder */}
            <span className={`animated-dot ${pin[index] ? '' : 'text-gray-400'}`}>
              {pin[index] ? '•' : '•'}
            </span>
          </div>
        ))}
    </div>
  );
};

export default PinDisplay;