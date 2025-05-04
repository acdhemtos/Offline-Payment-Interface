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

const encode = (() => {
 function number(num, size) {
  let str = "";
  num = BigInt(num)
  while (size > 0) {
   str = String.fromCharCode(Number(num%BigInt(256))) + str;
   num /= BigInt(256);
   --size;
  }
  return str;
 }

 function base16ToBase256(base16String) {
  // Ensure the input is valid
  if (base16String.length % 2 !== 0) {
    throw new Error("Invalid base-16 string. Length must be even.");
  }

  const base256Array = [];
  for (let i = 0; i < base16String.length; i += 2) {
    const byte = parseInt(base16String.substr(i, 2), 16);
    base256Array.push(byte);
  }

  return String.fromCharCode(...base256Array);
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
  ...Object.fromEntries(['username', 'receiver', 'sender'].map(k => [k, (str) => {
    return makeIndexArray(str,index.username,10)
   }])),
  amount: (amt) => {
   return number(amt, 3);
  },
  time: (t) => {
    return number(t%tc, 2);
  },
  trans_id: (id) => {
    return number(id, 4);
  },
  name: (str) => {
    return makeIndexArray(str,index.name,37)
  },
  code: (amt) => {
   return number(amt, 1);
  },
  ...Object.fromEntries(['hash', 'details_hash', 'verification_hash'].map(k => [k, (base16String) => {
    return base16ToBase256(base16String);
}]))
 };
})();

const decode = (() => {
 
 function number(str) {
  let num = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    num *= BigInt(256);
    num += BigInt(str[i].charCodeAt(0));
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
  ...Object.fromEntries(['username', 'receiver', 'sender'].map(k => [k, (arr) => {
    let str = "";
   try {
     str = makeStr(arr,index.username).split('').reverse().join('');
     
    }catch(err){
     console.error(err.message)
     return false;
    }
    if (str.length < 8 || str.length > 15) { return false; }
    if (!/^[a-z]/.test(str)) { return false; }
    if (!/^[a-z0-9]+$/.test(str)) { return false; }
    
    return str;
   }])),
  amount: (arr) => {
   let ret = Number(number(arr));
   return ret==0 ? false : ret;
  },
  time: (arr) => {
    let ret = Math.floor(Date.now()/tc)*tc+Number(number(arr));
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
   code: (arr) => {
    return number(arr);
   },
  ...Object.fromEntries(['hash', 'details_hash', 'verification_hash'].map(k => [k, (base256String) => {
    let base16String = '';
    
    // Convert each byte of the base 256 string to its hexadecimal representation
    for (let i = 0; i < base256String.length; i++) {
      const byte = base256String.charCodeAt(i);
      base16String += byte.toString(16).padStart(2, '0'); // Ensure each byte is two digits
    }

    return base16String;
  }]))
 }
})();

/*
```
Username 10 (26+10+1)^15
Amount    3 10^7
Time      2 10^4
Trans_ID   4 
Name     37 (26+1+1)^60
Hash     32
```
*/

//comment


const lengths = {
 ...Object.fromEntries(['username', 'receiver', 'sender'].map(k => [k, 10])),
 "amount" : 3,
 "time" : 2,
 "trans_id" : 4,
 "name" : 37,
 "code" : 1,
 ...Object.fromEntries(['hash', 'details_hash', 'verification_hash'].map(k => [k, 32]))
}

console.log(lengths);

export const QR = {
  encode : function(encodeFormat, ...values){
    encodeFormat = encodeFormat.split('+');
    if(encodeFormat.length!==values.length){ throw "MisMatched Parameters"; }
    let str = "";
    for(let i=0;i<encodeFormat.length;++i){
      console.log(encodeFormat[i]);
      str += encode[encodeFormat[i]](values[i]);
      
      
    }
    console.log("ENCODED",values,encodeFormat,str);
    return str;
  },
  decode : function(decodeFormat,decodeString){
    decodeFormat = decodeFormat.split('+');
    let n = 0;
    for(let i=0;i<decodeFormat.length;++i){
     n += lengths[decodeFormat[i]];
    }
    if(n!=decodeString.length){return false;}
    let ret = {};
    let k = 0;
    for(let i=0;i<decodeFormat.length;++i){
      let j = k + lengths[decodeFormat[i]];
      let o = decode[decodeFormat[i]](decodeString.slice(k,j));
      if(o===false){return false;}
      ret[decodeFormat[i]] = o;
      k = j;
    }
    console.log("DECODED",decodeString,decodeFormat,ret);
    return ret;
  }
};