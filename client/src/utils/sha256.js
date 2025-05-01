
async function sha256(...messages) {
 let str = messages.join("")
 console.log([str])
 let s = String.fromCharCode(
  ...(
   new Uint8Array(
    await crypto.subtle.digest(
     'SHA-256',
     (
      new TextEncoder()
     ).encode(
      str
     )
    )
   )
  )
 );
 //ola ola ola
 console.log(s,);
 return s;
}




export default sha256; 