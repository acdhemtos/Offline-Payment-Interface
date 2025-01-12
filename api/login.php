<?php
 if (!@include_once('display.php')) {
  header('Content-Type: application/json; charset=utf-8');
  die('{"code":1,"debug":"Cannot Include message.php"}');
 }
 
 function generateSessionKey($length = 20) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{}|;:,.<>?';
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
 }
 
 try{
  $data = json_decode(file_get_contents("php://input"),true);
  
  $password = $data["password"];
  if (!@include('isValidPassword.php')) { display(1,"Cannot Include isValidPassword.php"); }
  $response = isValidPassword($password);
  if($response != 0){ display($response); }
  
  $password = $data["username"];
  if (!@include('validateLoginUsername.php')) { display(1,"Cannot Include validateLoginUsername.php"); }
  $response = validateLoginUsername($username);
  if($response != 0){ display($response); }
  
  if (!@include('connection.php')) { display(1,"Cannot Include connection.php"); }
  
  try{
   $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
   $stmt = $conn->prepare($sql);
   $stmt->bind_param("ss", $input_username, $input_password);
   $stmt->execute();
   $result = $stmt->get_result();

   if ($result->num_rows > 0) {
    $session_key = generateSessionString();
    
    try{
     $sql = "UPDATE users SET session_key = ? WHERE username = ?";
     $stmt_update = $conn->prepare($sql_update);
     $stmt_update->bind_param("ss", $session_key, $input_username);
     $stmt_update->execute();
     display(0,null,array("session_key" => $session_key));
    }catch(Exception $e) {
     display(1,"Cannot Execute Query.\n".$e->getMessage());
    }
   }else {
    display(16);
   }
  }catch(Exception $e) {
   display(1,"Cannot Execute Query.\n".$e->getMessage());
  }
  
  
 }catch(Exception $e) {
  display(1,"Cannot Parse data.\n".$e->getMessage());
 }
 
?>



