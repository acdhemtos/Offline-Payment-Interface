<?php
 header('Content-Type: application/json');
 function display($code, $debug){
  $message = array("code" => 1);
  if(isset($debug)){
   $message["debug"] = $debug;
  }
  die(json_encode($message));
 }
?>