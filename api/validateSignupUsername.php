<?php
 @require_once('validateUsername.php');
 
 function validateSignupUsername($username){
  $response = validUsername($username);
  if($response!=0){ return $response; }
  
  if(usernameExists($username)){ return 5; }
  
  return 0;
 }
 
 if(self(__FILE__)){
  display(validateSignupUsername(json_decode(file_get_contents("php://input"),true)["username"]));
 }
 
?>