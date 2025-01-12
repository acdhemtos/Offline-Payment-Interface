<?php
 header('Content-Type: application/json');
 function display($code, $debug){
  $message = array("code" => $code);
  if(isset($debug)){
   $message["debug"] = $debug;
  }
  die(json_encode($message));
 }
?>