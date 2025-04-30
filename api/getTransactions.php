<?php
 
 function getTransactions($username){
  @require_once("connection.php");
  $sql = "
   SELECT 
            t.id,
            CASE 
                WHEN t.sender = u.id THEN 
                    (SELECT username FROM `users` WHERE id = t.receiver) 
                ELSE 
                    (SELECT username FROM `users` WHERE id = t.sender) 
            END AS other,
            CASE 
                WHEN t.sender = u.id THEN t.type * -1
                ELSE t.type
            END AS transaction_type,
            t.amount,
            t.time
        FROM `transactions` t
        JOIN `users` u
            ON t.sender = u.id OR t.receiver = u.id
        WHERE u.username = :username
   ORDER BY time DESC;
  ";

    
    $stmt = $GLOBALS['conn']->prepare($sql);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
 }
 
 if(self(__FILE__)){
  $data = json_decode(file_get_contents("php://input"),true);
  
  $username = $data["username"]; validate('validateLoginUsername', $username);
 
  $session_key = $data['session_key'];
  @require_once('key.php');
  if(!validKey($session_key)){display(16);}
  
  validate('isLoggedIn',$username,$session_key);
  
  display(0,array("transactions" => getTransactions($username)));
 }
 
?>