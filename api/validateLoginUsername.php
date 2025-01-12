<?php
 if (!@include_once('validateUsername.php')) {
  display(1,"Cannot Include message.php");
 }
 
 function validateLoginUsername($username){
  $response = validUsername($username);
  if($response!=0){ return $response; }
  
  if(!usernameExists($username)){ return 6; }
  
  return 0;
 }
 
 if(basename(__FILE__)=="validateLoginUsername.php"){
  try{
   display(validateLoginUsername(json_decode(file_get_contents("php://input"),true)["username"],false));
  }catch(Exception $e) {
   display(1,"Cannot Parse Username.\n".$e->getMessage());
  }
 }
 
?>