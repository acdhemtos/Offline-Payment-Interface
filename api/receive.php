<?php
 $data = json_decode(file_get_contents("php://input"),true);
 
 $details_hash = $data["details_hash"];
 @require_once('connection.php');
 
 $sender = $data["sender"];
 
 $stmt = $GLOBALS['conn']->prepare('SELECT private_key FROM users WHERE username = :username');
 $stmt->execute([':username' => $sender]);
 $private_key = $stmt->fetchColumn();
 
 function handle($int, $Id=""){
  global $private_key;
  global $details_hash;
  
  if($int==0){
   display(0,array('id'=>$Id,'verification_hash' => md5($details_hash."0".$Id.$private_key)));
  }
  display($int,array('verification_hash' => md5($details_hash.$int.$private_key)));
 }
 
 $session_key = $data['session_key'];
 @require_once('key.php');
 if(!validKey($session_key)){display(16);}
 
 $amount = $data["amount"];
 @require_once('isValidAmount.php');
 if(!isValidAmount($amount)){display(37);}
 
 $time = $data["time"];
 if(!isValidAmount($time)){display(38);}
 
 $sender = $data["sender"];
 $username = $data["username"];

 if($sender==$username){display(31);}
 @require_once('validateUsername.php');
 if(validUsername($sender)!=0){display(32);}
 
 validate('validateLoginUsername', $username);
 
 if(!usernameExists($sender)){display(33);}
 
 validate('isLoggedIn',$username,$session_key);
 
 $TL = 5;
 //if (round(microtime(true) * 1000) - $time > 5*1000){handle(34);}
 
 @require_once 'hash.php';
 
 $details_hash = $data["details_hash"];
 if(!isValidHash($details_hash)){handle(36);}
 
 @require_once('getName.php');
 $name = getName($username);
 
 if($details_hash!=md5($username.$name.$amount.$time.$private_key)){handle(35);}
 
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

 $GLOBALS['conn']->commit();
 //auto TopUp
 handle(0,$Id);
 
?>