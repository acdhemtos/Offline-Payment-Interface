<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $password = $data["password"]; validate('isValidPassword',$password); $password_hash = md5($password);
 
 $username = $data["username"]; validate('validateLoginUsername', $username);
 
 @require_once('connection.php');

 if($GLOBALS['conn']->query("SELECT * FROM users WHERE username='$username' AND password='$password_hash'")->rowCount() > 0){
  @require_once('key.php');
  $session_key = generateKey();
  $private_key = generateKey();
  
  $GLOBALS['conn']->query("
   UPDATE users 
   SET 
    session_key = '$session_key',
    private_key = '$private_key',
    last_active = NOW() 
   WHERE 
    username = '$username'
  ");
  display(0,array("session_key" => $session_key,"private_key" => $private_key));
 }else {
  display(15);
 }
 
?>