<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $name = $data["name"]; validate('isValidName',$name);
 
 $password = $data["password"]; validate('isValidPassword',$password);
 $hashed_password = md5($password);
 
 $username = $data["username"]; validate('validateSignupUsername', $username);
  
 @require_once('connection.php');
  
 $GLOBALS['conn']->query("INSERT INTO users (username, password, name) VALUES ('$username', '$hashed_password', '$name')");
 
 display(0); 
 
?>