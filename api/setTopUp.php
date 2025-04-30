<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $username = $data["username"]; validate('validateLoginUsername', $username);

 $session_key = $data['session_key'];
 @require_once('key.php');
 if(!validKey($session_key)){display(16);}
 
 @require_once('validateAmount.php');
 
 $min_balance = $data['min_balance'];
 if(!validAmount($min_balance)){display(18);}
 
 $max_balance = $data['max_balance'];
 if(!validAmount($max_balance)){display(19);}
 
 if($max_balance<=$min_balance){display(20);}
 
 validate('isLoggedIn',$username,$session_key);
 
 $GLOBALS['conn']->prepare('
  UPDATE users 
  SET 
   min_balance = :min, 
   max_active = :max
  WHERE 
   username = :username
 ')->execute([
  ':min' => $min_balance,
  ':max' => $max_balance,
  ':username' => $username
 ]);
 
 display(0);
 
?>