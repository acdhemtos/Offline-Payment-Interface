<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $username = $data["username"]; validate('validateLoginUsername', $username);
 
 $session_key = $data['session_key'];
 @require_once('key.php');
 if(!validKey($session_key)){display(16);}
 
 validate('isLoggedIn',$username,$session_key);
 
 $GLOBALS['conn']->query("
  UPDATE users 
  SET 
   session_key = NULL,
   private_key = NULL, 
   last_active = NULL
  WHERE 
   username = '$username'
 ");
 
 display(0);
 
?>