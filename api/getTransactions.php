<?php
 
 if(self(__FILE__)){
  
  $data = json_decode(file_get_contents("php://input"),true);
  //echo $data;

  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}

  $last_id = $data["last_id"];
  @require_once('isValidAmount.php');
  if(!is_int($last_id)){display(37);}
  
  
  $pin = $data['pin'];
  @require_once('isValidPin.php');
  if(!isValidPin($pin)){display(21);}
  
  $receiver = $data["receiver"];
  
  if($receiver==$username){display(27);}
  
  @require_once('validateUsername.php');
  if(validUsername($receiver)!=0){display(28);}
  if(!usernameExists($receiver)){display(26);}
  
  validate('isLoggedIn',$username,$session_key);
  
  @require_once('verifyPin.php');
  if(!verifyPin($username,$pin)){display(29);}
  
  @require_once('getBalance.php');
  if(getBalance($username)<$amount){display(30);}
  
  $GLOBALS['conn']->beginTransaction();

  $stmt = $GLOBALS['conn']->prepare('
   INSERT INTO transactions (sender, receiver, amount, type)
   VALUES (
    (SELECT id FROM users WHERE username = :senderUsername),
    (SELECT id FROM users WHERE username = :receiverUsername),
    :amount,
    :type
   )
  ');
  $stmt->execute([
   ':senderUsername' => $username,
   ':receiverUsername' => $receiver,
   ':amount' => $amount,
   ':type' => 1
  ]);
  
  $Id = $GLOBALS['conn']->lastInsertId();
  
  $stmt = $GLOBALS['conn']->prepare('
   UPDATE users
   SET balance = balance - :amount
   WHERE username = :senderUsername
  ');
  $stmt->execute([
   ':amount' => $amount,
   ':senderUsername' => $username
  ]);
  
  $stmt = $GLOBALS['conn']->prepare('
   UPDATE users
   SET balance = balance + :amount
   WHERE username = :receiverUsername
  ');
  $stmt->execute([
   ':amount' => $amount,
   ':receiverUsername' => $receiver
  ]);

  $GLOBALS['conn']->commit();
  
  @require_once('getTopUp.php');
  $data = getTopUp($username);
  $min = $data['min_balance'];
  $max = $data['max_balance'];
  
  @require_once('getBalance.php');
  $balance = getBalance($username);
  if($balance<$min){
   @require_once('topUp.php');
   topUp($username,$max-$balance);
  }
  
  display(0, array('id' => $Id));
 }
 
?>