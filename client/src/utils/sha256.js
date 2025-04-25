async function sha256(...messages) {
 return String.fromCharCode(
  ...(
   new Uint8Array(
    await crypto.subtle.digest(
     'SHA-256',
     (
      new TextEncoder()
     ).encode(
      messages.join('')
     )
    )
   )
  )
 );
}