<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 function validateUsername($username, $shouldExist) {
  if(!is_string($username)){
   display(1,"$username is not string.");
  }
  if (strlen($username) < 8 || strlen($username) > 15) {
   return 2;
  }
  if (!preg_match('/^[a-z][a-z0-9]*$/', $username)) {
   if (!preg_match('/^[a-z]/', $username)) {
    return 3;
   }
   if (preg_match('/[^a-z0-9]/', $username)) {
    return 4;
   }
  }
  if (!@include_once('connection.php')) {
   display(1,"Cannot Include connection.php");
  }
  try{
   $stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
   $stmt->bind_param("s", $username);
   $stmt->execute();
   $stmt->store_result();
   if ($stmt->num_rows > 0 xor $shouldExist) {
    return 0;
   }else if($shouldExist){
    return 6;
   }else{
    return 5;
   }
  }catch(Exception $e) {
   display(1,"Cannot Execute Query.\n".$e->getMessage());
  }
 }
 if(basename(__FILE__)=="validateUsername.php"){
  try{
   display(validateUsername(json_decode(file_get_contents("php://input"),true)["username"],false));
  }catch(Exception $e) {
   display(1,"Cannot Parse Username.\n".$e->getMessage());
  }
 }
 
?>