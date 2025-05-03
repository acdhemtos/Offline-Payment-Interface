<?php
 
 function transaction($senderUsername, $receiverUsername, $amount, $type) {
  $conn = $GLOBALS['conn']; // for easier use
  $senderId = 0;
  $receiverId = 0;

  if ($type != 0) {
      $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
      $stmt->execute([$senderUsername]);
      $senderId = $stmt->fetchColumn();
  }

  $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
  $stmt->execute([$receiverUsername]);
  $receiverId = $stmt->fetchColumn();

  $stmt = $conn->prepare("INSERT INTO transactions (sender, receiver, amount, type) VALUES (?, ?, ?, ?)");
  $stmt->execute([$senderId, $receiverId, $amount, $type]);
  $Id = $conn->lastInsertId();

  if ($type !== 0) {
      $stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
      $stmt->execute([$amount, $senderId]);

      @require_once('getTopUp.php');
      $data = getTopUp($senderUsername);
      $min = $data['min_balance'];
      $max = $data['max_balance'];

      @require_once('getBalance.php');
      $balance = getBalance($senderUsername);
      if ($balance < $min) {
          transaction(0, $senderUsername, $max - $balance, 0);
      }
  }

  $stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
  $stmt->execute([$amount, $receiverId]);

  return $Id;
}

?>