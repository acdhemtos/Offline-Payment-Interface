<?php
 function sha256(...$strs) {
  return hash("sha256", implode('',$strs));
 }
 

 function isValidHash($string) {
  return preg_match('/^[a-f0-9]{64}$/i', $string) === 1;
 }
 
?>