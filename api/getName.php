<?php
 
 function getName($username){
  return $conn->query("SELECT name FROM users WHERE username = '$sanitized_username'")->fetchColumn();
 }
 
 if(self(__FILE__)){
  $username = json_decode(file_get_contents("php://input"),true)["username"];
  validate('validateLoginUsername', $username);
  display(0,array("name" => getName($username)));
 }
 
?>
