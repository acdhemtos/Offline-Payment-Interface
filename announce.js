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
 if(amt>999){
  ret = [...getTwo(Math.floor(amt/1000)),'thousand'];
 }
 while(amt>999){
  amt -= 1000;
 }
 if(amt>99){
  ret = [...ret, ...getTwo(Math.floor(amt/100), 'hundred')];
 }
 while(amt>99){
  amt -= 100;
 }
}