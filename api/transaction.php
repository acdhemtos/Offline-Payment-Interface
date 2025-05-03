<?php
 
 function transaction($senderUsername, $receiverUsername, $amount, $type) {
  $senderId = 0;
  $receiverId = 0;

  if ($type!=0) {
   $stmt = $GLOBALS['conn']->prepare("SELECT id FROM users WHERE username = ?");
   $stmt->bind_param("s", $senderUsername);
   $stmt->execute();
   $stmt->bind_result($senderId);
   $stmt->fetch();
   $stmt->close();
  }

  $stmt = $GLOBALS['conn']->prepare("SELECT id FROM users WHERE username = ?");
  $stmt->bind_param("s", $receiverUsername);
  $stmt->execute();
  $stmt->bind_result($receiverId);
  $stmt->fetch();
  $stmt->close();

  $stmt = $GLOBALS['conn']->prepare("INSERT INTO transactions (sender, receiver, amount, type) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("iiii", $senderId, $receiverId, $amount, $type);
  $stmt->execute();
  $stmt->close();
  
  $Id = $GLOBALS['conn']->insert_id;

  if ($type !== 0) {
   $stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
   $stmt->bind_param("ii", $amount, $senderId);
   $stmt->close();
   
   @require_once('getTopUp.php');
   $data = getTopUp($senderUsername);
   $min = $data['min_balance'];
   $max = $data['max_balance'];
   
   @require_once('getBalance.php');
   $balance = getBalance($senderUsername);
   if($balance<$min){
    @require_once('topUp.php');
    transaction(0,$senderUsername,$max-$balance,0);
   }
  }

  $stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
  $stmt->bind_param("ii", $amount, $receiverId);
  $stmt->execute();
  $stmt->close();

  if($senderId!=0){
    
  }

  return $Id;
 }



?>