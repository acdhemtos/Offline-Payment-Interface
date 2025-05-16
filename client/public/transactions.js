function openTransactions() {
 return new Promise((resolve, reject) => {
   const request = indexedDB.open("transactions",1);

   request.onupgradeneeded = function(){
     const db = request.result;
     db.createObjectStore("users", {keypath:"username"});

     const transactions = db.createObjectStore("transactions", {keypath:"id"});
     transactions.createIndex("other",["other"]);

     db.createObjectStore("unsure",{keypath:"time"});
   };

   request.onsuccess = (event) => {
     const dbInstance = event.target.result;
     resolve(dbInstance);
   };
 });
}

//async function addTransaction())

async function loadTransaction(id,transactions){
 while(true){
   try{
     const data = await AJAX("/api/getTransaction.php", {"id":id});
     console.log(data);
     transactions.add(data["data"]);
   }
   catch(error){
     console.error(error);
     continue;
   }
   break;
 }
}