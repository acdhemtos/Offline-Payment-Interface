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
   display(0,array('id'=>$Id,'verification_hash' => sha256($details_hash."0".$Id.$private_key)));
  }
  display($int,array('verification_hash' => sha256($details_hash.$int.$private_key)));
 }
 
 $amount = $data["amount"];
 @require_once('isValidAmount.php');
 if(!isValidAmount($amount)){display(37);}
 
 $time = $data["time"];
 if(!isValidAmount($time)){display(38);}
 
 $username = $data["username"];
 
 
 //if(!usernameExists($sender)){display(33);}

 
 $TL = 5;
 //if (round(microtime(true) * 1000) - $time > 5*1000){handle(34);}
 
 @require_once 'hash.php';
 
 $details_hash = $data["details_hash"];
 if(!isValidHash($details_hash)){display(36);}
 
 @require_once('getName.php');
 $name = getName($username);
 
 //if($details_hash!=sha256($username.$amount.$name.$time.$private_key)){display(35);}
 
 @require_once('getBalance.php');
 if(getBalance($sender)<$amount){handle(30);}

 @require_once('transaction.php');
 
 handle(0,transaction($sender, $username, $amount, 2));
 
?>