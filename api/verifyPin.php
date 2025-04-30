<?php
 
 function verifyPin($username,$pin){
  @require_once('connection.php');
  $pinHash = md5($pin);
  $stmt = $GLOBALS['conn']->prepare("
   SELECT COUNT(*) 
   FROM users 
   WHERE username = :username 
    AND pin = :pin
  ");

  $stmt->execute([
   ':username' => $username,
   ':pin' => $pinHash
  ]);

  return ($stmt->rowCount() > 0);
 }
 
?>