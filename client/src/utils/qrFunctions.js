const map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ']

const tc = 10000;

const index = {
 username : {
  from : 0,
  to : 36
 },
 name : {
  from : 10,
  to : 37
 }
}

export const encode = (() => {
 function arrayToString(arr){
  return String.fromCharCode(...arr);
 }
 
 function number(num, size) {
  let arr = [];
  num = BigInt(num)
  while (size > 0) {
   arr.unshift(Number(num%BigInt(256)));
   num /= BigInt(256);
   --size;
  }
  return arrayToString(arr);
 }
 
 function makeIndexArray(str,limits,size){
  let {from,to} = limits
  let arr = map.slice(from,to);
  let n = BigInt(arr.length);
  let n1 = n + BigInt(1);
  let num = BigInt(0);
  for(let ch of str){
   num *= n1;
   num += n-BigInt(arr.indexOf(ch));
  }
  return number(num, size);
 }
 
 
 
 return {
  username: (str) => {
   return makeIndexArray(str,index.username,10)
  },
  amount: (amt) => {
   return number(amt, 3);
  },
  time: () => {
    return number(Date.now()%tc, 2);
  },
  trans_id: (id) => {
    return number(id, 4);
  },
  name: (str) => {
    return makeIndexArray(str,index.name,37)
  },
  hash: (arr) => {
   return arrayToString(arr);
  }
 };
})();

export const decode = (() => {
 function stringToArray(str){
  return Array.from(str).map(char => char.charCodeAt(0));
 }
 
 function number(str) {
  let arr = stringToArray(str);
  let num = BigInt(0);
  for (let i = 0; i < arr.length; i++) {
    num *= BigInt(256);
    num += BigInt(arr[i]);
  }
  return num;
 }

 function makeStr(arr,limits){
  let {from,to} = limits
  let ARR = map.slice(from,to);
  
  let n = BigInt(ARR.length);
  let n1 = n + BigInt(1);
  let num = number(arr);
  let str = "";
  while(num!=0){
   str += ARR[n-num%n1];
   num /= n1;
  }
  return str;
 }

 return {
  username: (arr) => {
   let str = "";
   try{
    str = makeStr(arr,index.username).split('').reverse().join('');
    
   }catch(err){
    console.error(err.message)
    return false;
   }
   if (str.length < 8 || str.length > 15) { return false; }
   if (!/^[a-z]/.test(str)) { return false; }
   if (!/^[a-z0-9]+$/.test(str)) { return false; }
   
   return str;
  },
  amount: (arr) => {
   let ret = number(arr);
   return ret==0 ? false : ret;
  },
  time: (arr) => {
    let ret = Math.floor(Date.now()/tc)*tc+number(arr);
    console.log(ret);
    if(ret>Date.now()){
     ret -= tc;
    }
    return ret;
  },
  trans_id: (arr) => {
   let ret = number(arr);
   return ret==0 ? false : ret;
  },
  name: (arr) => {
    let str = "";
   try{
    str = makeStr(arr,index.name).split('').reverse().join('');
    
   }catch(err){
    console.error(err.message)
    return false;
   }
   if (str.length < 1 || str.length > 60) { return false; }
   if (str !== str.trim()) { return false; }
   if (!/^[a-z\s]+$/.test(str)) { return false; }
   
   return str;
  },
  hash: (str) => {
   return stringToArray(str);
  }
 };
})();