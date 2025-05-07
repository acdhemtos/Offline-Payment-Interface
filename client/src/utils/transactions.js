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
  div.innerHTML = ""; // Clear the container

  if (transactionsRef.current.length === 0) {
    div.innerHTML = "<p class='text-gray-500 text-center'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className = `
      transaction bg-white border border-gray-200 shadow-md rounded-xl p-5 mb-6 
      hover:shadow-lg transition-shadow duration-300 relative
    `;

    // Masked Transaction ID (e.g., Tx-***12345)
    const maskedId = `Tx-***${transaction.id.toString().slice(-5)}`;

    // Determine type label and badge color
    let typeLabel = "";
    let badgeColor = "";
    if (transaction.type === 0) {
      typeLabel = "Top Up";
      badgeColor = "bg-blue-500 text-white"; // Blue for Top Up
    } else if (transaction.type === 1 || transaction.type === -1) {
      typeLabel = "Online";
      badgeColor = "bg-green-500 text-white"; // Green for Online
    } else {
      typeLabel = "Offline";
      badgeColor = "bg-red-500 text-white"; // Red for Offline
    }

    // Sender/Receiver Label
    const otherLabel =
      transaction.type > 0 ? "Sender" : transaction.type < 0 ? "Receiver" : null;

    // Convert timestamp to readable date/time format
    const formattedTime = new Date(transaction.date).toLocaleString();

    // Content to display in the transaction card
    transactionDiv.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-md font-medium text-gray-800">
          <span class="text-sm text-gray-500">ID:</span> ${maskedId}
        </h3>
        <!-- Badge for Transaction Type -->
        <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}">
          ${typeLabel}
        </span>
      </div>

      <div class="text-sm text-gray-700 space-y-1">
        ${otherLabel
          ? `<div class="flex justify-between">
              <span class="font-medium text-gray-600">${otherLabel}:</span>
              <span class="text-gray-800">${transaction.other || "N/A"}</span>
            </div>`
          : ""}

        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Amount:</span>
          <span class="font-semibold text-gray-800">₹${(transaction.amount / 100).toFixed(2)}</span>
        </div>
      </div>

      <!-- Timestamp at the bottom-right of the card -->
      <div class="absolute bottom-1 right-3 text-xs text-gray-500">
        Timestamp: ${formattedTime}
      </div>
    `;

    div.appendChild(transactionDiv);
  });
};


initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
