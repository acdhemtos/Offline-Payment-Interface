import React, { useState } from "react";

const people = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "Daisy" },
  { id: 5, name: "Ethan" },
  { id: 6, name: "Fiona" },
];

const bgColors = [
  "text-red-500",
  "text-green-500",
  "text-blue-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
];

const PeopleSlider = () => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const displayedPeople = showAll ? people : people.slice(0, 4);

  return (
    <div className="w-full px-4 mb-6">
      <h2 className="text-base font-semibold text-gray-800 mb-2 px-1">People</h2>
      <div className="relative bg-white rounded-2xl shadow-md p-4 border border-blue-300 max-w-xl mx-auto">
        
        <div className="grid grid-cols-4 gap-4">
          {displayedPeople.map((person, index) => {
            const colorClass = bgColors[index % bgColors.length];
            const initial = person.name.charAt(0).toUpperCase();

            return (
              <div key={person.id} className="text-center transition-transform hover:scale-105 hover:shadow-lg">
                <div className="w-12 h-12 mx-auto rounded-full border-blue-300 bg-white/80 backdrop-blur-md shadow-md border flex items-center justify-center">
                  <span className={`text-lg font-bold ${colorClass}`}>{initial}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2 truncate">{person.name}</p>
              </div>
            );
          })}
        </div>
        {people.length > 4 && (
          <button
    onClick={toggleShowAll}
    className="absolute bottom-0 left-4 text-xs text-blue-500 hover:underline bg-white px-1 transition-opacity hover:opacity-80"
  >
    {showAll ? "Show Less" : "Show More"}
  </button>
        )}
      </div>
    </div>
  );
};

export default PeopleSlider;