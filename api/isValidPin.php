<?php
 
 function isValidPin($pin) {
  return is_string($pin) && strlen($pin) === 4 && ctype_digit($pin);
 }
?>