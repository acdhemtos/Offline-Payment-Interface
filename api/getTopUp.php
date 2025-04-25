<?php
 
 function getTopUp($ulu) {
    $stmt = $GLOBALS['conn']->prepare('SELECT min_balance, max_balance FROM users WHERE `username` = :username');
    $stmt->execute([':username' => $ulu]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

 if(self(__FILE__)){
  $data = json_decode(file_get_contents("php://input"),true);
  
  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}
  
  validate('isLoggedIn',$username,$session_key);
  
  display(0,getTopUp($username));
 }
 
?>