<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 //if (!@include_once('connection.php')) { display(1,"Cannot Include connection.php"); }


 if(basename(__FILE__)=="signup.php"){
  try{
   $data = json_decode(file_get_contents("php://input"),true);
   
   $name = $data["name"];
   if (!@include('isValidName.php')) { display(1,"Cannot Include connection.php"); }
   $response = isValidName($name);
   if($response != 0){ display($response); }
   
   $password = $data["password"];
   if (!@include('isValidPassword.php')) { display(1,"Cannot Include connection.php"); }
   $response = isValidPassword($password);
   if($response != 0){ display($response); }
   
   $password = $data["username"];
   if (!@include('validateUsername.php')) { display(1,"Cannot Include connection.php"); }
   $response = validateUsername($username, $false);
   
   display(0);
  }catch(Exception $e) {
   display(1,"Cannot Parse data.\n".$e->getMessage());
  }
 }
 
?>