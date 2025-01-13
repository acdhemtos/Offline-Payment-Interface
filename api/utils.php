<?php
 header('Content-Type: application/json');
 
 function display($code, $additional=array()){
  die(json_encode(array_merge(array("code" => $code), $additional)));
 }
 
 set_exception_handler('handleException');
 
 function handleException(Throwable $exception) {
  display(1,array("debug" => $exception->getMessage()));
 }
 
 function self($__FILE__){
  return basename($_SERVER['PHP_SELF']) == basename($__FILE__);
 }
 
 function validate($file,...$params){
  @require_once($file."php");
  $response = $function(...$params);
  if ($response != 0) { display($response); }
  return $response;
 }
 
?>