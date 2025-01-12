<?php
 header('Content-Type: application/json');
 function display($code, $debug=null, $additional=array()){
  $message = array("code" => $code);
  if(isset($debug)){
   $message["debug"] = $debug;
  }
  die(json_encode(array_merge($message, $additional)));
 }
?>