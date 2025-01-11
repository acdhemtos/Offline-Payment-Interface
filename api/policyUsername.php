<?php
 if (!@include_once('message.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"message":1,"debug":"Cannot Include message.php"}');
 }
 
 function isValidUsername($username) {
  if (preg_match('/^[a-z][a-z0-9]*$/', $username)) {
   return true;
  } else {
   return false;
  }
 }
 if(basename(__FILE__)=="policyUsername.php"){
  try{
   if(isValidUsername(json_decode(file_get_contents("php://input"),true)["username"])){
    $message['code'] = 0;
    $message['message'] = 3;
   }else{
    $message['code'] = 1;
    $message['message'] = 2;
   }
   
  }catch(Exception $e) {
   $message['code'] = 1;
   $message['message'] = 1;
   $message['debug'] = "Cannot Parse Data.\n".$e->getMessage();
  }
  die(json_encode($message));
 }
 
?>