import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate in React Router v6
import { people } from './People'; // Import the people array
import { FiArrowLeft } from "react-icons/fi";

const Userchat = () => {
  const { id } = useParams();
  const user = people.find((person) => person.id === parseInt(id));
  const navigate = useNavigate();  // Use useNavigate for navigation

  if (!user) {
    return <div className="text-center text-gray-700">User not found</div>;
  }

  // Filter transactions to show only between the current user and this user
  const transactions = {
    sent: [
      { to: 'Charlie', amount: 50 },
      { to: 'Daisy', amount: 20 },
    ].filter((transaction) => transaction.to === user.name), // Only show payments to this user
    received: [
      { from: 'Alice', amount: 30 },
      { from: 'Bob', amount: 40 },
    ].filter((transaction) => transaction.from === user.name), // Only show payments from this user
  };

  return (
    <div className="w-full min-h-screen">
      <div className="bg-[#f0f0f3] p-4 shadow-md text-left px-4 flex justify-stretch items-center">
        <button
          onClick={() => navigate('/app/home')}  
          className=" text-black hover:opacity-80 py-1 px-3 rounded-md "
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl pl-4 font-semibold text-gray-800">{user.name}</h2>
      </div>

      {/* Chat box with fixed height and scrollable transactions */}
      <div className="bg-[#f0f0f3] shadow-md p-4 border flex flex-col-reverse border-gray-200 max-w-xl mx-auto" style={{ height: 'calc(92vh - 1px)', overflowY: 'auto' }}>
        {/* Displaying received transactions (left side) */}
        <div className="space-y-4 flex flex-col-reverse">
          {transactions.received.map((transaction, index) => (
            <div key={index} className={`flex items-center ${index === transactions.sent.length - 1 ? 'mb-2' : 'mb-20'}`}>
              <div className="w-1/2 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm text-gray-700">{transaction.from} sent you</p>
                <p className="text-lg font-semibold text-gray-800">₹{transaction.amount}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Displaying sent transactions (right side) */}
        <div className="space-y-4 mt-6 flex flex-col-reverse">
        {transactions.sent.map((transaction, index) => (
    <div key={index} className={`flex items-center justify-end ${index === transactions.sent.length - 1 ? 'mb-2' : 'mb-14'}`}>
      <div className="w-1/2 bg-blue-500 text-white p-3 rounded-xl shadow-sm border border-gray-200">
        <p className="text-sm">{transaction.to} received</p>
        <p className="text-lg font-semibold">₹{transaction.amount}</p>
      </div>
    </div>
  ))}
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={() => alert('Initiating Payment')}
        className="fixed bottom-8 right-8 bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        Pay
      </button>
    </div>
  );
};

export default Userchat;
