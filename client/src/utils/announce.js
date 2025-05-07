/*
const audioCache = new Audio("api/beep.mp3");
audioCache.load();


function playSequence(words, playbackRate = 1.5, delayMs = 750) {
 let i = 0;

 function playNext() {
   if (i < words.length) {
     const word = words[i];
     console.log(audioCache);
     const audio = audioCache[word].cloneNode(); // clone to allow overlap if needed
     audio.playbackRate = playbackRate;
     audio.play();
     i++;
     setTimeout(playNext, delayMs);
   }
 }

 playNext();
}
*/
function speakAsync(text) {
 return new Promise((resolve, reject) => {
  //select voice
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.5;
  utterance.pitch = 1;
  utterance.onend = () => { resolve(); };
  utterance.onerror = (event) => { reject(event.error); };
  window.speechSynthesis.speak(utterance);
 });
}

async function announce(amt){
  //Play Notification BEEP
  if(amt>99){
    await speakAsync(Math.floor(amt/100).toString() + " " + (amt > 199 ? "rupees" : "rupee"));
    
    amt = amt%100;
    if(amt>0){
      await speakAsync("and");
    }
  }
  if(amt>0){
    await speakAsync(Math.floor(amt).toString() + " " + (amt===1 ? "paise" : "paisa"));

    await speakAsync("paisa");
  }
  await speakAsync("received");
  await speakAsync("through OPI");
}


export { announce };