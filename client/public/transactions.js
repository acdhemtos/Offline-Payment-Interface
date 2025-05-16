function openTransactions() {
 return new Promise((resolve, reject) => {
   const request = indexedDB.open("transactions",5);

   request.onupgradeneeded = function(){
     const db = request.result;
     const transactions = db.createObjectStore("transactions", {keyPath:"id"});
     transactions.createIndex("other",["other"]);

     db.createObjectStore("unsure",{keypath:"time"});
   };

   request.onsuccess = (event) => {
     const dbInstance = event.target.result;
     resolve(dbInstance);
   };
 });
}

async function addTransaction(id,amount,type,other,time){
 const db = await openTransactions();
 const transactions = db.transaction('transactions',"readwrite").objectStore("transactions");
 transactions.add({ id,amount,type,other,time});
}

async function loadTransaction(id,transactions){
 while(true){
   try{
     const data = await AJAX("/api/getTransaction.php", {"id":id});
     if(data.other===undefined){
      data.other = null;
     }
     console.log({ id:id,...data["data"]});
     const db = await openTransactions();
     const transactions = db.transaction('transactions',"readwrite").objectStore("transactions");
     transactions.add({ id:id,...data["data"]});
   }
   catch(error){
     console.error(error);
     continue;
   }
   break;
 }
}