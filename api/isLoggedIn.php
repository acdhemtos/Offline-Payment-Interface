<?php

 function isLoggedIn($username,$session_key){
  @require_once('connection.php');
  $result = $GLOBALS['conn']->query("
   SELECT last_active 
   FROM users 
   WHERE username = '$username' 
   AND session_key = '$session_key' 
   AND last_active >= NOW() - INTERVAL 7 DAY
  ");

  if ($result->rowCount() > 0) {
   $GLOBALS['conn']->query("
    UPDATE users 
    SET  
     last_active = NOW() 
    WHERE 
     username = '$username'
   ");
   return 0;
  }
  return 17;
 }
 
 if(self(__FILE__)){
  $data = json_decode(file_get_contents("php://input"),true);
  
  $username = $data["username"]; validate('validateLoginUsername', $username);
  
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}
  
  display(isLoggedIn($username,$session_key));
 }
 

?>