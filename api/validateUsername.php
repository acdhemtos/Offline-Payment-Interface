<?php
 
 function usernameExists($username){
  @require_once('connection.php');
  $stmt = $GLOBALS['conn']->prepare("SELECT username FROM users WHERE username = ?");
  $stmt->execute([$username]);
  return ($stmt->rowCount() > 0);
 }
 
 function validUsername($username) {
  if (strlen($username) < 8 || strlen($username) > 15) {
   return 2;
  }
  if (!preg_match('/^[a-z][a-z0-9]*$/', $username)) {
   if (!preg_match('/^[a-z]/', $username)) {
    return 3;
   }
   if (preg_match('/[^a-z0-9]/', $username)) {
    return 4;
   }
  }
  return 0;
 }
 
?>