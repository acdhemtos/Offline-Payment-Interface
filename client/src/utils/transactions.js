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

  transactionsRef.current.forEach((transaction, index) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className =
      "transaction p-6 border border-gray-300 bg-white shadow-lg rounded-lg mb-6 hover:shadow-xl transition-shadow duration-300";

    let sas = `
      <table class="w-full text-left border-collapse">
        <tr class="${index % 2 === 0 ? "bg-gray-100" : "bg-white"}">
          <th class="py-3 px-5 text-gray-700 font-bold">ID</th>
          <th class="py-3 px-5 text-gray-700 font-bold">:</th>
          <td class="py-3 px-5 text-gray-900">${transaction.id}</td>
        </tr>
    `;

    if (transaction.type !== 0) {
      sas += `
        <tr class="${index % 2 === 0 ? "bg-gray-100" : "bg-white"}">
          <th class="py-3 px-5 text-gray-700 font-bold">${
            transaction.type > 0 ? "Sender" : "Receiver"
          }</th>
          <th class="py-3 px-5 text-gray-700 font-bold">:</th>
          <td class="py-3 px-5 text-gray-900">${transaction.other || "N/A"}</td>
        </tr>
      `;
    }

    sas += `
      <tr class="${index % 2 === 0 ? "bg-gray-100" : "bg-white"}">
        <th class="py-3 px-5 text-gray-700 font-bold">Amount</th>
        <th class="py-3 px-5 text-gray-700 font-bold">:</th>
        <td class="py-3 px-5 text-gray-900">${transaction.amount / 100} Rs.</td>
      </tr>
      <tr class="${index % 2 === 0 ? "bg-gray-100" : "bg-white"}">
        <th class="py-3 px-5 text-gray-700 font-bold">Type</th>
        <th class="py-3 px-5 text-gray-700 font-bold">:</th>
        <td class="py-3 px-5 text-gray-900">
    `;

    if (transaction.type === 0) {
      sas += "Top Up";
    } else if (transaction.type === 1 || transaction.type === -1) {
      sas += "Online";
    } else {
      sas += "Offline";
    }

    sas += `
        </td>
      </tr>
      <tr class="${index % 2 === 0 ? "bg-gray-100" : "bg-white"}">
        <th class="py-3 px-5 text-gray-700 font-bold">Date-Time</th>
        <th class="py-3 px-5 text-gray-700 font-bold">:</th>
        <td class="py-3 px-5 text-gray-900">${transaction.date}</td>
      </tr>
      </table>
    `;

    transactionDiv.innerHTML = sas;
    div.appendChild(transactionDiv);
  });
};

initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
