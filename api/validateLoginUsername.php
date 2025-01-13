<?php
 @require_once('validateUsername.php');
 
 function validateLoginUsername($username){
  $response = validUsername($username);
  if($response!=0){ return $response; }
  
  if(!usernameExists($username)){ return 6; }
  
  return 0;
 }
 
 if(self(__FILE__)){
  display(validateLoginUsername(json_decode(file_get_contents("php://input"),true)["username"]));
 }
 
?>