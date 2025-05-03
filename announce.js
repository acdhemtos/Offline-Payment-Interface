function getTwo(digits){

}
function announce(amt){
 let ret = []
 if(amt>999){
  ret = [...getTwo(Math.floor(amt/1000)),'thousand'];
 }
}