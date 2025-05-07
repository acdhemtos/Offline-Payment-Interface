import React, { useRef, useEffect } from "react";
import { AJAX } from "./ajax";

const transactionsRef = { current: [] };

const initializeTransactions = () => {
  const transactionsData = localStorage.getItem("transactions");
  if (!transactionsData || transactionsData === "undefined") {
    localStorage.setItem("transactions", "[]");
    transactionsRef.current = [];
  } else {
    transactionsRef.current = JSON.parse(transactionsData);
  }
};

const updateTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactionsRef.current));
};

const formatEpoch = (seconds) => {
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsStr = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsStr}`;
};

const loadTransactions = () => {
  return AJAX("../api/getTransactions.php")
    .then((response) => {
      if (response && response.transactions) {
        transactionsRef.current = response.transactions;
        updateTransactions();
        console.log(response.transactions);
      } else {
        console.warn("No transactions found in the API response.");
      }
    })
    .catch((error) => {
      console.error("Failed to load transactions:", error);
    });
};

const addTransaction = (id, other, amount, type, date) => {
  transactionsRef.current.unshift({
    id: id,
    other: other,
    amount: amount,
    type: type,
    date: formatEpoch(date),
  });
  updateTransactions();
};

const renderTransactions = (div) => {
  div.innerHTML = "";

  if (transactionsRef.current.length === 0) {
    div.innerHTML = `
      <p class="text-gray-400 text-center text-lg mt-10">
        No transactions yet.
      </p>`;
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className = `
      bg-white border border-gray-200 rounded-xl px-5 py-4 mb-4
      shadow-sm hover:shadow-md transition duration-200 relative
    `;

    const typeLabel =
      transaction.type === 0
        ? "Top Up"
        : transaction.type === 1 || transaction.type === -1
        ? "Online"
        : "Offline";

    const badgeColor =
      transaction.type === 0
        ? "text-blue-600"
        : transaction.type > 0
        ? "text-green-600"
        : "text-red-600";

    const otherLabel =
      transaction.type > 0 ? "To" : transaction.type < 0 ? "From" : null;

    // Convert timestamp to readable date/time format
    const formattedTime = new Date(transaction.date).toLocaleString();

    // Mask Transaction ID to show only part of it
    const maskedId = `Tx-***${transaction.id.toString().slice(-5)}`;

    transactionDiv.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-md font-medium text-gray-800">
          <span class="text-sm text-gray-500">ID:</span> ${maskedId}
        </h3>
      </div>

      <div class="text-sm text-gray-700 space-y-1">
        ${
          otherLabel
            ? `<div class="flex justify-between">
                <span>${otherLabel}:</span>
                <span class="font-medium text-gray-900">${transaction.other || "N/A"}</span>
              </div>`
            : ""
        }

        <div class="flex justify-between">
          <span>Amount:</span>
          <span class="font-semibold text-gray-900">₹${(transaction.amount / 100).toFixed(2)}</span>
        </div>

        <div class="flex justify-between">
          <span>Type:</span>
          <span class="font-medium ${badgeColor}">${typeLabel}</span>
        </div>
      </div>

      <!-- Timestamp at the bottom-right -->
      <div class="absolute bottom-2 right-2 text-xs text-gray-500">
        Timestamp: ${formattedTime}
      </div>
    `;

    div.appendChild(transactionDiv);
  });
};




initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
