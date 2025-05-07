// transactions.js
const transactionsRef = { current: [] };

const initializeTransactions = () => {
  const transactionsData = localStorage.getItem("transactions");
  if (!transactionsData || transactionsData === "undefined") {
    localStorage.setItem("transactions", "[]");
    transactionsRef.current = [];
  } else {
    transactionsRef.current = JSON.parse(transactionsData);
  }

  // Inject dummy data if empty
  if (transactionsRef.current.length === 0) {
    const dummyData = [
      {
        id: 101,
        other: "Alice",
        amount: 25000,
        type: 1,
        date: "2025-05-07 12:30:45",
      },
      {
        id: 102,
        other: "Bob",
        amount: 15000,
        type: -1,
        date: "2025-05-06 16:15:10",
      },
      {
        id: 103,
        other: "",
        amount: 50000,
        type: 0,
        date: "2025-05-05 10:00:00",
      },
      {
        id: 104,
        other: "Charlie",
        amount: 30000,
        type: -2,
        date: "2025-05-04 18:42:20",
      },
    ];
    transactionsRef.current = dummyData;
    updateTransactions();
  }
};

const updateTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactionsRef.current));
};

const addTransaction = (id, other, amount, type, date) => {
  transactionsRef.current.unshift({
    id,
    other,
    amount,
    type,
    date,
  });
  updateTransactions();
};

const renderTransactions = (div) => {
  div.innerHTML = "";

  if (transactionsRef.current.length === 0) {
    div.innerHTML = "<p class='text-gray-500 text-center'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const { id, other, amount, type, date } = transaction;
    const transactionDiv = document.createElement("div");
    transactionDiv.className =
      "p-4 bg-white shadow-md rounded-xl border-l-4 mb-4 " +
      (type === 0 ? "border-blue-500" : type > 0 ? "border-green-500" : "border-red-500");

    const getTypeLabel = () => {
      if (type === 0) return "Top Up";
      if (type === 1 || type === -1) return "Online";
      return "Offline";
    };

    const direction = type > 0 ? "To" : type < 0 ? "From" : "";

    transactionDiv.innerHTML = `
      <div class="text-sm text-gray-600 mb-1">#${id} • ${getTypeLabel()}</div>
      ${type !== 0 ? `<div class="text-lg font-semibold">${direction}: ${other}</div>` : ""}
      <div class="text-md text-gray-800 mt-1">Amount: ₹${(amount / 100).toFixed(2)}</div>
      <div class="text-sm text-gray-500 mt-1">${date}</div>
    `;

    div.appendChild(transactionDiv);
  });
};

initializeTransactions();

export { renderTransactions, addTransaction };
