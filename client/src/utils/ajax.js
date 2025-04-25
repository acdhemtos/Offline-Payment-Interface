import Cookies from 'js-cookie';

function AJAX(url, data) {
  const username = Cookies.get("username");
  const sessionKey = Cookies.get("session_key");

  return fetch(url + '?' + new Date().getTime(), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Username': username,
      'session_key': sessionKey
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.code !== 0) {
      console.error('Error:', data.message || 'Unknown error');
    }
    return data;
  })
  .catch(error => {
    console.error('Fetch error:', error);
    throw error;
  });
}

export { AJAX };
