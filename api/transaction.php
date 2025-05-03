<?php
 
 function transaction($username,$amount){
  $GLOBALS['conn']->beginTransaction();
  
  $GLOBALS['conn']->prepare('
   UPDATE users 
   SET 
    balance = balance + :amount 
   WHERE 
    username = :username
  ')->execute([
   ':amount' => $amount,
   ':username' => $username
  ]);
  
  $GLOBALS['conn']->prepare('
   INSERT INTO transactions (receiver, amount, type)
   VALUES (
    (SELECT id FROM users WHERE username = :receiverUsername),
    :amount,
    :type
   )
  ')->execute([
   ':receiverUsername' => $username,
   ':amount' => $amount,
   ':type' => 0
  ]);
  
  $GLOBALS['conn']->commit();
 }
?>