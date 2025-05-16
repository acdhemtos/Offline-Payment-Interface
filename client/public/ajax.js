async function openDetails() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("details", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore("details", { keyPath: "detail" });
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
  const db = await openDetails();
  return new Promise((resolve, reject) => {
      const transaction = db.transaction("details", "readonly");
      const store = transaction.objectStore("details");
      const getRequest = store.get(detail);

      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
  });
}

async function AJAX(url, data={},tel=true) {
  const u = await getFromStore("username");
  const s = await getFromStore('session_key');
  console.log(u, s);
  const username = decodeURIComponent(u || "");
  const sessionKey = decodeURIComponent(s || "");
  //console.log(username, sessionKey);
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
