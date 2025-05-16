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
  return AJAX("../api/listTransactions.php")
    .then((response) => {
      if (response && response.transactions) {
        transactionsRef.current = response.transactions;
        updateTransactions();
        console.log("response.transactions",response.transactions);
        console.log("response", response);
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
      relative bg-white border border-gray-100 shadow-sm rounded-xl px-5 py-4 mb-5
      hover:shadow-md transition duration-200
    `;


    // Type badge
    let typeLabel = "";
    let badgeColor = "";
    if (transaction.type === 0) {
      typeLabel = "Top Up";
      badgeColor = "bg-blue-100 text-blue-600";
    } else if (transaction.type === 1 || transaction.type === -1) {
      typeLabel = "Online";
      badgeColor = "bg-green-100 text-green-600";
    } else {
      typeLabel = "Offline";
      badgeColor = "bg-green-200 text-green-500";
    }

    // Sender/Receiver
    const otherLabel =
      transaction.type > 0 ? "Sender" : transaction.type < 0 ? "Receiver" : null;

    // Format time
    const formattedTime = transaction.date;
    console.log(transaction.date);

    transactionDiv.innerHTML = `
   
      <div class="absolute top-3 right-3">
        <span class="text-xs font-medium px-3 py-1 rounded-full ${badgeColor}">
          ${typeLabel}
        </span>
      </div>

      
      <div class="flex flex-col space-y-2">

        ${
          otherLabel
            ? `<div class="text-sm text-gray-600">
                <span class="font-medium">${otherLabel}:</span> ${transaction.other || "N/A"}
              </div>`
            : ""
        }

        <div class="text-sm text-gray-600">
          <span class="font-medium">Amount:</span> ₹${(transaction.amount / 100).toFixed(2)}
        </div>
      </div>

    
      <div class="text-xs text-gray-500 text-right mt-4">
        ${formattedTime}
      </div>
    `;

    div.appendChild(transactionDiv);
  });
};

initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
