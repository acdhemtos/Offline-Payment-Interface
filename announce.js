const audioPath = './audio/';
const audioExtension = '.mp3';

const wordList = [
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety','thousand','hundred','rupees','and','paisa'
];

const audioCache = {};

// Preload audio files
function preloadAudio() {
  for (let word of wordList) {
    const audio = new Audio(audioPath + word + audioExtension);
    audio.load();
    audioCache[word] = audio;
  }
}

function playNumberSequence(wordsArray) {
  let index = 0;

  function playNext() {
    if (index >= wordsArray.length) return;

    const currentWord = wordsArray[index];
    const audio = audioCache[currentWord].cloneNode(); // Clone to allow replay
    audio.play();
    audio.onended = function () {
      index++;
      playNext();
    };
  }

  playNext();
}

// Preload on page load
window.addEventListener('DOMContentLoaded', preloadAudio);





function getTwo(digits){
 const l = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
 if(digits<20){
  return [l[digits]];
 }
 const ones = digits%10;
 const tens = Math.floor(digits/10)-2;
 const t = ['twenty','thirty','fourty','fifty','sixty','seventy','eighty','ninety'];
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
 return ret;

}

const audioPath = './audio/'; // change this if your audio files are elsewhere
const audioExtension = '.mp3'; // change this if you're using .wav or .ogg

// Queue and play audio files one after another
function playNumberSequence(wordsArray) {
  if (!wordsArray.length) return;

  let index = 0;

  function playNext() {
    if (index >= wordsArray.length) return;

    const audio = new Audio(audioPath + wordsArray[index] + audioExtension);
    audio.play();
    audio.onended = function () {
      index++;
      playNext();
    };
  }

  playNext();
}