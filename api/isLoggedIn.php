<?php

 function isLoggedIn($username,$session_key){
  if (!@include('validateLoginUsername.php')) { display(1,"Cannot Include validateLoginUsername.php"); }
  $response = validateLoginUsername($username);
  if($response!=0) { display($response); }
  
  if (!@include('key.php')) { display(1,"Cannot Include key.php"); }
  if(validateKey($session_key);
  if($response!=0) { display($response); }
  
 }
 
 

?>