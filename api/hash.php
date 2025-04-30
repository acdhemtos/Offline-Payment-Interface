<?php
 function sha256(...$strs) {
  $hash = hash("sha256", $implode('',$strs), true);

  $base256String = '';
  foreach (str_split($hash) as $byte) {
   $base256String .= chr(ord($byte));
  }

  return $base256String;
 }
 function isValidBase256Hash($string) {
 if (strlen($string) !== 32) { return false; }
 for ($i = 0; $i < strlen($string); $i++) {
  $asciiValue = ord($string[$i]);
  if ($asciiValue < 0 || $asciiValue > 255) {
   return false;
  }
 }
 return true;
}

 function isValidHash($value) {
  if (!is_array($value) || count($value) !== 32) { return false; }
  
  foreach ($value as $element) {
   if (!is_int($element) || $element < 0 || $element > 255) {
    return false;
   }
  }

  return true;
 }
 
?>