function sha256(...messages){
 return Array.from(
  new Uint8Array(
   await crypto.subtle.digest(
    'SHA-256', 
    (new TextEncoder()).encode(
     messages.join('')
    )
   )
  )
 );
}

function equal(array1, array2) {
 if (array1.length !== array2.length) { return false; }

 return array1.every((value, index) => value === array2[index]);
}
