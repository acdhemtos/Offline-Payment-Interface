function getTwo(digits){
 let l = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
 if(digits<21){
  return l[digits];
 }
}

for(let i=0;i<100;++i){
 console.log(i,getTwo(i));
}

function announce(amt){
 let ret = []
 if(amt>999){
  ret = [...getTwo(Math.floor(amt/1000)),'thousand'];
 }
}