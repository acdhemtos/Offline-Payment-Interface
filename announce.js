function getTwo(digits){
 const l = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
 if(digits<20){
  return l[digits];
 }
 const ones = digits%10;
 const tens = Math.floor(digits/10)-2;
 const = ['twenty','thirty','fourty','fifty','sixty','seventy','eighty','ninety']; 
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