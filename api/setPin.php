<?php
 
 $data = json_decode(file_get_contents("php://input"),true);
 
 $username = $data["username"]; validate('validateLoginUsername', $username);

 $session_key = $data['session_key'];
 @require_once('key.php');
 if(!validKey($session_key)){display(16);}
 
 $pin = $data['pin'];
 @require_once('isValidPin.php');
 if(!isValidPin($pin)){display(21);}
 
 validate('isLoggedIn',$username,$session_key);
 
 @require_once('isPinSet.php');
 if(isPinSet($username)){display(22);}
 
 $pinHash = md5($pin);
 $GLOBALS['conn']->prepare("
  UPDATE users
  SET pin = :pin
  WHERE username = :username"
 )->execute([
  ':pin' => $pinHash,
  ':username' => $username
 ]);
 
 display(0);
 
 
?>