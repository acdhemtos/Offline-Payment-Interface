importScripts('ajax.js');

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


function AJAX(url, data={},tel=true) {
  const username = decodeURIComponent(getCookie("username") || "");
  const sessionKey = decodeURIComponent(getCookie("session_key") || "");
  
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
