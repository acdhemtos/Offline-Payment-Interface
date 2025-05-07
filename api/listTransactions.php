<?php

 if(self(__FILE__)){
  
  $data = json_decode(file_get_contents("php://input"),true);

  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}

  $last_id = $data["last_id"];
  if(!is_int($last_id)){display(39);}

  @require_once 'getTransactions.php';
  $data = getTransactions($username,$last_id);


  @require_once 'getTransaction.php';
  for ($i = 0; $i < count($data); $i++) {
   $data[$i] = getTransaction($data[$i]);
  }

  display(0, array('data' => $data));
 }
 
?>