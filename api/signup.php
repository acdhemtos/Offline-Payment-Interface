<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $name = $data["name"]; validate('isValidName',$name);
 
 $password = $data["password"]; validate('isValidPassword',$password);
 
 $username = $data["username"]; validate('validateSignupUsername', $username);
  
 @require_once('connection.php');
  
 $stmt = $GLOBALS['conn']->prepare("INSERT INTO users (username, password, name) VALUES (?, ?)");
 $stmt->bind_param("ss", $username, md5($password), $name);
 if ($stmt->execute()) {
  display(0, "msg");
 } else {
  display(1,"Cannot Execute Query.\n" . $stmt->error);
 } 
  
  $stmt->close();
  
 
?>