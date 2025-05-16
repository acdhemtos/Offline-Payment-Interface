
function AJAX(url, data={},tel=true) {
  const username = decodeURIComponent(Cookies.get("username") || "");
  const sessionKey = decodeURIComponent(Cookies.get("session_key") || "");
  
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
