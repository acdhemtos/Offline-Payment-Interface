<?php
 
 function getTransaction($pdo, $id) {
  $sql = "
      SELECT 
          u1.username AS sender,
          u2.username AS receiver,
          t.amount,
          t.type,
          t.time
      FROM transactions t
      JOIN users u1 ON t.sender = u1.id
      JOIN users u2 ON t.receiver = u2.id
      WHERE t.id = :id
  ";

  $stmt = $GLOBALS['conn']->prepare($sql);
  $stmt->execute(['id' => $id]);
  return $stmt->fetch(PDO::FETCH_ASSOC);
 }

 if(self(__FILE__)){
  
  $data = json_decode(file_get_contents("php://input"),true);

  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}

  $id = $data["id"];
  if(!is_int($id)){display(39);}
  
  $transaction = getTransactions($id);

  display(0, array('data' => getTransactions($username,$last_id)));
 }
 
?>