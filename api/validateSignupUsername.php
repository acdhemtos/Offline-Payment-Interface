<?php
 if (!@include_once('validateUsername.php')) {
  display(1,"Cannot Include message.php");
 }
 
 function validateSignupUsername($username){
  $response = validUsername($username);
  if($response!=0){ return $response; }
  
  if(usernameExists($username)){ return 5; }
  
  return 0;
 }
 
 if(basename(__FILE__)=="validateSignupUsername.php"){
  try{
   display(validateSignupUsername(json_decode(file_get_contents("php://input"),true)["username"]));
  }catch(Exception $e) {
   display(1,"Cannot Parse Username.\n".$e->getMessage());
  }
 }
 
?>