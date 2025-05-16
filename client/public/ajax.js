function getFromStore(detail) {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction("details", "readonly");
      const store = transaction.objectStore("details");
      const getRequest = store.get(detail);

      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
  });
}

async function AJAX(url, data,tel=true) {

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
