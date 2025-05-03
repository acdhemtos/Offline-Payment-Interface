<?php
 
function getTransactions($username,$last_id){

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