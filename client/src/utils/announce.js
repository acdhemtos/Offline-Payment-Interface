const audioCache = new Audio("api/beep.mp3");
audioCache.load();

function speakAsync(text) {
 return new Promise((resolve, reject) => {
  //select voice
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.25;
   utterance.pitch = 1;
   utterance.volume = 1;
  utterance.onend = () => { resolve(); };
  utterance.onerror = (event) => { reject(event.error); };
  window.speechSynthesis.speak(utterance);
 });
}

async function announce(amt){
  const beep = audioCache.cloneNode();
  beep.play();
  beep.onended = async () => {
    if(amt>99){
      await speakAsync(Math.floor(amt/100).toString() + " " + (amt > 199 ? "rupees" : "rupee"));
      amt = amt%100;
      if(amt>0){ await speakAsync("and"); }
    }
    if(amt>0){ await speakAsync(Math.floor(amt).toString() + " " + (amt===1 ? "paise" : "paisa")); }
    await speakAsync("received, through OPI");
  };
}


export { announce };