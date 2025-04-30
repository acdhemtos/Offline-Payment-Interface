<?php
 header('Content-Type: application/json');
 
 function display($code, $additional=array()){
  die(json_encode(array_merge(array("code" => $code), $additional)));
 }
 
 set_exception_handler('handleException');
 
 function handleException(Throwable $e) {
  $debug = array();
  $debug['Message'] = $e->getMessage();
  $debug['Code'] = $e->getCode();
  $debug['File'] = $e->getFile();
  $debug['Line'] = $e->getLine();
  $debug['Tract'] = $e->getTraceAsString();
   
  display(1,array("debug" => $debug));
 }

 set_error_handler("customWarningHandler", E_WARNING);
 function customWarningHandler($errno, $errstr, $errfile, $errline) {
  display(1,array("debug" => "Warning [$errno]: $errstr in $errfile on line $errline"));  
  return true;
 }

 function self($__FILE__){
  return basename($_SERVER['PHP_SELF']) == basename($__FILE__);
 }
 
 function validate($file,...$params){
  @require_once("$file.php");
  $response = $file(...$params);
  if ($response != 0) { display($response); }
 }
 
?>