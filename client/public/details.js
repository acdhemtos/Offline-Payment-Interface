async function openDetails() {
 return new Promise((resolve, reject) => {
     const request = indexedDB.open("details", 1);

     request.onupgradeneeded = function (event) {
         console.log("Upgrade needed");
         const db = event.target.result;
         if (!db.objectStoreNames.contains("details")) {
             db.createObjectStore("details", { keyPath: "detail" });
         }
     };

     request.onsuccess = function (event) {
         const db = event.target.result;
         console.log("Database opened successfully:", db);

         // Check if the object store exists
         if (!db.objectStoreNames.contains("details")) {
             console.error("Object store 'details' missing! Closing DB.");
             db.close();
             reject("Database exists but missing required object store.");
             return;
         }

         resolve(db);
     };

     request.onerror = function () {
         console.error("Error opening DB:", request.error);
         reject(request.error);
     };

     request.onblocked = function () {
         console.warn("Database opening is blocked!");
         reject("Database opening blocked by another connection.");
     };
 });
}


async function getDetail(detail) {
 const db = await openDetails();
 return new Promise((resolve, reject) => {
     const transaction = db.transaction("details", "readonly");
     const store = transaction.objectStore("details");
     const getRequest = store.get(detail);

     getRequest.onsuccess = () => resolve(getRequest.result.value);
     getRequest.onerror = () => reject(getRequest.error);
 });
}