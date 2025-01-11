function AJAX(url,data) {
 return fetch(url+'?'+(new Date()).getTime().toString(), {
  method: "POST",
  headers: {'Content-Type': 'application/json'}, 
  body: JSON.stringify(data)
 });
}