<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $details_hash = $data["details_hash"];
 @require_once('connection.php');
 @require_once('hash.php');
 
 
 $sender = $data["sender"];
 
 $stmt = $GLOBALS['conn']->prepare('SELECT private_key FROM users WHERE username = :username');
 $stmt->execute([':username' => $sender]);
 $private_key = $stmt->fetchColumn();
 
 function handle($int, $Id=""){
  global $private_key;
  global $details_hash;
  if($int==0){
   display(0,array('id'=>(int)$Id,'verification_hash' => sha256($details_hash."0".$Id.$private_key)));
  }
  display($int,array('verification_hash' => sha256($details_hash.$int.$private_key)));
 }
 
 $session_key = $data['session_key'];
 @require_once('key.php');
 if(!validKey($session_key)){display(16);}
 
 $amount = $data["amount"];
 @require_once('isValidAmount.php');
 if(!isValidAmount($amount)){display(37);}
 
 $time = $data["time"];
 if(!isValidAmount($time)){display(38);}
 
 $username = $data["username"];
 $sender = $data["sender"];
 if($sender==$username){display(31);}
 @require_once('validateUsername.php');
 if(validUsername($sender)!=0){display(32);}
 
 validate('validateLoginUsername', $username);
 
 if(!usernameExists($sender)){display(33);}
 
 validate('isLoggedIn',$username,$session_key);
 
 
 $details_hash = $data["details_hash"];
 if(!isValidHash($details_hash)){display(36);}
 
 @require_once('getName.php');
 $name = getName($username);
 
 //debug
 
 if($details_hash!=sha256($username.$amount.$name.$time.$private_key)){display(35);}
 
 $TL = 10;
 //if (round(microtime(true) * 1000) - $time > 10*1000){display(34);}
 
 $sql = "SELECT COUNT(*) FROM past_hashes WHERE sender = :sender AND receiver = :receiver AND hash = :hash";
 $stmt = $GLOBALS['conn']->prepare($sql);
 $stmt->bindParam(':sender', $sender, PDO::PARAM_STR);
 $stmt->bindParam(':receiver', $username, PDO::PARAM_STR);
 $stmt->bindParam(':hash', $details_hash, PDO::PARAM_STR);
 $stmt->execute();

 if ($stmt->fetchColumn() > 0) { display(34); }


 @require_once('getBalance.php');
 if(getBalance($sender)<$amount){handle(30);}
 

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
  ':senderUsername' => $sender,
  ':receiverUsername' => $username,
  ':amount' => $amount,
  ':type' => 2
 ]);
 
 $Id = $GLOBALS['conn']->lastInsertId();
 
 $stmt = $GLOBALS['conn']->prepare('
  UPDATE users
  SET balance = balance - :amount
  WHERE username = :senderUsername
 ');
 $stmt->execute([
  ':amount' => $amount,
  ':senderUsername' => $sender
 ]);
 
 $stmt = $GLOBALS['conn']->prepare('
  UPDATE users
  SET balance = balance + :amount
  WHERE username = :receiverUsername
 ');
 $stmt->execute([
  ':amount' => $amount,
  ':receiverUsername' => $username
 ]);
 $sql = "INSERT INTO past_hashes (sender, receiver, hash, time) VALUES (:sender, :receiver, :hash, :time)";
 $stmt = $GLOBALS['conn']->prepare($sql);
 $stmt->bindParam(':sender', $sender, PDO::PARAM_STR);
 $stmt->bindParam(':receiver', $username, PDO::PARAM_STR);
 $stmt->bindParam(':hash', $details_hash, PDO::PARAM_STR);
 $stmt->bindParam(':time', $time, PDO::PARAM_INT);
 $stmt->execute();

 $GLOBALS['conn']->commit();



 @require_once('getTopUp.php');
 $data = getTopUp($sender);
 $min = $data['min_balance'];
 $max = $data['max_balance'];
 
 @require_once('getBalance.php');
 $balance = getBalance($sender);
 if($balance<$min){
  @require_once('topUp.php');
  topUp($sender,$max-$balance);
 }
 handle(0,$Id);
 
?>