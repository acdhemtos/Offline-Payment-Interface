async function AJAX(url, data={},tel=true) {
  const u = await getFromStore("username");
  const s = await getFromStore('session_key');
  console.log(u, s);
  const username = decodeURIComponent(u.value || "");
  const sessionKey = decodeURIComponent(s.value || "");
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
