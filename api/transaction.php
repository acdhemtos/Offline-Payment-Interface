<?php
 
 function transaction($senderUsername, $receiverUsername, $amount, $type) {
  $senderId = 0;
  $receiverId = 0;

  if (!is_null($senderUsername)) {
   $stmt = $GLOBALS['conn']->prepare("SELECT id FROM users WHERE username = ?");
   $stmt->bind_param("s", $senderUsername);
   $stmt->execute();
   $stmt->bind_result($senderId);
   $stmt->fetch();
   $stmt->close();
  }

  if (!is_null($receiverUsername)) {
  $stmt = $GLOBALS['conn']->prepare("SELECT id FROM users WHERE username = ?");
  $stmt->bind_param("s", $receiverUsername);
  $stmt->execute();
  $stmt->bind_result($receiverId);
  $stmt->fetch();
  $stmt->close();
  }

  $stmt = $GLOBALS['conn']->prepare("INSERT INTO transactions (sender, receiver, amount, type) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("iiii", $senderId, $receiverId, $amount, $type);
  $stmt->execute();
  $stmt->close();
  
  if ($senderId !== 0) {
   $stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
   $stmt->bind_param("ii", $amount, $senderId);
   if (!$stmt->execute()) throw new Exception("Sender update failed: " . $stmt->error);
   $stmt->close();
  }

  $stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
  $stmt->bind_param("ii", $amount, $receiverId);
  $stmt->execute();
  $stmt->close();
 }



?>