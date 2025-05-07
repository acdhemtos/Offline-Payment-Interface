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
    div.innerHTML =
      "<p class='text-gray-500 text-center text-lg'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction, index) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className =
      "transaction bg-white border border-gray-200 shadow-md rounded-lg p-5 mb-6 hover:shadow-lg transition-shadow duration-300";

    const typeLabel =
      transaction.type === 0
        ? "Top Up"
        : transaction.type === 1 || transaction.type === -1
        ? "Online"
        : "Offline";

    const otherLabel =
      transaction.type > 0 ? "Sender" : transaction.type < 0 ? "Receiver" : "";

    transactionDiv.innerHTML = `
      <div class="flex flex-col space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Transaction #${transaction.id}</h3>
          <span class="text-sm text-gray-500">${transaction.date}</span>
        </div>
        <div class="flex flex-col space-y-2">
          ${
            otherLabel
              ? `<div class="flex justify-between">
                  <span class="text-gray-600 font-medium">${otherLabel}:</span>
                  <span class="text-gray-800">${transaction.other || "N/A"}</span>
                </div>`
              : ""
          }
          <div class="flex justify-between">
            <span class="text-gray-600 font-medium">Amount:</span>
            <span class="text-gray-800">${transaction.amount / 100} Rs.</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 font-medium">Type:</span>
            <span class="text-gray-800">${typeLabel}</span>
          </div>
        </div>
      </div>
    `;

    div.appendChild(transactionDiv);
  });
};

initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
