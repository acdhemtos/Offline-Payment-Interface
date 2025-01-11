<?php
 if (!@include_once('message.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"message":1,"debug":"Cannot Include message.php"}');
 }
 
 $servername = "192.168.29.194";
 $username = "your_username";
 $password = "your_password";
 $dbname = "pp";

 try {
  $conn = new mysqli($servername, $username, $password, $dbname);
 }catch(Exception $e) {
  $message['code'] = 1;
  $message['message'] = 1;
  $message['debug'] .= "Cannot Connect to Database.\n".$e->getMessage();
  die(json_encode($message));
 }
?>