/*
const audioPath = 'api/audio/';
const audioExtension = '.mpeg';

const wordList = [
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety','thousand','hundred','rupees','and','paisa','received'
];

const audioCache = {};

function preloadAudio() {

    console.log("LOADED AUDIO")
    for (let word of wordList) {
      const audio = new Audio(audioPath + word + audioExtension);
      audio.load();
      audioCache[word] = audio;
    }
  
}

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

// Preload on page load
preloadAudio();
window.addEventListener('DOMContentLoaded', preloadAudio);


function getTwo(digits){
 const l = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
 if(digits<20){
  return [l[digits]];
 }
 const ones = digits%10;
 const tens = Math.floor(digits/10)-2;
 const t = ['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 let ret = [t[tens]];
 if(ones!=0){
  ret = [...ret, l[ones]];
 }
 return ret; 
}

function announce(amt){
 let ret = []
 if(amt>99999){
  ret = [...getTwo(Math.floor(amt/100000)),'thousand'];
 }
 while(amt>99999){
  amt -= 100000;
 }
 if(amt>9999){
  ret = [...ret, ...getTwo(Math.floor(amt/10000)), 'hundred'];
 }
 while(amt>9999){
  amt -= 10000;
 }
 if(amt>99){
  ret = [...ret, ...getTwo(Math.floor(amt/100))];
 }
 if(ret.length!=0){
  ret = [...ret, 'rupees'];
 }
 while(amt>99){
  amt -= 100;
 }
 if(amt != 0){
  if(ret.length!=0){
   ret = [...ret,'and'];
  }
  ret = [...ret, ...getTwo(amt),'paisa'];
 }
 playSequence([...ret,'received']);

}
*/
function speakAsync(text) {
 return new Promise((resolve, reject) => {
  //select voice
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = () => { resolve(); };
  utterance.onerror = (event) => { reject(event.error); };
  window.speechSynthesis.speak(utterance);
 });
}

async function ANNOUNCE(amt){
  //Play Notification BEEP
  if(amt>99){
    await speakAsync(Math.floor(amt/100).toString());
    await speakAsync("rupees");
    amt = amt%100;
    if(amt>0){
      await speakAsync("and");
    }

  }
  if(amt>0){
    await speakAsync(Math.floor(amt).toString());
    await speakAsync("paisa");
  }
  await speakAsync("received");
  await speakAsync("through OPI");
}

export { ANNOUNCE };