<?php
 
 if(self(__FILE__)){
  
  $data = json_decode(file_get_contents("php://input"),true);
  //echo $data;

  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}

  $amount = $data["amount"];
  @require_once('isValidAmount.php');
  if(!isValidAmount($amount)){display(37);}
  
  
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
  
  @require_once('transaction.php');
  
  display(0, array('id' => transaction($username, $receiver, $amount, 1)));
 }
 
?>