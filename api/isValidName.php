<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 function isValidName($name) {
  if(!is_string($name)){
   display(1,"$name is not string.");
  }
  
  if (strlen($name) < 8 || strlen($name) > 60) {
   return 13;
  }
  
  if (preg_match('/^\s|\s$/', $name)) {
   return 14;
  }
  
  if (!preg_match('/^[a-z ]+$/', $name)) {
   return 15;
  }
  
  return 0;
 }

 if(basename(__FILE__)=="isValidName.php"){
  try{
   display(isValidName(json_decode(file_get_contents("php://input"),true)["name"],false));
  }catch(Exception $e) {
   display(1,"Cannot Parse Name.\n".$e->getMessage());
  }
 }
 
?>