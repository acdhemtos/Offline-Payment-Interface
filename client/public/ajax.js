async function openDetails() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("details", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains("details")) {
        const store = db.createObjectStore("details", { keyPath: "detail" });

        // Optional: add initial data
        store.add({ detail: "username", value: "john_doe" });
        store.add({ detail: "session_key", value: "abc123" });
      }
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function getFromStore(detail) {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction("details", "readonly");
      const store = transaction.objectStore("details");
      const getRequest = store.get(detail);

      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
  });
}

async function AJAX(url, data={},tel=true) {

  const username = decodeURIComponent(getFromStore('username') || "");
  const sessionKey = decodeURIComponent(getFromStore('session_key') || "");
  
  const requestData = tel?{ ...data, username, session_key: sessionKey }:data;

  return fetch(url + "?" + new Date().getTime().toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 0) {
        console.error("Error:", data.message || "Unknown error", data);
      }
      return data;
    })
    .catch((error) => {
      console.error("AJAX Error:", error);
    });
}
