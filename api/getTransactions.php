<?php
 
function getTransactions($username,$last_id){
 $sql = "
  SELECT t.id
  FROM transactions t
  JOIN users u_sender ON t.sender = u_sender.id
  JOIN users u_receiver ON t.receiver = u_receiver.id
  WHERE (u_sender.username = :username OR u_receiver.username = :username)
   AND t.id > :last_id
  ORDER BY t.time ASC
 ";

 $stmt = $GLOBALS['conn']->prepare($sql);
 $stmt->execute(['username' => $username, 'last_id' => $last_id]);

 return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

 if(self(__FILE__)){
  
  $data = json_decode(file_get_contents("php://input"),true);

  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}

  $last_id = $data["last_id"];
  if(!is_int($last_id)){display(39);}
  
  display(0, array('ids' => getTransactions($username,$last_id)));
 }
 
?>