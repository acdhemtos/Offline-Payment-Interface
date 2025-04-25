<?php
 
 function isValidAmount($amount) {
  return (is_int($amount) && $amount > 0);
 }
 
?>