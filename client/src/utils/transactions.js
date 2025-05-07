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
    div.innerHTML = "<p class='text-gray-500 text-center'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className = `
      relative bg-white border border-gray-200 shadow-md rounded-xl p-5 mb-6 
      hover:shadow-lg transition-shadow duration-300
    `;

    const maskedId = `${transaction.id.toString().slice(-5)}`;

    let typeLabel = "";
    let badgeColor = "";
    if (transaction.type === 0) {
      typeLabel = "Top Up";
      badgeColor = "bg-blue-500 text-white";
    } else if (transaction.type === 1 || transaction.type === -1) {
      typeLabel = "Online";
      badgeColor = "bg-green-500 text-white";
    } else {
      typeLabel = "Offline";
      badgeColor = "bg-red-500 text-white";
    }

    const otherLabel =
      transaction.type > 0 ? "Sender" : transaction.type < 0 ? "Receiver" : null;

    const formattedTime = new Date(transaction.date).toLocaleString();

    transactionDiv.innerHTML = `
      <!-- Badge at top-right -->
      <div class="absolute top-3 right-3">
        <span class="px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}">
          ${typeLabel}
        </span>
      </div>

      <div class="flex flex-col space-y-2 text-sm text-gray-800">
        <div>
          <span class="text-gray-500 font-medium">ID:</span> ${maskedId}
        </div>
        ${
          otherLabel
            ? `<div>
                <span class="text-gray-500 font-medium">${otherLabel}:</span> ${
                transaction.other || "N/A"
              }
              </div>`
            : ""
        }
        <div>
          <span class="text-gray-500 font-medium">Amount:</span> ₹${(transaction.amount / 100).toFixed(2)}
        </div>
      </div>

      <!-- Time at bottom-right -->
      <div class="text-xs text-gray-400 mt-4 text-right">
        Time: ${formattedTime}
      </div>
    `;

    div.appendChild(transactionDiv);
  });
};



initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
