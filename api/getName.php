<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 function getName($username){
  try{
   $stmt = $conn->prepare("SELECT name FROM users WHERE username = ?");
   $stmt->bind_param("s", $username);
   $stmt->execute();
   $stmt->bind_result($name);
   return $name;
  }catch(Exception $e) {
   display(1,"Cannot Execute Query.\n".$e->getMessage());
  }
 }
 
 if(basename(__FILE__)=="getName.php"){
  try{
   $username = json_decode(file_get_contents("php://input"),true)["username"];
   $response = validateLoginUsername($username);
   if($response != 0){ display($response); }
   display(0,null,array("name" => getName($username)));
  }catch(Exception $e) {
   display(1,"Cannot Parse Username.\n".$e->getMessage());
  }
 }
 
?>
