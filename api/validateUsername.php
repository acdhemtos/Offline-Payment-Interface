<?php
 if (!@include_once('message.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"message":1,"debug":"Cannot Include message.php"}');
 }
 
 function validateUsername($username) {
  global $message;
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
   $message['debug'] = "Cannot Include connection.php";
   return 1;
  }else{
   try{
    $stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
     return true;
    }else{
     return 5;
    }
   }catch(Exception $e) {
    $message['debug'] = "Cannot Execute Query.\n".$e->getMessage();
    return 1;
   }
  }
 }
 if(basename(__FILE__)=="validateUsername.php"){
  try{
   $response = validateUsername(json_decode(file_get_contents("php://input"),true)["username"]);
   if($response == true){
    $message['code'] = 0;
   }else{
    $message['message'] = $response;
   }
  }catch(Exception $e) {
   $message['message'] = 1;
   $message['debug'] = "Cannot Parse Username.\n".$e->getMessage();
  }
  die(json_encode($message));
 }
 
?>