async function openName() {
 return new Promise((resolve, reject) => {
   const request = indexedDB.open("names", 1);

   request.onupgradeneeded = function (event) {
     const db = event.target.result;
     db.createObjectStore("name", { keyPath: "name" });
   };

   request.onsuccess = function () {
     resolve(request.result);
   };

   request.onerror = function () {
     reject(request.error);
   };
 });
}

async function getName(username) {
 const db = await openDetails();
 return new Promise((resolve, reject) => {
     const transaction = db.transaction("names", "readwrite");
     const store = transaction.objectStore("names");
     const getRequest = store.get(name);

     getRequest.onsuccess = () => resolve(getRequest.result);
     getRequest.onerror = () => reject(getRequest.error);
 });
}