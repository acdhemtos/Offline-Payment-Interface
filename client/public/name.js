async function openName() {
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

async function getName(detail) {
 const db = await openDetails();
 return new Promise((resolve, reject) => {
     const transaction = db.transaction("details", "readonly");
     const store = transaction.objectStore("details");
     const getRequest = store.get(detail);

     getRequest.onsuccess = () => resolve(getRequest.result);
     getRequest.onerror = () => reject(getRequest.error);
 });
}