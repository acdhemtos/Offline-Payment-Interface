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
      "<p class='text-gray-500 text-center'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className =
      "transaction p-4 border border-gray-200 bg-white shadow-lg rounded-lg mb-4 hover:shadow-xl transition-shadow duration-300";

    let sas = `
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg shadow-md">
            ${transaction.type === 0 ? "T" : transaction.type > 0 ? "S" : "R"}
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-800">
              ${transaction.type === 0 ? "Top Up" : transaction.type > 0 ? "Sent" : "Received"}
            </p>
            <p class="text-sm text-gray-500">${transaction.date}</p> <!-- Use transaction.date -->
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold ${
            transaction.type > 0 ? "text-red-500" : "text-green-500"
          }">
            ${transaction.type > 0 ? "-" : "+"}₹${(transaction.amount / 100).toFixed(2)}
          </p>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-4">
        <table class="w-full text-left border-collapse">
          <tr class="border-b border-gray-200">
            <th class="py-2 px-4 text-gray-600 font-semibold">Transaction ID</th>
            <td class="py-2 px-4 text-gray-800">${transaction.id}</td>
          </tr>
    `;

    if (transaction.type !== 0) {
      sas += `
        <tr class="border-b border-gray-200">
          <th class="py-2 px-4 text-gray-600 font-semibold">${
            transaction.type > 0 ? "Receiver" : "Sender"
          }</th>
          <td class="py-2 px-4 text-gray-800">${transaction.other}</td>
        </tr>
      `;
    }

    sas += `
          <tr>
            <th class="py-2 px-4 text-gray-600 font-semibold">Date-Time</th>
            <td class="py-2 px-4 text-gray-800">${transaction.date}</td> <!-- Use transaction.date -->
          </tr>
        </table>
      </div>
    `;

    transactionDiv.innerHTML = sas;
    div.appendChild(transactionDiv);
  });
};

initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
