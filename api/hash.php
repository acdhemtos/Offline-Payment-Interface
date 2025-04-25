<?php

 function sha256(...$strs) {
  $hash = ; 
  return array_values(\
   unpack(
    'C*',
    hash(
     'sha256', 
     implode(
      '',
      $strs
     ), 
     true
    )
   )
  ); 
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