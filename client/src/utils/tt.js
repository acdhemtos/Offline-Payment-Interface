import React, { useRef, useEffect } from "react";
import { AJAX } from "./ajax";

const transactionsRef = { current: [] };
// console.log(transactionsRef);

// Initialize transactions from localStorage
const initializeTransactions = () => {
  const transactionsData = localStorage.getItem("transactions");
  if (!transactionsData || transactionsData === "undefined") {
    localStorage.setItem("transactions", "[]");
    transactionsRef.current = [];
  } else {
    transactionsRef.current = JSON.parse(transactionsData);
  }
};

// Function to update transactions in localStorage
const updateTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactionsRef.current));
};

// Function to format epoch time into a readable date string
const formatEpoch = (seconds) => {
  const date = new Date(seconds * 1000); // JavaScript uses milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsStr = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsStr}`;
};

// Function to load transactions from an API
const loadTransactions = () => {
  return AJAX("../api/getTransactions.php")
    .then((response) => {
      if (response && response.transactions) {
        transactionsRef.current = response.transactions; // Assuming `response.transactions` is an array
        updateTransactions();
      } else {
        console.warn("No transactions found in the API response.");
      }
    })
    .catch((error) => {
      console.error("Failed to load transactions:", error);
    });
};

// Function to add a new transaction
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

// Function to render transactions into a given container
const renderTransactions = (div) => {
  div.innerHTML = ""; // Clear the container
  if (transactionsRef.current.length === 0) {
    div.innerHTML = "<p class='text-gray-500'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    // console.log(transaction);
    const transactionDiv = document.createElement("table");
    transactionDiv.className = "transaction";
    
    transactionDiv.innerHTML = `<p>ID: ${transaction.id}</p>`;
    
    if(transaction.type!=0){
     transactionDiv.innerHTML += `<p>${}: ${transaction.other}</p>`;
    }
    
    if (transaction.type != 0) {
      if (transaction.type > 0) {
         
      } else {
        transactionDiv.innerHTML += `<p>Receiver: ${transaction.other}</p>`;
      }
    }
    transactionDiv.innerHTML += `<p>Amount: ${transaction.amount}</p>`;
    switch (Math.abs(transaction.type)) {
      case 1:
        transactionDiv.innerHTML += `<p>Type: Online</p>`;
        break;
      case 2:
        transactionDiv.innerHTML += `<p>Type: Offline</p>`;
        break;
      default:
        transactionDiv.innerHTML += `<p>Type: TopUp</p>`;
    }
    transactionDiv.innerHTML += `<p>Date-Time: ${transaction.time}</p>`;
    div.appendChild(transactionDiv);
  });
};

// Initialize transactions on file load
initializeTransactions();

// Export the functions
export { loadTransactions, addTransaction, renderTransactions };