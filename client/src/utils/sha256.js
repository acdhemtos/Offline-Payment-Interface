function sha256(message){
 return Array.from(
  new Uint8Array(
   await crypto.subtle.digest(
    'SHA-256', 
    (new TextEncoder()).encode(
     message
    )
   )
  )
 );
}
