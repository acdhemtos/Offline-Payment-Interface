<?php
 
 function isValidName($name) {
  if (strlen($name) < 1 || strlen($name) > 60) {
   return 12;
  }
  if (preg_match('/^\s|\s$/', $name)) {
   return 13;
  }
  if (!preg_match('/^[a-z ]+$/', $name)) {
   return 14;
  }
  return 0;
 }

 if(self(__FILE__)){
  display(isValidName(json_decode(file_get_contents("php://input"),true)["name"],false));
 }
 
?>