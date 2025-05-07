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
  div.innerHTML = ""; // Clear container

  if (transactionsRef.current.length === 0) {
    div.innerHTML = `
      <p class="text-gray-400 text-center text-lg italic mt-10">
        No transactions available.
      </p>`;
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className = `
      bg-white/80 backdrop-blur-sm border border-gray-200 
      shadow-md rounded-2xl p-6 mb-5 hover:shadow-xl 
      transition-shadow duration-300
    `;

    const typeLabel =
      transaction.type === 0
        ? "Top Up"
        : transaction.type === 1 || transaction.type === -1
        ? "Online"
        : "Offline";

    const badgeColor =
      transaction.type === 0
        ? "bg-blue-100 text-blue-800"
        : transaction.type > 0
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

    const otherLabel =
      transaction.type > 0 ? "To" : transaction.type < 0 ? "From" : "";

    transactionDiv.innerHTML = `
      <div class="flex flex-col space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-800">
            Transaction #${transaction.id}
          </h3>
          <span class="text-sm text-gray-500">${transaction.date}</span>
        </div>

        <div class="flex flex-wrap gap-4">
          ${
            otherLabel
              ? `
            <div class="flex-1">
              <p class="text-sm text-gray-500 font-medium">${otherLabel}</p>
              <p class="text-base text-gray-800">${transaction.other || "N/A"}</p>
            </div>
          `
              : ""
          }

          <div class="flex-1">
            <p class="text-sm text-gray-500 font-medium">Amount</p>
            <p class="text-base text-gray-800 font-semibold">₹${(transaction.amount / 100).toFixed(2)}</p>
          </div>

          <div class="flex-1">
            <p class="text-sm text-gray-500 font-medium">Type</p>
            <span class="inline-block px-3 py-1 text-sm font-medium rounded-full ${badgeColor}">
              ${typeLabel}
            </span>
          </div>
        </div>
      </div>
    `;

    div.appendChild(transactionDiv);
  });
};


initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
