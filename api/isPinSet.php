<?php
 
 function isPinSet($username){
  return ($GLOBALS['conn']->query("
   SELECT COUNT(*) 
   FROM users 
   WHERE username = '$username' 
   AND `pin` IS NOT NULL
  ")->fetchColumn() > 0);
 } 
 
 if(self(__FILE__)){
  $data = json_decode(file_get_contents("php://input"),true);
  
  $username = $data["username"];
  validate('validateLoginUsername', $username);

  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}
  
  validate('isLoggedIn',$username,$session_key);
   
  display(0,array("pinSet" => isPinSet($username)));
 }
?>