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
  ret = [...ret, ...getTwo(Math.floor(amt/100), 'hundred')];
 }
 while(amt>99){
  amt -= 100;
 }
 if(amt!=0){
  ret = [...ret, ...getTwo(Math.floor(amt))];
 }
 ret = [...ret, 'rupees'];
 while(amt>0.99){
  amt -= 1;
 }
 amt *= 100;
 if(amt != 0){
  ret = [...ret, 'and', ...getTwo(amt),'paisa'];
 }
 return ret;

}

console.log(announce(123.45));
console.log(announce(1234.5));
console.log(announce(0.45));
console.log(announce(123.45));
console.log(announce(123.45));