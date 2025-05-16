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
 const db = await openDetails();
 return new Promise((resolve, reject) => {
     const transaction = db.transaction("names", "readwrite");
     const store = transaction.objectStore("names");
     const getRequest = store.get(username);

     getRequest.onsuccess = () => resolve(getRequest.result.name);
     getRequest.onerror = () => {
      try{
       const name = "UNGABUNGA";
      }
      catch(error){
       reject(error);
      }
      
      const addRequest = store.add({ username, name });

      addRequest.onsuccess = () => resolve(name);
      addRequest.onerror = () => reject("Failed to insert default name");
     };
 });
}