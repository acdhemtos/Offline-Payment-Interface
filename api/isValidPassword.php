<?php

 function isValidPassword($password) {
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

 if(self(__FILE__)){
  display(isValidPassword(json_decode(file_get_contents("php://input"),true)["password"],false)); 
 }
 
?>