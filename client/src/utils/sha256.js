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