import Cookies from "js-cookie";

function AJAX(url, data) {
  const username = Cookies.get("username");
  const sessionKey = Cookies.get("session_key");

  const requestData = { ...data, username, session_key: sessionKey };

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

export { AJAX };
