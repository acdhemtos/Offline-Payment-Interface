<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 
 try{
  $data = json_decode(file_get_contents("php://input"),true);
  
  $name = $data["name"];
  if (!@include('isValidName.php')) { display(1,"Cannot Include isValidName.php"); }
  $response = isValidName($name);
  if($response != 0){ display($response); }
  
  $password = $data["password"];
  if (!@include('isValidPassword.php')) { display(1,"Cannot Include isValidPassword.php"); }
  $response = isValidPassword($password);
  if($response != 0){ display($response); }
  
  $password = $data["username"];
  if (!@include('validateSignupUsername.php')) { display(1,"Cannot Include validateSignupUsername"); }
  $response = validateSignupUsername($username);
  if($response != 0){ display($response); }
  
  if (!@include('connection.php')) { display(1,"Cannot Include connection.php"); }
  
  $stmt = $conn->prepare("INSERT INTO users (username, password, name) VALUES (?, ?)");
  $stmt->bind_param("ss", $username, md5($password), $name);
  if ($stmt->execute()) {
   display(0);
  } else {
   display(1,"Cannot Execute Query.\n" . $stmt->error);
  }
  $stmt->close();
  $conn->close();
  
 }catch(Exception $e) {
  display(1,"Cannot Parse data.\n".$e->getMessage());
 }
 
?>