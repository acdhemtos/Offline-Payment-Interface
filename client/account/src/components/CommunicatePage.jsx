import { useState } from 'react';

const CommunicatePage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-blue-500 mb-6">Communicate</h1>
      <div className="w-3/4 p-4 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter your message"
            value={message}
            onChange={handleMessageChange}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
          onClick={handleSendMessage}
        >
          Send
        </button>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <ul className="list-disc list-inside">
            {messages.map((msg, index) => (
              <li key={index} className="mb-2">{msg}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunicatePage;