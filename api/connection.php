<?php
 if (!@include_once('message.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"message":1,"debug":"Cannot Include message.php"}');
 }
 
 $servername = "localhost";
 $username = "root";
 $password = "";
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