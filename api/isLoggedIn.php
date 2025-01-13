<?php

 function isLoggedIn($username,$session_key){
  @require_once('connection.php');
  if($GLOBALS['conn']->query("SELECT * FROM users WHERE username='$username' AND session_key='".md5($session_key)."'")->rowCount() > 0){
   return 0;
  }
  return 18;
 }
 
 if(self(__FILE__)){
  $data = json_decode(file_get_contents("php://input"),true);
  
  $username = $data["username"]; validate('validateLoginUsername', $username);
  
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(17);}
  
  display(isLoggedIn($username,$session_key));
  
  display(0,array("name" => getName($username)));
 }
 

?>