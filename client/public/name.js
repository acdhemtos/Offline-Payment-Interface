async function openName() {
 return new Promise((resolve, reject) => {
   const request = indexedDB.open("names", 1);

   request.onupgradeneeded = function (event) {
     const db = event.target.result;
     db.createObjectStore("names", { keyPath: "username" });
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
 const db = await openName();
 return new Promise((resolve, reject) => {
     const transaction = db.transaction("names", "readwrite");
     const store = transaction.objectStore("names");
     const getRequest = store.get(username);

     getRequest.onsuccess = () => {
         if (getRequest.result === null || getRequest.result === undefined) {
             AJAX("/api/getName.php", { "name_username": username })
                 .then(data => {
                     let name = data.name;
                     const newTransaction = db.transaction("names", "readwrite");
                     const newStore = newTransaction.objectStore("names");
                     const addRequest = newStore.add({ username, name });

                     addRequest.onsuccess = () => resolve(name);
                     addRequest.onerror = () => reject("Failed to insert default name");
                 })
                 .catch(error => reject(error));
         } else {
             resolve(getRequest.result.name);
         }
     };
 });
}
