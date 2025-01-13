<?php
 
 try{
  $data = json_decode(file_get_contents("php://input"),true);
  
  $password = $data["password"];
  validate('isValidPassword',$password);
  
  $username = $data["username"];
 validate('validateLoginUsername', $username);
  
  requireFile('connection');
  
  try{
   $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
   $stmt = $GLOBALS['conn']->prepare($sql);
   $stmt->bind_param("ss", $input_username, $input_password);
   $stmt->execute();
   $result = $stmt->get_result();

   if ($result->num_rows > 0) {
    if (!@include('key.php')) { display(1,"Cannot Include key.php"); }
    
    $session_key = generateKey();
    
    try{
     $sql = "UPDATE users SET session_key = ? WHERE username = ?";
     $stmt_update = $conn->prepare($sql_update);
     $stmt_update->bind_param("ss", $session_key, $input_username);
     $stmt_update->execute();
     display(0,null,array("session_key" => $session_key));
    }catch(Exception $e) {
     display(1,"Cannot Execute Query.\n".$e->getMessage());
    }
   }else {
    display(16);
   }
  }catch(Exception $e) {
   display(1,"Cannot Execute Query.\n".$e->getMessage());
  }
  
  
 }catch(Exception $e) {
  display(1,"Cannot Parse data.\n".$e->getMessage());
 }
 
?>



