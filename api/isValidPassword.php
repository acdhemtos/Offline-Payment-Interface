<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 function isValidPassword($password) {
  if(!is_string($password)){
   display(1,"$password is not string.");
  }
  if (strlen($password) < 8 || strlen($password) > 30) {
   return 7;
  }
  if (!preg_match('/[a-z]/', $password)) {
   return 8;
  }
  if (!preg_match('/[A-Z]/', $password)) {
   return 9;
  }
  if (!preg_match('/[0-9]/', $password)) {
   return 10;
  }
  if (!preg_match('/[\W_]/', $password)) {
   return 11;
  }
  return 0;
 }

 if(basename(__FILE__)=="isValidPassword.php"){
  try{
   display(isValidPassword(json_decode(file_get_contents("php://input"),true)["password"],false));
  }catch(Exception $e) {
   display(1,"Cannot Parse Password.\n".$e->getMessage());
  }
 }
 
?>